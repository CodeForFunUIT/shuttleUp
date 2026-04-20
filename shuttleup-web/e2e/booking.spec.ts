import { test, expect } from '@playwright/test';

test('has title and can navigate to search', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/ShuttleUp/);

  // Find the "Find a Session" button or link
  const findSessionLink = page.getByRole('link', { name: 'Find a Session' });
  if (await findSessionLink.isVisible()) {
      await findSessionLink.click();
      await expect(page).toHaveURL(/.*sessions/);
  }
});
