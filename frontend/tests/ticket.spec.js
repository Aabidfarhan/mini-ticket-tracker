import { test, expect } from '@playwright/test';

test('create ticket flow and verify details', async ({ page }) => {
  // 1. Navigate to main UI
  await page.goto('http://localhost:3000');
  
  // 2. Click to create
  await page.click('text=New Ticket'); // or Create Ticket depending on UI
  
  // 3. Fill form
  const uniqueTitle = `Playwright Ticket ${Date.now()}`;
  await page.fill('input[name="title"]', uniqueTitle);
  await page.fill('textarea[name="description"]', 'Testing E2E create -> verify list -> verify detail flow.');
  
  // 4. Submit
  await page.click('text=Save Ticket'); // or Submit
  
  // 5. Verify it appears in the list
  await expect(page.locator(`text=${uniqueTitle}`)).toBeVisible();
  
  // 6. Click into the detail view to verify (Stage C Requirement)
  await page.click(`text=${uniqueTitle}`);
  await expect(page.locator(`text=${uniqueTitle}`)).toBeVisible();
  await expect(page.locator('text=Testing E2E create -> verify list -> verify detail flow.')).toBeVisible();
});