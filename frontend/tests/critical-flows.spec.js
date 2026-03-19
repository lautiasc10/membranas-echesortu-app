import { test, expect } from '@playwright/test';

test.describe('Critical UI Flows', () => {

    test('Homepage loads correctly and shows navigation', async ({ page }) => {
        await page.goto('/');

        // Check if header or some generic component loads
        await expect(page.locator('header')).toBeVisible();
        await expect(page.locator('text=/Contacto|Nosotros/i').first()).toBeVisible();
    });

    test('Can navigate to Login page and view form', async ({ page }) => {
        await page.goto('/login');

        // Look for typical login inputs
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

});
