import { access, readFile } from 'node:fs/promises';

const requiredFiles = [
  'index.html',
  'src/main.js',
  'src/App.js',
  'src/styles.css',
  'src/audio/masteringEngine.js',
  'src/audio/presets.js',
  'src/features/mastering/stemSeparation.js',
];

await Promise.all(requiredFiles.map((file) => access(file)));
const index = await readFile('index.html', 'utf8');
if (!index.includes('react') || !index.includes('/src/main.js')) {
  throw new Error('index.html must load React and src/main.js');
}
console.log('Static Bella Daisy app files verified.');
