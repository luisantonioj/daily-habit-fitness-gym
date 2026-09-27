import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const MOBILE_VIDEO = "/videos/daily-habit-video-mobile.mp4";
const DESKTOP_VIDEO = "/videos/daily-habit-video-web.mp4";

test("landing page opens on the full-screen video and exposes the visitor flow", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveTitle(/Daily Habit Fitness Gym/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("heading", { name: "Daily Habit Fitness Gym" })).toHaveClass("sr-only");
  await expect(page.locator(".stitch-hero-video")).toHaveAttribute("src", DESKTOP_VIDEO);
  await expect(page.locator(".stitch-hero-video")).toHaveAttribute("autoplay", "");
  await expect(page.locator(".stitch-hero-video")).toHaveAttribute("loop", "");
  await expect(page.locator(".stitch-hero-video")).toHaveAttribute("playsinline", "");
  await expect(page.locator(".stitch-hero-video")).toHaveJSProperty("muted", true);
  await expect(page.locator(".stitch-hero-video")).not.toHaveAttribute("controls");
  await expect(page.locator(".stitch-header")).not.toHaveClass(/is-visible/);
  await expect(page.getByRole("heading", { name: /Claim Your Free Introductory Session/i })).toBeVisible();
  await expect(page.getByLabel("Email Address")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Starter Habit" })).toBeVisible();
  await expect(page.locator('img[src*="lh3.googleusercontent.com"]').first()).toBeVisible();
});

test("navbar stays hidden through 24 pixels, reveals at 25, and hides at the top", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const header = page.locator(".stitch-header");

  await expect(header).toHaveAttribute("aria-hidden", "true");
  await expect(header).toHaveAttribute("inert", "");
  await page.evaluate(() => window.scrollTo(0, 24));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(24);
  await expect(header).not.toHaveClass(/is-visible/);

  await page.evaluate(() => window.scrollTo(0, 25));
  await expect(header).toHaveClass(/is-visible/);
  await expect(header).toHaveAttribute("aria-hidden", "false");
  await expect(header).not.toHaveAttribute("inert");

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(header).not.toHaveClass(/is-visible/);
  await expect(header).toHaveAttribute("inert", "");
});

test("restored deep-link scroll reveals the navbar and scrolling home closes its mobile menu", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#memberships", { waitUntil: "domcontentloaded" });
  const header = page.locator(".stitch-header");
  await expect(header).toHaveClass(/is-visible/);

  const menuToggle = page.locator(".stitch-menu-toggle");
  await menuToggle.click();
  await expect(menuToggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(".stitch-nav")).toHaveClass(/is-open/);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(header).not.toHaveClass(/is-visible/);
  await expect(page.locator(".stitch-nav")).not.toHaveClass(/is-open/);
  await expect(page.locator(".stitch-menu-toggle")).toHaveAttribute("aria-expanded", "false");
});

test("theme toggle persists and mobile navigation remains usable after reveal", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".stitch-header")).not.toHaveClass(/is-visible/);
  await page.evaluate(() => window.scrollTo(0, 25));
  await expect(page.locator(".stitch-header")).toHaveClass(/is-visible/);

  await page.getByRole("button", { name: /switch to light mode/i }).click();
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
  await expect(page.locator(".stitch-header")).toHaveClass(/is-visible/);
  await expect(page.locator("body")).toHaveCSS("overflow-x", "visible");
});

test("light theme keeps the video hero black and lower-page colors readable", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem("daily-habit-theme", "light"));
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  const themeSnapshot = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const read = (name: string) => root.getPropertyValue(name).trim().toLowerCase();
    const contrastSamples = [
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
      hero: {
        background: getComputedStyle(document.querySelector(".stitch-hero")!).backgroundColor,
        objectFit: getComputedStyle(document.querySelector(".stitch-hero-video")!).objectFit,
      },
      sectionColors: [".stitch-benefit-card", ".stitch-membership-card", ".stitch-registration", ".stitch-footer"].map((selector) => {
        const element = document.querySelector(selector);
        const styles = element ? getComputedStyle(element) : null;
        return { selector, background: styles?.backgroundColor, color: styles?.color };
      }),
      contrasts,
    };
  });

  expect(themeSnapshot.tokens).toMatchObject({
    page: "#f3f0e9",
    surface: "#fff",
    secondary: "#526066",
    accent: "#f3e700",
    accentText: "#5d6200",
    onAccent: "#353200",
  });
  expect(themeSnapshot.hero).toEqual({ background: "rgb(0, 0, 0)", objectFit: "cover" });
  expect(themeSnapshot.sectionColors.every(({ background, color }) => Boolean(background) && Boolean(color))).toBe(true);
  expect(themeSnapshot.contrasts.every(({ ratio }) => ratio !== null && ratio >= 4.5)).toBe(true);
});

