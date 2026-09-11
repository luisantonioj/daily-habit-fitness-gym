import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("landing page exposes the key visitor flow", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Daily Habit Fitness Gym/);
  await expect(page.getByRole("heading", { name: /Build a routine that sticks/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Register your interest/i }).first()).toHaveAttribute("href", "#register");
  await expect(page.getByRole("heading", { name: /Tell us what you want to build/i })).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
});

test("landing page has no detected axe violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
