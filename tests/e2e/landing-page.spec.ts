import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("landing page exposes the key visitor flow", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Daily Habit Fitness Gym/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByAltText("Daily Habit Fitness Gym")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Build a routine that sticks/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Register your interest/i }).first()).toHaveAttribute("href", "#register");
  await expect(page.getByRole("heading", { name: /Tell us what you want to build/i })).toBeVisible();
  await expect(page.getByLabel(/email/i)).toBeVisible();
});

test("theme toggle persists and mobile navigation opens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const themeToggle = page.getByRole("button", { name: /switch to light mode/i });
  await themeToggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("button", { name: /switch to dark mode/i })).toHaveAttribute("aria-pressed", "true");

  const menuToggle = page.getByRole("button", { name: /open navigation/i });
  await menuToggle.click();
  await expect(page.getByRole("navigation", { name: /primary navigation/i })).toBeVisible();
  await expect(page.getByRole("navigation", { name: /primary navigation/i }).getByRole("link", { name: "Benefits" })).toBeVisible();

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("body")).toHaveCSS("overflow-x", "visible");
});

test("landing page has no detected axe violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