test("video fills mobile, tablet, and desktop viewports with only the selected asset requested", async ({ page }) => {
  const videoRequests: string[] = [];
  page.on("request", (request) => {
    const path = new URL(request.url()).pathname;
    if (path.endsWith(".mp4")) videoRequests.push(path);
  });

  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  for (const [width, height] of [
    [320, 740], [390, 844], [430, 932], [639, 844],
    [640, 900], [768, 1024], [834, 1112], [1024, 768],
    [1280, 800], [1536, 960], [1920, 1080], [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    const expectedVideo = width < 640 ? MOBILE_VIDEO : DESKTOP_VIDEO;
    await expect(page.locator(".stitch-hero-video")).toHaveAttribute("src", expectedVideo);

    const layout = await page.evaluate(() => {
      const hero = document.querySelector(".stitch-hero")!;
      const video = document.querySelector(".stitch-hero-video")!;
      const heroRect = hero.getBoundingClientRect();
      const videoRect = video.getBoundingClientRect();
      return {
        hero: { top: heroRect.top, left: heroRect.left, width: heroRect.width, height: heroRect.height },
        video: { width: videoRect.width, height: videoRect.height, objectFit: getComputedStyle(video).objectFit },
        viewport: { width: window.innerWidth, height: window.innerHeight },
        hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });
    expect(layout.hero).toEqual({ top: 0, left: 0, width: layout.viewport.width, height: layout.viewport.height });
    expect(layout.video).toEqual({ width: layout.viewport.width, height: layout.viewport.height, objectFit: "cover" });
    expect(layout.hasOverflow).toBe(false);
  }

  expect(new Set(videoRequests)).toEqual(new Set([MOBILE_VIDEO, DESKTOP_VIDEO]));
});

test("muted video playback advances and loops", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const playback = await page.locator(".stitch-hero-video").evaluate(async (element) => {
    const video = element as HTMLVideoElement;
    try {
      await video.play();
      await new Promise<void>((resolve, reject) => {
        if (video.readyState >= HTMLMediaElement.HAVE_METADATA) resolve();
        else {
          video.addEventListener("loadedmetadata", () => resolve(), { once: true });
          video.addEventListener("error", () => reject(new Error("Video failed to load")), { once: true });
          window.setTimeout(() => reject(new Error("Video metadata timed out")), 12_000);
        }
      });
      const startTime = video.currentTime;
      await new Promise((resolve) => window.setTimeout(resolve, 500));
      const advanced = video.currentTime > startTime;
      if (!Number.isFinite(video.duration) || video.duration < 0.5) return { advanced, looped: false };

      video.currentTime = video.duration - 0.1;
      await new Promise<void>((resolve, reject) => {
        const onTimeUpdate = () => {
          if (video.currentTime < 0.5) {
            video.removeEventListener("timeupdate", onTimeUpdate);
            resolve();
          }
        };
        video.addEventListener("timeupdate", onTimeUpdate);
        window.setTimeout(() => {
          video.removeEventListener("timeupdate", onTimeUpdate);
          reject(new Error("Video did not loop"));
        }, 8_000);
      });
      return { advanced, looped: true };
    } catch {
      return { advanced: false, looped: false };
    }
  });
  expect(playback.advanced).toBe(true);
  expect(playback.looped).toBe(true);
});

test("sample sections, FAQ, registration, and responsive navbar controls remain usable", async ({ page }) => {
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

  for (const width of [320, 360, 390, 430, 639, 640, 768, 820, 834, 1024, 1180, 1280, 1366, 1440, 1536, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => window.scrollTo(0, 25));
    await expect(page.locator(".stitch-header")).toHaveClass(/is-visible/);
    await page.waitForTimeout(200);
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
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
