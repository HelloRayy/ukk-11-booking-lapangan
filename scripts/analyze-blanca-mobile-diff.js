import fs from 'fs';
import { PNG } from 'pngjs';

const targetPath = 'tests/snapshots/blanca-mobile-target.png';
const localPath = 'tests/snapshots/blanca-mobile-local.png';
const diffPath = 'tests/snapshots/blanca-mobile-diff.png';

const targetImg = PNG.sync.read(fs.readFileSync(targetPath));
const localImg = PNG.sync.read(fs.readFileSync(localPath));

const width = Math.min(targetImg.width, localImg.width);
const height = Math.min(targetImg.height, localImg.height);
const diffImg = new PNG({ width, height });

let diffPixels = 0;
// We ignore the bottom 60px where Shopify discount popup appears
const testHeight = height - 60;
const totalPixels = width * testHeight;

for (let y = 0; y < testHeight; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (width * y + x) << 2;
    const dist = Math.abs(targetImg.data[idx] - localImg.data[idx]) +
                 Math.abs(targetImg.data[idx+1] - localImg.data[idx+1]) +
                 Math.abs(targetImg.data[idx+2] - localImg.data[idx+2]);
    if (dist > 30) {
      diffPixels++;
      diffImg.data[idx] = 255;
      diffImg.data[idx+1] = 0;
      diffImg.data[idx+2] = 120;
      diffImg.data[idx+3] = 255;
    } else {
      diffImg.data[idx] = Math.round(targetImg.data[idx] * 0.2);
      diffImg.data[idx+1] = Math.round(targetImg.data[idx+1] * 0.2);
      diffImg.data[idx+2] = Math.round(targetImg.data[idx+2] * 0.2);
      diffImg.data[idx+3] = 255;
    }
  }
}

fs.writeFileSync(diffPath, PNG.sync.write(diffImg));
console.log(`Mobile Diff Ratio (excluding discount popup): ${((diffPixels / totalPixels) * 100).toFixed(2)}%`);
