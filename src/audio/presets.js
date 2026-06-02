export const presetOrder = ['Clean', 'Warm', 'Loud', 'Bright', 'Soft'];

export const presets = {
  Clean: {
    inputGain: 0,
    bass: 0,
    mid: 0,
    treble: 0,
    compressor: 25,
    limiter: -1,
    outputGain: 0,
  },
  Warm: {
    inputGain: 1,
    bass: 4,
    mid: 1.5,
    treble: -1.5,
    compressor: 35,
    limiter: -1.2,
    outputGain: 0.5,
  },
  Loud: {
    inputGain: 3,
    bass: 2,
    mid: 1,
    treble: 2,
    compressor: 70,
    limiter: -0.4,
    outputGain: 2,
  },
  Bright: {
    inputGain: 1,
    bass: -1,
    mid: 0.5,
    treble: 5,
    compressor: 35,
    limiter: -0.8,
    outputGain: 0.5,
  },
  Soft: {
    inputGain: -1,
    bass: 1.5,
    mid: -1,
    treble: -2,
    compressor: 15,
    limiter: -2,
    outputGain: -1,
  },
};

export const sliders = [
  { key: 'inputGain', label: 'Input Gain', min: -12, max: 12, step: 0.5, unit: 'dB' },
  { key: 'bass', label: 'Bass', min: -12, max: 12, step: 0.5, unit: 'dB' },
  { key: 'mid', label: 'Mid', min: -12, max: 12, step: 0.5, unit: 'dB' },
  { key: 'treble', label: 'Treble', min: -12, max: 12, step: 0.5, unit: 'dB' },
  { key: 'compressor', label: 'Compressor Amount', min: 0, max: 100, step: 1, unit: '%' },
  { key: 'limiter', label: 'Limiter Ceiling', min: -12, max: 0, step: 0.1, unit: 'dB' },
  { key: 'outputGain', label: 'Output Gain', min: -12, max: 12, step: 0.5, unit: 'dB' },
];
