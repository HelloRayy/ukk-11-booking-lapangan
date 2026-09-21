import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function captureTheGrind() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();
  console.log('[Capture] Membuka https://www.thegrind.nl/ ...');

  await page.goto('https://www.thegrind.nl/', { waitUntil: 'networkidle', timeout: 45000 });

  // 1. Tunggu webfonts siap
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  // 2. Sembunyikan cookie popup / modal yang menghalangi hero
  await page.addStyleTag({
    content: `
      .fs-cc_cookie-component,
      .fs-cc_preference-component,
      .whatsapp-modal,
      [fs-cc="banner"] {
        display: none !important;
      }
    `
  });

  // 3. Tunggu hingga animasi reveal selesai (~3 detik)
  console.log('[Capture] Menunggu animasi reveal selesai...');
  await page.waitForTimeout(3500);

  // 4. Bekukan animasi berulang
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-play-state: paused !important;
        transition: none !important;
      }
    `
  });

  // 5. Pause video pada detik ke-0
  await page.evaluate(() => {
    document.querySelectorAll('video').forEach(v => {
      v.pause();
      v.currentTime = 0;
    });
  });

  // 6. Siapkan folder snapshots
  const snapshotDir = path.resolve('tests/visual.spec.js-snapshots');
  fs.mkdirSync(snapshotDir, { recursive: true });

  const targetPath = path.resolve('target.png');
  const testSnapshotPath = path.join(snapshotDir, 'thegrind-hero-linux.png');

  console.log('[Capture] Menyimpan screenshot baseline (viewport 1280x800)...');
  await page.screenshot({
    path: targetPath,
    fullPage: false,
    animations: 'disabled'
  });

  await page.screenshot({
    path: testSnapshotPath,
    fullPage: false,
    animations: 'disabled'
  });

  // Simpan HTML rendered target
  const renderedHtml = await page.content();
  fs.writeFileSync('target-rendered.html', renderedHtml);

  console.log(`[Capture] Sukses! Snapshot tersimpan di:\n- ${targetPath}\n- ${testSnapshotPath}`);
  await browser.close();
}

captureTheGrind().catch(err => {
  console.error('[Capture Error]:', err);
  process.exit(1);
});
