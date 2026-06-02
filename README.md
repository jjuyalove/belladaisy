# Bella Daisy Mastering Lab

Bella Daisy Mastering Lab is a browser-based music mastering MVP built as a static React-style app with the Web Audio API.

## MVP features

- MP3/WAV file upload in the browser
- Play and pause for real-time preview
- Mastering presets: Clean, Warm, Loud, Bright, Soft
- Manual sliders for Input Gain, Bass, Mid, Treble, Compressor Amount, Limiter Ceiling, and Output Gain
- Web Audio API processing chain for gain, EQ, compression, limiting, and output gain
- Offline WAV rendering/export using the same mastering settings
- Lightweight feature boundary for future stem separation work

## Run locally

```bash
npm run dev
```

Open http://localhost:5173 in a browser, upload an MP3 or WAV file, and use the controls to preview and export a mastered WAV.

## Build

```bash
npm run build
```

## Notes

Do not commit real audio files, API keys, passwords, tokens, or other private assets to this repository.
