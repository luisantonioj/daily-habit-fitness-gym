import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [390, 900, 1280]) {
  test(`gallery and original viewer work at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const gallery = page.getByRole("region", { name: "Gym photo gallery" });
    const photos = gallery.getByRole("button", { name: /View photo/ });
    const count = width <= 900 ? 4 : 8;
    await gallery.scrollIntoViewIfNeeded();
    await expect(photos).toHaveCount(count);
    await expect(gallery.locator("img").first()).toHaveJSProperty("complete", true);
    const boxes = await photos.evaluateAll((elements) => elements.map((element) => {
      const { x, y, width, height } = element.getBoundingClientRect();
      return { x, y, width, height };
    }));
    expect(new Set(boxes.map((box) => box.y)).size).toBe(2);
    expect(new Set(boxes.map((box) => box.x)).size).toBe(count / 2);
    for (const box of boxes) {
      expect(box.width).toBeCloseTo(boxes[0].width, 0);
      expect(box.height).toBeCloseTo(boxes[0].height, 0);
      expect(box.width / box.height).toBeCloseTo(4 / 3, 1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await gallery.screenshot({ path: `test-results/gallery-${width}-dark.png` });
    await photos.first().click();
    const dialog = page.getByRole("dialog", { name: "Gym photo viewer" });
    await expect(dialog).toBeVisible();
    const image = dialog.locator("img");
    await expect(image).toBeVisible();
    const metrics = await image.evaluate((element: HTMLImageElement) => {
      const rect = element.getBoundingClientRect();
      return { width: rect.width, height: rect.height, naturalWidth: element.naturalWidth, naturalHeight: element.naturalHeight, fit: getComputedStyle(element).objectFit };
    });
    expect(metrics.fit).toBe("contain");
    expect(metrics.width / metrics.height).toBeCloseTo(metrics.naturalWidth / metrics.naturalHeight, 2);
    expect(metrics.width).toBeLessThanOrEqual(metrics.naturalWidth);
    expect(metrics.height).toBeLessThanOrEqual(metrics.naturalHeight);
    expect(metrics.width).toBeLessThan(width);
    expect(metrics.height).toBeLessThan(900);
    await expect(dialog.getByRole("link", { name: /Open original/ })).toHaveAttribute("href", await image.getAttribute("src") as string);
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    await page.keyboard.press("ArrowLeft");
    await expect(dialog).toContainText("Photo 38 of 38");
    await page.keyboard.press("ArrowRight");
    await expect(dialog).toContainText("Photo 1 of 38");
    await dialog.getByRole("button", { name: "Next photo", exact: true }).click();
    await expect(dialog).toContainText("Photo 2 of 38");
    await expect(image).toBeVisible();
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Tab");
      expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
    }
    expect((await new AxeBuilder({ page }).include(".community-photo-viewer").analyze()).violations).toEqual([]);
    await page.screenshot({ path: `test-results/viewer-${width}.png` });
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(photos.first()).toBeFocused();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    await expect(gallery.getByRole("status")).toContainText("Page 1");
    await gallery.getByRole("button", { name: "Previous gallery page" }).click();
    await expect(photos).toHaveCount(width <= 900 ? 2 : 6);
    await gallery.getByRole("button", { name: "Next gallery page" }).click();
    await expect(photos.first()).toHaveAccessibleName(/^View photo 1:/);
    await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
    expect((await new AxeBuilder({ page }).include(".stitch-gallery").analyze()).violations).toEqual([]);
    await gallery.screenshot({ path: `test-results/gallery-${width}-light.png` });
    await photos.first().click();
    await expect(dialog).toBeVisible();
    await page.mouse.click(2, 2);
    await expect(dialog).not.toBeVisible();
    await expect(photos.first()).toBeFocused();
  });
}

test("viewer recovers from an image failure without changing the gallery page", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const gallery = page.getByRole("region", { name: "Gym photo gallery" });
  await gallery.getByRole("button", { name: "Next gallery page" }).click();
  await page.route("**/community/*.jpg", (route) => route.abort());
  await gallery.getByRole("button", { name: /View photo/ }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("status")).toContainText("This photo could not load");
  await page.unroute("**/community/*.jpg");
  await dialog.getByRole("button", { name: "Next photo", exact: true }).click();
  await expect(dialog.locator("img")).toBeVisible();
  await dialog.getByRole("button", { name: "Close photo viewer" }).click();
  await expect(gallery.getByRole("status")).toContainText("Page 2");
});
