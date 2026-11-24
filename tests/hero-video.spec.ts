import { test, expect } from "@playwright/test";

test("loads the supplied 4K master on desktop and Full HD on smaller screens", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const expectedWidth = page.viewportSize()!.width > 1100 ? 3840 : 1920;
  await expect
    .poll(() =>
      page.locator(".hero-video").evaluate((v: HTMLVideoElement) => v.duration),
    )
    .toBeCloseTo(7.9, 1);
  await expect
    .poll(() =>
      page
        .locator(".hero-video")
        .evaluate((v: HTMLVideoElement) => v.videoWidth),
    )
    .toBe(expectedWidth);
  await expect
    .poll(() =>
      page
        .locator(".hero-video")
        .evaluate((v: HTMLVideoElement) => v.videoHeight),
    )
    .toBe((expectedWidth * 9) / 16);
});

test("hero plays once, respects manual pause, suspends offscreen and can replay", async ({
  page,
}, info) => {
  test.skip(info.project.name === "reduced-motion");
  await page.goto("/");
  const video = page.locator(".hero-video");
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime))
    .toBeGreaterThan(0.1);
  expect(
    await video.evaluate((v: HTMLVideoElement) => ({
      muted: v.muted,
      inline: v.playsInline,
      loop: v.loop,
    })),
  ).toEqual({ muted: true, inline: true, loop: false });

  await page
    .getByRole("button", { name: "Pause animation", exact: true })
    .click();
  const stopped = await video.evaluate((v: HTMLVideoElement) => v.currentTime);
  await page.waitForTimeout(200);
  expect(
    await video.evaluate((v: HTMLVideoElement) => v.currentTime),
  ).toBeCloseTo(stopped, 1);
  await page
    .locator("#bar")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await page
    .locator("#home")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(true);

  await page
    .getByRole("button", { name: "Play animation", exact: true })
    .click();
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(false);
  await page
    .locator("#bar")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(true);
  await page
    .locator("#home")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(false);

  await video.evaluate((v: HTMLVideoElement) => {
    v.currentTime = v.duration - 0.15;
  });
  await expect(
    page.getByRole("button", { name: "Replay animation", exact: true }),
  ).toBeVisible();
  await expect(video).toHaveCSS("opacity", "0");
  await page
    .getByRole("button", { name: "Replay animation", exact: true })
    .click();
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime))
    .toBeLessThan(1);
  await expect(
    page.getByRole("button", { name: "Pause animation", exact: true }),
  ).toBeVisible();
});

test("reduced motion avoids the video request and reacts to a live preference change", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const media: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith(".mp4")) media.push(request.url());
  });
  await page.goto("/");
  await expect(page.locator(".hero-still img")).toBeVisible();
  await expect(page.locator(".hero-video")).toHaveCount(0);
  expect(media).toEqual([]);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".hero-video")).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".hero-video")).toHaveCount(0);
  await expect(page.locator(".hero-motion-control")).toHaveCount(0);
  await expect(page.locator(".hero-still img")).toBeVisible();
});

test("video failure leaves a static hero and working menu", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.route("**/assets/hero-motion-*.mp4", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator(".hero-video")).toHaveCSS("opacity", "0");
  await expect(page.locator(".hero-motion-control")).toHaveCount(0);
  await expect(page.locator(".hero-still img")).toBeVisible();
  await page.locator(".hero-cta .button").click();
  await expect(page).toHaveURL(/#menu$/);
});

test("blocked autoplay preserves the photo and allows deliberate playback", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const original = HTMLMediaElement.prototype.play;
    (
      window as unknown as { restoreHeroPlayback: () => void }
    ).restoreHeroPlayback = () => {
      HTMLMediaElement.prototype.play = original;
    };
    HTMLMediaElement.prototype.play = () =>
      Promise.reject(new DOMException("Autoplay blocked", "NotAllowedError"));
  });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Play animation", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".hero-video")).toHaveCSS("opacity", "0");
  await page.evaluate(() =>
    (
      window as unknown as { restoreHeroPlayback: () => void }
    ).restoreHeroPlayback(),
  );
  await page
    .getByRole("button", { name: "Play animation", exact: true })
    .click();
  await expect
    .poll(() =>
      page
        .locator(".hero-video")
        .evaluate((v: HTMLVideoElement) => v.currentTime),
    )
    .toBeGreaterThan(0);
});
