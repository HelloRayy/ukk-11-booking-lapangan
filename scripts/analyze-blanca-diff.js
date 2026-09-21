import fs from 'fs';
import { PNG } from 'pngjs';

const targetPath = 'tests/snapshots/blanca-desktop-target.png';
const localPath = 'tests/snapshots/blanca-desktop-local.png';
const diffPath = 'tests/snapshots/blanca-desktop-diff.png';

if (!fs.existsSync(targetPath) || !fs.existsSync(localPath)) {
  console.error('Target or local snapshot not found!');
  process.exit(1);
}

const targetImg = PNG.sync.read(fs.readFileSync(targetPath));
const localImg = PNG.sync.read(fs.readFileSync(localPath));

const width = Math.min(targetImg.width, localImg.width);
const height = Math.min(targetImg.height, localImg.height);

const diffImg = new PNG({ width, height });

let diffPixels = 0;
const totalPixels = width * height;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (width * y + x) << 2;

    const tr = targetImg.data[idx];
    const tg = targetImg.data[idx + 1];
    const tb = targetImg.data[idx + 2];
    const ta = targetImg.data[idx + 3];

    const lr = localImg.data[idx];
    const lg = localImg.data[idx + 1];
    const lb = localImg.data[idx + 2];
    const la = localImg.data[idx + 3];

    // Color distance
    const dist = Math.abs(tr - lr) + Math.abs(tg - lg) + Math.abs(tb - lb) + Math.abs(ta - la);

    if (dist > 30) {
      diffPixels++;
      // Highlight diff in bright magenta/red
      diffImg.data[idx] = 255;
      diffImg.data[idx + 1] = 0;
      diffImg.data[idx + 2] = 120;
      diffImg.data[idx + 3] = 255;
    } else {
      // Fade matching pixels to dim gray
      diffImg.data[idx] = Math.round(tr * 0.2);
      diffImg.data[idx + 1] = Math.round(tg * 0.2);
      diffImg.data[idx + 2] = Math.round(tb * 0.2);
      diffImg.data[idx + 3] = 255;
    }
  }
}

fs.writeFileSync(diffPath, PNG.sync.write(diffImg));

const diffRatio = (diffPixels / totalPixels) * 100;
console.log(`Diff analysis complete:`);
console.log(`Total pixels: ${totalPixels}`);
console.log(`Different pixels: ${diffPixels}`);
console.log(`Diff ratio: ${diffRatio.toFixed(2)}%`);
console.log(`Diff image saved to: ${diffPath}`);
