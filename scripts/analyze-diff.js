import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

async function analyzeDiff() {
  if (!fs.existsSync('test-results')) {
    return console.log('Tidak ada folder test-results. Jalankan test terlebih dahulu.');
  }

  const dirs = fs.readdirSync('test-results').filter(d => fs.statSync(path.join('test-results', d)).isDirectory());
  if (dirs.length === 0) return console.log('Tidak ada subfolder di test-results');

  // Cari file diff di subfolder
  let diffPath = null;
  for (const d of dirs) {
    const candidate = path.join('test-results', d, 'thegrind-hero-diff.png');
    if (fs.existsSync(candidate)) {
      diffPath = candidate;
      break;
    }
  }

  if (!diffPath) {
    console.log('Tidak ada file *-diff.png yang ditemukan. Test visual kemungkinan 100% cocok (Pass)!');
    return;
  }

  const png = PNG.sync.read(fs.readFileSync(diffPath));
  console.log(`Dimensi Layar: ${png.width} x ${png.height} px`);

  const diffY = new Set();
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const idx = (png.width * y + x) << 2;
      const r = png.data[idx], g = png.data[idx + 1], b = png.data[idx + 2];
      // Deteksi pixel diff warna merah / magenta khas Playwright
      if ((r > 200 && g < 60 && b < 60) || (r > 200 && g < 60 && b > 200)) {
        diffY.add(y);
      }
    }
  }

  const sorted = Array.from(diffY).sort((a, b) => a - b);
  console.log(`Total baris piksel berbeda: ${sorted.length}`);

  const clusters = [];
  let start = sorted[0], prev = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - prev > 15) {
      clusters.push({ startY: start, endY: prev, height: prev - start + 1 });
      start = sorted[i];
    }
    prev = sorted[i];
  }
  if (sorted.length > 0) clusters.push({ startY: start, endY: prev, height: prev - start + 1 });

  console.log('📍 Klaster Koordinat Selisih (Y-axis):');
  console.table(clusters);
}

analyzeDiff();
