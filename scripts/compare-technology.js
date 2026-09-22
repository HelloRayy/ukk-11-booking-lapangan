// PERAN SCRIPT: Membandingkan screenshot section Our Technology lokal dengan target baseline
import { chromium } from '@playwright/test';
import fs from 'fs';
import { PNG } from 'pngjs';
import { spawn } from 'child_process';

const TARGET_SNAPSHOT = 'tests/snapshots/technology-section-target.png';
const LOCAL_SNAPSHOT = 'tests/snapshots/technology-section-local.png';
const DIFF_SNAPSHOT = 'tests/snapshots/technology-section-diff.png';

async function main() {
  console.log('1. Memeriksa server Vite lokal...');
  let vite = null;
  const isServerRunning = await fetch('http://localhost:5173/blanca.html')
    .then((res) => res.ok)
    .catch(() => false);

  if (!isServerRunning) {
    console.log('Menjalankan server Vite...');
    vite = spawn('npx', ['vite', '--port', '5173'], { stdio: 'pipe' });
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  console.log('2. Membuka Playwright browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    await page.goto('http://localhost:5173/blanca.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.querySelectorAll('.fixed, [class*="fixed"]').forEach((el) => {
        el.style.display = 'none';
      });
      document.querySelectorAll('video').forEach((v) => {
        v.pause();
        v.currentTime = 0;
      });
    });

    const section = page.locator('#shopify-section-template--17894129991737__common_slider_x8NN4j');
    await section.scrollIntoViewIfNeeded();
    await new Promise((r) => setTimeout(r, 1000));

    await section.screenshot({ path: LOCAL_SNAPSHOT });
    console.log('3. Berhasil mengambil screenshot lokal:', LOCAL_SNAPSHOT);

    if (fs.existsSync(TARGET_SNAPSHOT) && fs.existsSync(LOCAL_SNAPSHOT)) {
      const targetImg = PNG.sync.read(fs.readFileSync(TARGET_SNAPSHOT));
      const localImg = PNG.sync.read(fs.readFileSync(LOCAL_SNAPSHOT));

      const width = Math.min(targetImg.width, localImg.width);
      const height = Math.min(targetImg.height, localImg.height);
      const diffImg = new PNG({ width, height });

      let diffPixels = 0;
      const totalPixels = width * height;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (width * y + x) << 2;
          const tr = targetImg.data[idx], tg = targetImg.data[idx + 1], tb = targetImg.data[idx + 2];
          const lr = localImg.data[idx], lg = localImg.data[idx + 1], lb = localImg.data[idx + 2];

          const dist = Math.abs(tr - lr) + Math.abs(tg - lg) + Math.abs(tb - lb);
          if (dist > 45) {
            diffPixels++;
            diffImg.data[idx] = 255;
            diffImg.data[idx + 1] = 0;
            diffImg.data[idx + 2] = 120;
            diffImg.data[idx + 3] = 255;
          } else {
            diffImg.data[idx] = Math.round(tr * 0.3);
            diffImg.data[idx + 1] = Math.round(tg * 0.3);
            diffImg.data[idx + 2] = Math.round(tb * 0.3);
            diffImg.data[idx + 3] = 255;
          }
        }
      }

      fs.writeFileSync(DIFF_SNAPSHOT, PNG.sync.write(diffImg));
      const diffRatio = (diffPixels / totalPixels) * 100;
      console.log('=== HASIL ANALISIS VISUAL DIFF ===');
      console.log(`Dimensi Komparasi: ${width}x${height} px`);
      console.log(`Target Dimensions: ${targetImg.width}x${targetImg.height} px`);
      console.log(`Local Dimensions:  ${localImg.width}x${localImg.height} px`);
      console.log(`Pixel Berbeda: ${diffPixels} / ${totalPixels}`);
      console.log(`Diff Ratio: ${diffRatio.toFixed(2)}%`);
      console.log(`Diff Snapshot: ${DIFF_SNAPSHOT}`);
    }
  } finally {
    await browser.close();
    if (vite) vite.kill();
  }
}

main().catch(console.error);
