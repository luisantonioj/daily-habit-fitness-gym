import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("landing page exposes the key visitor flow", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

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
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const themeToggle = page.getByRole("button", { name: /switch to light mode/i });
  await themeToggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("button", { name: /switch to dark mode/i })).toHaveAttribute("aria-pressed", "true");

  const menuToggle = page.getByRole("button", { name: /open navigation/i });
  await menuToggle.click();
  await expect(page.getByRole("navigation", { name: /primary navigation/i })).toBeVisible();
  await expect(page.getByRole("navigation", { name: /primary navigation/i }).getByRole("link", { name: "Benefits" })).toBeVisible();

  const mobileControls = await page.locator(".stitch-header-actions button, .stitch-header-actions a").evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }),
  );
  expect(mobileControls.every(({ width, height }) => width >= 44 && height >= 44)).toBe(true);

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("body")).toHaveCSS("overflow-x", "visible");
});

test("light theme uses readable brand tokens and contrast", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /switch to light mode/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  const themeSnapshot = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const read = (name: string) => root.getPropertyValue(name).trim().toLowerCase();
    const contrastSamples = [
      [".stitch-hero h1", ".stitch-hero"],
      [".stitch-hero-copy > p", ".stitch-hero"],
      [".stitch-eyebrow", ".stitch-benefits"],
      [".stitch-card-copy p", ".stitch-benefit-card"],
      [".stitch-membership-card > p", ".stitch-membership-card"],
      [".stitch-registration .field-group label", ".stitch-registration .lead-form"],
      [".stitch-footer-links a", ".stitch-footer"],
    ];

    const parseRgb = (value: string) => {
      const channels = value.match(/[\d.]+/g)?.map(Number) ?? [];
      return channels.length >= 3 ? channels.slice(0, 3).map((channel) => channel / 255) : null;
    };

    const luminance = (value: string) => {
      const rgb = parseRgb(value);
      if (!rgb) return null;
      const linear = rgb.map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));
      return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    };

    const contrasts = contrastSamples.map(([textSelector, backgroundSelector]) => {
      const textElement = document.querySelector(textSelector);
      const backgroundElement = document.querySelector(backgroundSelector);
      if (!textElement || !backgroundElement) return { textSelector, ratio: null };
      const foreground = luminance(getComputedStyle(textElement).color);
      const background = luminance(getComputedStyle(backgroundElement).backgroundColor);
      if (foreground === null || background === null) return { textSelector, ratio: null };
      const lighter = Math.max(foreground, background);
      const darker = Math.min(foreground, background);
      return { textSelector, ratio: (lighter + 0.05) / (darker + 0.05) };
    });

    return {
      tokens: {
        page: read("--stitch-bg"),
        surface: read("--stitch-surface"),
        secondary: read("--stitch-secondary"),
        accent: read("--stitch-accent"),
        accentText: read("--stitch-accent-text"),
        onAccent: read("--stitch-on-accent"),
      },
      sectionColors: [".stitch-hero", ".stitch-benefit-card", ".stitch-membership-card", ".stitch-registration", ".stitch-footer"].map((selector) => {
        const element = document.querySelector(selector);
        const styles = element ? getComputedStyle(element) : null;
        return { selector, background: styles?.backgroundColor, color: styles?.color };
      }),
      contrasts,
    };
  });

  expect(themeSnapshot.tokens).toMatchObject({
    page: "#f3f0e9",
    surface: "#ffffff",
    secondary: "#526066",
    accent: "#f3e700",
    accentText: "#5d6200",
    onAccent: "#353200",
  });
  expect(themeSnapshot.sectionColors.every(({ background, color }) => Boolean(background) && Boolean(color))).toBe(true);
  expect(themeSnapshot.contrasts.every(({ ratio }) => ratio !== null && ratio >= 4.5)).toBe(true);
});

test("sample sections, FAQ, registration, and responsive widths remain usable", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const firstFaq = page.locator("#faq details").first();
  await firstFaq.locator("summary").click();
  await expect(firstFaq.locator("p")).toBeVisible();

  await page.locator("#register").scrollIntoViewIfNeeded();
  await expect(page.getByText("Registration opens soon. This preview is not accepting inquiries yet.")).toBeVisible();
  const submit = page.getByRole("button", { name: /book my intro session/i });
  await expect(submit).toBeDisabled();
  let requestCount = 0;
  page.on("request", (request) => {
    if (request.url().endsWith("/api/leads")) requestCount += 1;
  });
  await submit.evaluate((button) => (button as HTMLButtonElement).click());
  expect(requestCount).toBe(0);

  for (const width of [320, 360, 390, 430, 768, 820, 834, 1024, 1180, 1280, 1366, 1440, 1536, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const layout = await page.evaluate(() => {
      const controls = [...document.querySelectorAll(".stitch-header-actions button, .stitch-header-actions a")];
      return {
        hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        controlsReachable: controls.every((element) => {
          const rect = element.getBoundingClientRect();
          return rect.left >= 0 && rect.right <= window.innerWidth && rect.top >= 0 && rect.bottom <= 120;
        }),
        controlRects: controls.map((element) => {
          const rect = element.getBoundingClientRect();
          return { className: element.className, left: rect.left, right: rect.right };
        }),
      };
    });
    expect(layout.hasOverflow, `horizontal overflow at ${width}px`).toBe(false);
    expect(layout.controlsReachable, `header controls leave the viewport at ${width}px: ${JSON.stringify(layout.controlRects)}`).toBe(true);
  }
});

test("landing page has no detected axe violations", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("light theme has no detected axe violations", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /switch to light mode/i }).click();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
