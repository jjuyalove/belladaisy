export const dbToGain = (db) => 10 ** (db / 20);

const now = (context) => context.currentTime;

const setAudioParam = (param, value, context) => {
  param.cancelScheduledValues(now(context));
  param.setTargetAtTime(value, now(context), 0.015);
};

export const createMasteringGraph = (context, settings) => {
  const input = context.createGain();
  const inputGain = context.createGain();
  const bass = context.createBiquadFilter();
  const mid = context.createBiquadFilter();
  const treble = context.createBiquadFilter();
  const compressor = context.createDynamicsCompressor();
  const limiter = context.createDynamicsCompressor();
  const outputGain = context.createGain();

  bass.type = 'lowshelf';
  bass.frequency.value = 140;

  mid.type = 'peaking';
  mid.frequency.value = 1200;
  mid.Q.value = 0.9;

  treble.type = 'highshelf';
  treble.frequency.value = 5200;

  limiter.knee.value = 0;
  limiter.ratio.value = 20;
  limiter.attack.value = 0.003;
  limiter.release.value = 0.06;

  input.connect(inputGain);
  inputGain.connect(bass);
  bass.connect(mid);
  mid.connect(treble);
  treble.connect(compressor);
  compressor.connect(limiter);
  limiter.connect(outputGain);

  const graph = { input, inputGain, bass, mid, treble, compressor, limiter, outputGain, output: outputGain };
  updateMasteringGraph(graph, settings, context);
  return graph;
};

export const updateMasteringGraph = (graph, settings, context) => {
  const amount = settings.compressor / 100;

  setAudioParam(graph.inputGain.gain, dbToGain(settings.inputGain), context);
  setAudioParam(graph.bass.gain, settings.bass, context);
  setAudioParam(graph.mid.gain, settings.mid, context);
  setAudioParam(graph.treble.gain, settings.treble, context);

  setAudioParam(graph.compressor.threshold, -12 - amount * 28, context);
  setAudioParam(graph.compressor.knee, 18 - amount * 12, context);
  setAudioParam(graph.compressor.ratio, 1 + amount * 7, context);
  setAudioParam(graph.compressor.attack, 0.025 - amount * 0.018, context);
  setAudioParam(graph.compressor.release, 0.28 - amount * 0.16, context);

  setAudioParam(graph.limiter.threshold, settings.limiter, context);
  setAudioParam(graph.outputGain.gain, dbToGain(settings.outputGain), context);
};

const audioBufferToWavBlob = (buffer) => {
  const channelCount = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bytesPerSample = 2;
  const blockAlign = channelCount * bytesPerSample;
  const dataSize = buffer.length * blockAlign;
  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);
  let offset = 0;

  const writeString = (value) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset, value.charCodeAt(i));
      offset += 1;
    }
  };

  writeString('RIFF');
  view.setUint32(offset, 36 + dataSize, true);
  offset += 4;
  writeString('WAVE');
  writeString('fmt ');
  view.setUint32(offset, 16, true);
  offset += 4;
  view.setUint16(offset, 1, true);
  offset += 2;
  view.setUint16(offset, channelCount, true);
  offset += 2;
  view.setUint32(offset, sampleRate, true);
  offset += 4;
  view.setUint32(offset, sampleRate * blockAlign, true);
  offset += 4;
  view.setUint16(offset, blockAlign, true);
  offset += 2;
  view.setUint16(offset, 16, true);
  offset += 2;
  writeString('data');
  view.setUint32(offset, dataSize, true);
  offset += 4;

  for (let sample = 0; sample < buffer.length; sample += 1) {
    for (let channel = 0; channel < channelCount; channel += 1) {
      const value = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[sample]));
      view.setInt16(offset, value < 0 ? value * 0x8000 : value * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: 'audio/wav' });
};

export const renderMasteredWav = async (sourceBuffer, settings) => {
  const offlineContext = new OfflineAudioContext(
    sourceBuffer.numberOfChannels,
    sourceBuffer.length,
    sourceBuffer.sampleRate,
  );
  const source = offlineContext.createBufferSource();
  const graph = createMasteringGraph(offlineContext, settings);

  source.buffer = sourceBuffer;
  source.connect(graph.input);
  graph.output.connect(offlineContext.destination);
  source.start(0);

  const renderedBuffer = await offlineContext.startRendering();
  return audioBufferToWavBlob(renderedBuffer);
};
