import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test('should navigate to login page and show form validation', async ({ page }) => {
        await page.goto('/login');

        // Check if the login form is rendered
        await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

        // Ensure clicking submit without details shows validation errors
        await page.getByRole('button', { name: 'Login' }).click();

        // We should see Zod validation errors (e.g., Invalid email)
        await expect(page.getByText('Invalid email address')).toBeVisible();
        await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
    });

    test('should navigate to signup from login page', async ({ page }) => {
        await page.goto('/login');

        await page.getByRole('link', { name: 'Sign up' }).click();

        await expect(page).toHaveURL(/.*signup/);
        await expect(page.getByRole('heading', { name: 'Sign Up' })).toBeVisible();
    });
});
