import { test, expect } from '@playwright/test';

test.describe('The Grind Hero 1:1 Visual Regression Suite', () => {

  test('Hero section clone harus presisi 1:1 dengan baseline The Grind', async ({ page }) => {
    // 1. Buka clone di rute standalone ?view=thegrind
    await page.goto('/?view=thegrind');
    await page.waitForLoadState('networkidle');

    // 2. Stabilkan webfonts
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    // 3. Tunggu hingga rendering stabil
    await page.waitForTimeout(1000);

    // 4. Pause video pada frame ke-0
    await page.evaluate(() => {
      document.querySelectorAll('video').forEach(v => {
        v.pause();
        v.currentTime = 0;
      });
    });

    // 5. Bekukan animasi CSS
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-play-state: paused !important;
          transition: none !important;
        }
      `
    });

    // 6. Assert visual snapshot viewport 1280x800
    await expect(page).toHaveScreenshot('thegrind-hero.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.05, // toleransi awal 5% untuk iterasi pertama
      threshold: 0.2,
      animations: 'disabled'
    });
  });

});
