import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const TARGET_URL = 'https://blancapadel.com/';
const SNAPSHOTS_DIR = path.resolve('tests/snapshots');

if (!fs.existsSync(SNAPSHOTS_DIR)) {
  fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
}

async function capture() {
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop Capture (1440x900)
  console.log('Capturing Desktop 1440x900 baseline from', TARGET_URL);
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const desktopPage = await desktopContext.newPage();

  await desktopPage.goto(TARGET_URL, { waitUntil: 'networkidle' });
  await desktopPage.evaluate(async () => {
    await document.fonts.ready;
    // Wait for GSAP timeline to finish
    await new Promise((resolve) => setTimeout(resolve, 3500));
    // Freeze video at frame 0
    document.querySelectorAll('video').forEach((v) => {
      v.pause();
      v.currentTime = 0;
    });
  });

  // Take screenshot of the viewport (which covers header + hero)
  await desktopPage.screenshot({
    path: path.join(SNAPSHOTS_DIR, 'blanca-desktop-target.png'),
  });
  console.log('Saved blanca-desktop-target.png');

  // Also capture just the hero section & header
  const heroElement = await desktopPage.$('section[id*="homepage_hero"]');
  if (heroElement) {
    await heroElement.screenshot({
      path: path.join(SNAPSHOTS_DIR, 'blanca-desktop-hero-target.png'),
    });
    console.log('Saved blanca-desktop-hero-target.png');
  }

  // Save the full rendered outer HTML of the header and hero section for reference
  const headerHtml = await desktopPage.$eval('header', el => el.outerHTML).catch(() => '');
  const heroHtml = await desktopPage.$eval('section[id*="homepage_hero"]', el => el.outerHTML).catch(() => '');
  fs.writeFileSync(path.join(SNAPSHOTS_DIR, 'blanca-target-markup.html'), headerHtml + '\n\n' + heroHtml);
  console.log('Saved blanca-target-markup.html');

  // 2. Mobile Capture (390x844)
  console.log('Capturing Mobile 390x844 baseline from', TARGET_URL);
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(TARGET_URL, { waitUntil: 'networkidle' });
  await mobilePage.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((resolve) => setTimeout(resolve, 3500));
    document.querySelectorAll('video').forEach((v) => {
      v.pause();
      v.currentTime = 0;
    });
  });

  await mobilePage.screenshot({
    path: path.join(SNAPSHOTS_DIR, 'blanca-mobile-target.png'),
  });
  console.log('Saved blanca-mobile-target.png');

  await browser.close();
  console.log('Baseline capture complete.');
}

capture().catch((err) => {
  console.error('Error capturing baseline:', err);
  process.exit(1);
});
