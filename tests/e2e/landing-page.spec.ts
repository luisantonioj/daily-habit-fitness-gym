import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("landing page exposes the key visitor flow", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Daily Habit Fitness Gym/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("img", { name: "Daily Habit Fitness Gym", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Build the Habit That Changes Everything/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Claim Your Free Introductory Session/i }).first()).toHaveAttribute("href", "#register");
  await expect(page.getByRole("heading", { name: /Claim Your Free Introductory Session/i })).toBeVisible();
  await expect(page.getByLabel("Email Address")).toBeVisible();
  await expect(page.getByText("500+ Strong")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Starter Habit" })).toBeVisible();
  await expect(page.locator('img[src*="lh3.googleusercontent.com"]').first()).toBeVisible();
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

test("sample sections, FAQ, registration, and responsive widths remain usable", async ({ page }) => {
  await page.goto("/");

  const firstFaq = page.locator("#faq details").first();
  await firstFaq.locator("summary").click();
  await expect(firstFaq.locator("p")).toBeVisible();

  await page.route("**/api/leads", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, leadId: "e2e-lead" }) });
  });
  await page.locator("#register").scrollIntoViewIfNeeded();
  await page.getByLabel("Full Name").fill("Alex Henderson");
  await page.getByLabel("Email Address").fill("alex@example.com");
  await page.getByLabel("Primary Fitness Goal").selectOption({ label: "Get stronger" });
  await page.getByLabel(/privacy policy/i).check();
  await page.getByRole("button", { name: /book my intro session/i }).click();
  await expect(page.getByText("Introductory Session Request Received!")).toBeVisible();

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(hasOverflow).toBe(false);
  }
});

test("landing page has no detected axe violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
