/**
 * Generate PWA icons from SVG source
 * Run: node scripts/generate-icons.mjs
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'public');

// Simple SVG icon - a blue circle with "F" letter
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <circle cx="256" cy="256" r="256" fill="#2563eb"/>
  <text x="256" y="320" font-size="280" font-weight="bold" text-anchor="middle" fill="white" font-family="system-ui">F</text>
</svg>`;

// Write SVG files
writeFileSync(join(publicDir, 'favicon.svg'), svgIcon);
writeFileSync(join(publicDir, 'icon.svg'), svgIcon);

// For PNG generation, we'd need sharp or canvas
// For now, create a note that icons need to be generated
const readme = `# PWA Icons

This directory needs PNG icons for PWA installation.

## Generate icons from SVG

Use the @vite-pwa/assets-generator or manually convert icon.svg to PNG at these sizes:
- 192x192 (pwa-192x192.png)
- 512x512 (pwa-512x512.png)

## Simple approach

1. Open icon.svg in browser
2. Take screenshot or convert to PNG
3. Resize to 192x192 and 512x512
4. Save as pwa-192x192.png and pwa-512x512.png

Or use online tools like:
- https://cloudconvert.com/svg-to-png
- https://realfavicongenerator.net/
`;

writeFileSync(join(publicDir, 'ICONS_README.md'), readme);

console.log('Icon SVG created. See ICONS_README.md for PNG generation instructions.');
