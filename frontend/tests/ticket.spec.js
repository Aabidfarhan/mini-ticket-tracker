import { test, expect } from '@playwright/test';

test('create ticket flow and verify details', async ({ page }) => {
  // 1. Navigate to main UI
  await page.goto('http://localhost:3000');
  await page.screenshot({ path: '../screenshots/1_homepage.png' });
  
  // 2. Click to create
  await page.locator('text=New Ticket').click();
  await page.waitForTimeout(500); // let UI settle
  await page.screenshot({ path: '../screenshots/2_create_form.png' });
  
  // 3. Fill form
  const uniqueTitle = `Playwright Ticket ${Date.now()}`;
  // Use generic selectors since name attributes are missing
  const inputs = page.locator('.form-control');
  await inputs.nth(0).fill(uniqueTitle);
  await inputs.nth(1).fill('Testing E2E create -> verify list -> verify detail flow. Automation works!');
  await page.screenshot({ path: '../screenshots/3_form_filled.png' });
  
  // 4. Submit
  page.on('dialog', dialog => dialog.accept()); // accept alert("Ticket created")
  await page.locator('text=Save Ticket').click();
  
  // 5. Verify it appears in the list
  await expect(page.locator(`text=${uniqueTitle}`)).toBeVisible();
  await page.screenshot({ path: '../screenshots/4_list_view_verified.png' });
  
  // 6. Click into the detail view to verify
  await page.locator(`text=${uniqueTitle}`).click();
  await expect(page.locator(`text=${uniqueTitle}`)).toBeVisible();
  await page.screenshot({ path: '../screenshots/5_detail_view.png' });
});