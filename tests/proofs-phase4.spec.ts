import { test, expect } from '@playwright/test';

test('Phase 4 Signature Features Proof', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.waitForTimeout(1000);

  // F6 Triage Desk (L5)
  await page.evaluate(() => document.getElementById('L5')?.scrollIntoView());
  await page.waitForTimeout(500);
  
  // Capture Triage Desk Initial State
  await page.screenshot({ path: `proofs/${testInfo.project.name}-F6-TriageDesk-Intro.png` });
  
  // Start the simulation
  await page.click('button:has-text("INITIALIZE STREAM")');
  await page.waitForTimeout(3000); // Wait for a few events to spawn
  
  // Capture Triage Desk Playing State
  await page.screenshot({ path: `proofs/${testInfo.project.name}-F6-TriageDesk-Playing.png` });

  // F7 Resume Verifier (L7)
  await page.evaluate(() => document.getElementById('L7')?.scrollIntoView());
  await page.waitForTimeout(500);
  await page.screenshot({ path: `proofs/${testInfo.project.name}-F7-ResumeVerifier.png` });
});
