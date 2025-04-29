import { test, expect } from "@playwright/test";

test("openModal should open the modal and insert iframe", async ({ page }) => {
  await page.goto("http://localhost:5500");

  const galleryItem = await page.locator(
    '.gallery__item[data-video-id="x6iyz1AQhuU"]'
  );

  const videoId = await galleryItem.getAttribute("data-video-id");
  expect(videoId).toBeTruthy();

  if (videoId) {
    await galleryItem.click();
    const iframe = await page.locator("iframe");
    expect(await iframe.count()).toBe(1);
  } else {
    const isClickable = await galleryItem.isEnabled();
    expect(isClickable).toBeFalsy();
  }
});

test("closeModal should deactivate modal and clean iframe", async ({
  page,
}) => {
  await page.goto("http://localhost:5500");

  const galleryItem = await page.locator(
    '.gallery__item[data-video-id="x6iyz1AQhuU"]'
  );
  await galleryItem.click();

  const modal = await page.locator(".modal");
  await expect(modal).toHaveClass(/modal--active/);

  const iframe = await page.locator("iframe");
  expect(await iframe.count()).toBe(1);

  const closeButton = await page.locator(".modal__close");
  await closeButton.click();

  await expect(modal).not.toHaveClass(/modal--active/);

  expect(await iframe.count()).toBe(0);
});

test("pressing escape should close the modal", async ({ page }) => {
  await page.goto("http://localhost:5500");

  const galleryItem = await page.locator(
    '.gallery__item[data-video-id="x6iyz1AQhuU"]'
  );
  await galleryItem.click();

  const modal = await page.locator(".modal");
  await expect(modal).toHaveClass(/modal--active/);

  const iframe = await page.locator("iframe");
  expect(await iframe.count()).toBe(1);

  await page.keyboard.press("Escape");

  await expect(modal).not.toHaveClass(/modal--active/);

  expect(await iframe.count()).toBe(0); // Assert that the iframe is removed
});
