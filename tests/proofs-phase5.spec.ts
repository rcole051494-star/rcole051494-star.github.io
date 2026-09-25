import { test, expect } from '@playwright/test';

test('Phase 5 Signature Features Proof', async ({ page }, testInfo) => {
  // 1. Hardening Page (F8)
  await page.goto('/hardening');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `proofs/${testInfo.project.name}-F8-HardeningPage.png`, fullPage: true });

  // 2. 404 Page (Dropped Packet)
  await page.goto('/404', { waitUntil: 'domcontentloaded' }); // Ignore 404 status
  await page.waitForTimeout(500);
  await page.screenshot({ path: `proofs/${testInfo.project.name}-404-DroppedPacket.png` });

  // 3. X-Ray Mode (F9)
  await page.goto('/');
  await page.waitForTimeout(1000);
  await page.keyboard.press('x'); // Trigger X-Ray
  await page.waitForTimeout(500); // Wait for CSS toggle
  await page.screenshot({ path: `proofs/${testInfo.project.name}-F9-XRayMode.png` });
  
  // 4. Footer Traceroute Delight
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `proofs/${testInfo.project.name}-Footer-Traceroute.png` });
});
