import { test, expect } from '@playwright/test';

test.describe('Blanca Padel Hero Section 1:1 Reproduction', () => {
  test('Hero section matches design, layout, and visual appearance', async ({ page }) => {
    // 1. Buka halaman preview terisolasi
    await page.goto('/blanca.html', { waitUntil: 'networkidle' });

    // 2. Tunggu seluruh font web Aeonik Pro selesai dimuat
    await page.evaluate(async () => {
      await document.fonts.ready;
      // Lompat ke status akhir timeline GSAP agar posisi final deterministik
      const tl = (window as any).__BLANCA_TL__;
      if (tl) {
        tl.progress(1).pause();
      } else {
        await new Promise((r) => setTimeout(r, 3500));
      }

      // Freeze video di frame ke-0
      document.querySelectorAll('video').forEach((v) => {
        v.pause();
        v.currentTime = 0;
      });
    });

    // 3. Verifikasi elemen struktural inti ada dan terlihat
    const headerLogo = page.locator('.header__logo');
    await expect(headerLogo).toBeVisible();

    const title = page.locator('.h1');
    await expect(title).toBeVisible();
    await expect(title).toContainText('Minimal.');
    await expect(title).toContainText('Powerful.');
    await expect(title).toContainText('Intentional.');

    const outroDesc = page.locator('p.body');
    await expect(outroDesc).toBeVisible();
    await expect(outroDesc).toContainText('At Blanca, we’re not about flash.');

    const ctaButton = page.locator('.icon-button');
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toContainText('Shop our racquets');

    const video = page.locator('video');
    await expect(video).toBeAttached();

    // 4. Lakukan visual snapshot comparison dengan mask pada elemen video looping
    await expect(page).toHaveScreenshot({
      mask: [page.locator('video')],
      maxDiffPixelRatio: 0.05,
    });
  });
});
