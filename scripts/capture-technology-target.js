// PERAN SCRIPT: Mengambil baseline HTML, screenshot, dan metadata dari section Our Technology Blanca Padel
import { chromium } from '@playwright/test';
import fs from 'fs';

async function main() {
  console.log('1. Membuka Playwright browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('2. Mengunjungi https://blancapadel.com/ ...');
  await page.goto('https://blancapadel.com/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const sectionSelector = '#shopify-section-template--17894129991737__common_slider_x8NN4j';
  const exists = await page.locator(sectionSelector).count();
  console.log('Section exists count:', exists);

  if (exists === 0) {
    const sections = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[id*="shopify-section"]')).map(el => el.id);
    });
    console.log('Available sections:', sections);
    await browser.close();
    return;
  }

  // Extract outer HTML
  const html = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return el ? el.outerHTML : '';
  }, sectionSelector);

  fs.writeFileSync('tests/snapshots/technology-section-target.html', html);
  console.log(`Saved technology-section-target.html (${html.length} bytes)`);

  // Extract asset links (images, videos)
  const assets = await page.evaluate((sel) => {
    const sec = document.querySelector(sel);
    if (!sec) return [];
    const imgs = Array.from(sec.querySelectorAll('img')).map(i => ({ type: 'img', src: i.src, alt: i.alt }));
    const vids = Array.from(sec.querySelectorAll('video')).flatMap(v => {
      const sources = Array.from(v.querySelectorAll('source')).map(s => s.src);
      return { type: 'video', poster: v.poster, sources };
    });
    return { imgs, vids };
  }, sectionSelector);

  console.log('Assets found in section:', JSON.stringify(assets, null, 2));

  // Clean overlays before screenshot
  await page.evaluate(() => {
    document.querySelectorAll('.sticky, [data-floating], [class*="fixed"]').forEach(el => {
      if (!el.closest('#shopify-section-template--17894129991737__common_slider_x8NN4j')) {
        el.style.display = 'none';
      }
    });
    document.querySelectorAll('video').forEach(v => {
      v.pause();
      v.currentTime = 0;
    });
  });

  const section = page.locator(sectionSelector);
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  await section.screenshot({ path: 'tests/snapshots/technology-section-target.png' });
  console.log('Saved tests/snapshots/technology-section-target.png');

  await browser.close();
}

main().catch(console.error);
