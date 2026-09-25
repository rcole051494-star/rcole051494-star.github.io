import { test, expect } from '@playwright/test';

test('Phase 2 Signature Features Proof', async ({ page }, testInfo) => {
  await page.goto('/');
  
  // Wait for fonts and initial layout
  await page.waitForTimeout(1000);

  // F2: Scroll Journey + F3: Redaction (Engineer Mode default)
  await page.screenshot({ path: `proofs/${testInfo.project.name}-F2-F3-Engineer-Top.png` });
  
  // Scroll to L2 to show the packet moving down the rail
  await page.evaluate(() => document.getElementById('L2')?.scrollIntoView());
  await page.waitForTimeout(1000); // Wait for GSAP ScrollTrigger to fire
  await page.screenshot({ path: `proofs/${testInfo.project.name}-F2-Engineer-L2.png` });

  // F1: Recruiter Mode
  // Click the toggle (top right)
  await page.click('label[for="recruiter-mode-toggle"]');
  await page.waitForTimeout(1000); // Wait for mode transition
  await page.screenshot({ path: `proofs/${testInfo.project.name}-F1-RecruiterMode.png` });
});
