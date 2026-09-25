import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';

test('Accessibility QA Audit', async ({ page }) => {
  await page.goto('/');
  
  // Wait for dynamic islands to render
  await page.waitForTimeout(1000);
  
  const indexScan = await new AxeBuilder({ page }).analyze();
  fs.mkdirSync('qa-reports', { recursive: true });
  fs.writeFileSync('qa-reports/a11y-index-violations.json', JSON.stringify(indexScan.violations, null, 2));
  
  await page.goto('/hardening');
  const hardeningScan = await new AxeBuilder({ page }).analyze();
  fs.writeFileSync('qa-reports/a11y-hardening-violations.json', JSON.stringify(hardeningScan.violations, null, 2));
  
  // Create a summary report
  const summary = `
Accessibility Audit Summary:
Index Page Violations: ${indexScan.violations.length}
Hardening Page Violations: ${hardeningScan.violations.length}

(Full details saved in a11y-*-violations.json)
  `;
  fs.writeFileSync('qa-reports/a11y-summary.txt', summary.trim());
});
