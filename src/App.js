import React, { useEffect, useRef, useState } from 'react';
import { createMasteringGraph, renderMasteredWav, updateMasteringGraph } from './audio/masteringEngine.js';
import { presetOrder, presets, sliders } from './audio/presets.js';
import { stemSeparationRoadmap } from './features/mastering/stemSeparation.js';

const h = React.createElement;
const acceptTypes = 'audio/mpeg,audio/mp3,audio/wav,audio/x-wav';

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
};

function App() {
  const [settings, setSettings] = useState(presets.Clean);
  const [selectedPreset, setSelectedPreset] = useState('Clean');
  const [track, setTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [message, setMessage] = useState('Upload an MP3 or WAV file to start mastering.');

  const audioContextRef = useRef(null);
  const graphRef = useRef(null);
  const sourceRef = useRef(null);
  const startedAtRef = useRef(0);
  const pausedAtRef = useRef(0);
  const settingsRef = useRef(settings);

  const ensureAudioContext = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      graphRef.current = createMasteringGraph(audioContextRef.current, settingsRef.current);
      graphRef.current.output.connect(audioContextRef.current.destination);
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    return audioContextRef.current;
  };

  const stopPlayback = () => {
    if (sourceRef.current) {
      sourceRef.current.onended = null;
      sourceRef.current.stop();
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    setIsPlaying(false);
  };

  const playFrom = async (offset) => {
    if (!track) return;
    const context = await ensureAudioContext();
    const graph = graphRef.current;
    if (!graph) return;

    stopPlayback();

    const source = context.createBufferSource();
    source.buffer = track.buffer;
    source.connect(graph.input);
    source.onended = () => {
      const elapsed = context.currentTime - startedAtRef.current + offset;
      if (elapsed >= track.duration - 0.05) {
        pausedAtRef.current = 0;
        sourceRef.current = null;
        setIsPlaying(false);
      }
    };

    startedAtRef.current = context.currentTime;
    source.start(0, offset);
    sourceRef.current = source;
    setIsPlaying(true);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('audio') && !/\.(mp3|wav)$/i.test(file.name)) {
      setMessage('Please choose an MP3 or WAV audio file.');
      return;
    }

    try {
      stopPlayback();
      pausedAtRef.current = 0;
      const context = await ensureAudioContext();
      const arrayBuffer = await file.arrayBuffer();
      const decodedBuffer = await context.decodeAudioData(arrayBuffer.slice(0));
      setTrack({ name: file.name, duration: decodedBuffer.duration, buffer: decodedBuffer });
      setMessage(`${file.name} is ready for real-time preview.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not decode the selected audio file.');
    }
  };

  const handlePlayPause = async () => {
    if (!track) {
      setMessage('Upload an audio file before pressing play.');
      return;
    }

    if (isPlaying) {
      const context = audioContextRef.current;
      if (context) {
        pausedAtRef.current += context.currentTime - startedAtRef.current;
        pausedAtRef.current %= track.duration;
      }
      stopPlayback();
      return;
    }

    await playFrom(pausedAtRef.current);
  };

  const handlePreset = (preset) => {
    setSelectedPreset(preset);
    setSettings(presets[preset]);
  };

  const handleSlider = (key, value) => {
    setSelectedPreset('Clean');
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const handleExport = async () => {
    if (!track) {
      setMessage('Upload an audio file before exporting.');
      return;
    }

    setIsExporting(true);
    setMessage('Rendering mastered WAV...');
    try {
      const blob = await renderMasteredWav(track.buffer, settings);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${track.name.replace(/\.[^/.]+$/, '') || 'belladaisy-master'}-mastered.wav`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setMessage('Mastered WAV export is complete.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'WAV export failed.');
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    settingsRef.current = settings;
    const context = audioContextRef.current;
    const graph = graphRef.current;
    if (context && graph) {
      updateMasteringGraph(graph, settings, context);
    }
  }, [settings]);

  useEffect(() => () => {
    stopPlayback();
    audioContextRef.current?.close();
  }, []);

  return h(
    'main',
    { className: 'app-shell' },
    h(
      'section',
      { className: 'hero panel' },
      h(
        'div',
        null,
        h('p', { className: 'eyebrow' }, 'Bella Daisy Mastering Lab'),
        h('h1', null, 'Browser-based music mastering MVP'),
        h(
          'p',
          { className: 'hero-copy' },
          'Upload an MP3 or WAV, preview mastering changes in real time, choose a starting preset, fine-tune tone and dynamics, then export the result as a WAV file.',
        ),
      ),
      h(
        'label',
        { className: 'upload-card' },
        h('span', null, 'Drop in an audio file'),
        h('strong', null, 'MP3 / WAV upload'),
        h('input', { type: 'file', accept: acceptTypes, onChange: handleFileChange }),
      ),
    ),
    h(
      'section',
      { className: 'transport panel' },
      h(
        'div',
        null,
        h('p', { className: 'eyebrow' }, 'Current track'),
        h('h2', null, track ? track.name : 'No file loaded'),
        h('p', null, track ? `Duration ${formatTime(track.duration)}` : message),
      ),
      h(
        'div',
        { className: 'transport-actions' },
        h('button', { className: 'primary', onClick: handlePlayPause, disabled: !track }, isPlaying ? 'Pause' : 'Play'),
        h('button', { onClick: handleExport, disabled: !track || isExporting }, isExporting ? 'Exporting...' : 'Export WAV'),
      ),
    ),
    h(
      'section',
      { className: 'panel' },
      h('div', { className: 'section-heading' }, h('div', null, h('p', { className: 'eyebrow' }, 'Mastering presets'), h('h2', null, 'Start with a vibe'))),
      h(
        'div',
        { className: 'preset-grid' },
        presetOrder.map((preset) =>
          h(
            'button',
            {
              key: preset,
              className: selectedPreset === preset ? 'preset active' : 'preset',
              onClick: () => handlePreset(preset),
            },
            preset,
          ),
        ),
      ),
    ),
    h(
      'section',
      { className: 'panel controls-panel' },
      h('div', { className: 'section-heading' }, h('div', null, h('p', { className: 'eyebrow' }, 'Manual controls'), h('h2', null, 'Tone, compressor, limiter, gain'))),
      h(
        'div',
        { className: 'slider-grid' },
        sliders.map((slider) =>
          h(
            'label',
            { className: 'slider-card', key: slider.key },
            h(
              'span',
              null,
              slider.label,
              h('strong', null, `${settings[slider.key]}${slider.unit}`),
            ),
            h('input', {
              type: 'range',
              min: slider.min,
              max: slider.max,
              step: slider.step,
              value: settings[slider.key],
              onChange: (event) => handleSlider(slider.key, Number(event.target.value)),
            }),
          ),
        ),
      ),
    ),
    h(
      'section',
      { className: 'panel roadmap' },
      h('p', { className: 'eyebrow' }, 'Future structure'),
      h('h2', null, 'Stem separation is planned, not forced into MVP'),
      h('p', null, stemSeparationRoadmap.note),
      h('div', { className: 'stem-list' }, stemSeparationRoadmap.stems.map((stem) => h('span', { key: stem }, stem))),
    ),
  );
}

export default App;
