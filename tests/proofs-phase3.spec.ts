import { test, expect } from '@playwright/test';

test('Phase 3 Signature Features Proof', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.waitForTimeout(1000);

  // F10 Ambient Background (visible immediately)
  await page.screenshot({ path: `proofs/${testInfo.project.name}-F10-AmbientBackground.png` });

  // F4 Skill Graph (L6)
  await page.evaluate(() => document.getElementById('L6')?.scrollIntoView());
  await page.waitForTimeout(1500); // Wait for GSAP and d3 physics
  await page.screenshot({ path: `proofs/${testInfo.project.name}-F4-SkillGraph.png` });

  // F5 Case Files (L7)
  await page.evaluate(() => document.getElementById('L7')?.scrollIntoView());
  await page.waitForTimeout(500);
  await page.screenshot({ path: `proofs/${testInfo.project.name}-F5-CaseFiles.png` });

  // F5 Full Case File View
  await page.goto('/writeups/exh-01');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `proofs/${testInfo.project.name}-F5-Writeup-EXH-01.png`, fullPage: true });
});
