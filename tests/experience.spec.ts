import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
const key = "dickisserie.cart.v1";
async function ready(page: Page) {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
}

test("menu filtering, details, quantities, persistence, removal and complete demo checkout", async ({
  page,
}) => {
  await ready(page);
  await page.getByRole("button", { name: "Your bag 0 items" }).click();
  await expect(
    page.getByText("Your bag is empty", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close panel" }).click();
  await page
    .locator(".category-tabs")
    .getByRole("button", { name: "Mini waffles", exact: true })
    .click();
  await page
    .locator(".product-row")
    .filter({ hasText: "Mini Dick Waffles" })
    .filter({ hasText: "9 mini waffles" })
    .click();
  await page
    .getByRole("button", { name: "View Mini Dick Waffles", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Increase Mini Dick Waffles quantity" })
    .click();
  await page
    .getByRole("button", { name: "Add to bag · €18", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Your bag 2 items" }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Your bag 2 items" }).click();
  await expect(page.locator(".cart-summary strong")).toHaveText("€18");
  await page
    .getByRole("button", { name: "Increase Mini Dick Waffles quantity" })
    .click();
  await expect(page.locator(".cart-summary strong")).toHaveText("€27");
  await page
    .getByRole("button", { name: "Decrease Mini Dick Waffles quantity" })
    .click();
  await page.getByRole("button", { name: "Remove Mini Dick Waffles" }).click();
  await expect(
    page.getByText("Your bag is empty", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close panel" }).click();
  await page
    .locator(".category-tabs")
    .getByRole("button", { name: "Pussy waffles", exact: true })
    .click();
  await expect(page.locator(".product-row")).toHaveCount(2);
  await page
    .locator(".selected-actions")
    .getByRole("button", { name: "Add to bag · €17", exact: true })
    .click();
  await page.getByRole("button", { name: "Your bag 1 item" }).click();
  await page.getByRole("button", { name: "Review demo order" }).click();
  await page.getByRole("button", { name: "Confirm demo order · €17" }).click();
  await expect(page.getByRole("combobox")).toBeFocused();
  await page.getByLabel("Choose a demo pickup window").selectOption("30min");
  await expect(
    page.getByText(
      "Demo only — no payment is taken and no order is sent to the bar",
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: "Confirm demo order · €17" }).click();
  await expect(page.getByText("Your demo order is complete")).toBeVisible();
  await expect(page.locator(".order-reference")).toContainText(
    /DCK-[A-F0-9]{6}/,
  );
  await page.getByRole("button", { name: "Keep exploring" }).click();
  await expect(
    page.getByRole("button", { name: "Your bag 0 items" }),
  ).toBeVisible();
  const stored = await page.evaluate(
    (k) => JSON.parse(localStorage.getItem(k) || "{}"),
    key,
  );
  expect(stored).toEqual({ version: 1, items: [] });
});

test("dialog traps focus, Escape closes, background scroll is locked and focus returns", async ({
  page,
}) => {
  await ready(page);
  const trigger = page.getByRole("button", { name: "Your bag 0 items" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe(
    "hidden",
  );
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() => !!document.activeElement?.closest("dialog")),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});

test("malformed and untrusted cart values recover without arbitrary products", async ({
  page,
}) => {
  await page.addInitScript((k) => {
    localStorage.setItem(
      k,
      JSON.stringify({
        version: 1,
        items: [
          { id: "dick-trio", quantity: 2 },
          { id: "unknown", quantity: 100 },
          { id: "mini-nine", quantity: -1 },
          { id: "single-dick", quantity: 1.5 },
        ],
      }),
    );
  }, key);
  await ready(page);
  await page.getByRole("button", { name: "Your bag 2 items" }).click();
  await expect(page.locator(".cart-item")).toHaveCount(1);
  await expect(page.locator(".cart-summary strong")).toHaveText("€34");
});

test("corrupt JSON does not break the page", async ({ page }) => {
  await page.addInitScript((k) => localStorage.setItem(k, "{broken"), key);
  await ready(page);
  await expect(
    page.getByRole("heading", { name: "DICKISSERIE", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Your bag 0 items" }).click();
  await expect(page.locator(".empty-bag")).toBeVisible();
});

test("mobile navigation closes on selection and restores focus on Escape", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "mobile");
  await ready(page);
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "The bar", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page).toHaveURL(/#bar$/);
});

test("page and populated modal have no axe WCAG A/AA violations", async ({
  page,
}) => {
  await ready(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  await page
    .locator(".selected-actions")
    .getByRole("button", { name: "Add to bag · €17", exact: true })
    .click();
  await page.getByRole("button", { name: "Your bag 1 item" }).click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("site resources stay local except the embedded Google map and no runtime errors occur", async ({
  page,
}) => {
  const errors: string[] = [];
  const failed: string[] = [];
  const external: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (r) => {
    if (r.request().frame() !== page.mainFrame()) return;
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });
  page.on("request", (r) => {
    if (r.frame() !== page.mainFrame()) return;
    if (
      !r.url().startsWith("http://127.0.0.1:5173") &&
      !r.url().startsWith("data:")
    )
      external.push(r.url());
  });
  await ready(page);
  await page.locator("#visit").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
  expect(external).toEqual([]);
  expect(
    await page
      .locator("img")
      .evaluateAll((images) =>
        images
          .filter((im) => !im.complete || im.naturalWidth === 0)
          .map((im) => im.src),
      ),
  ).toEqual([]);
});

test("responsive geometry and screenshot evidence across the full viewport matrix", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop");
  test.setTimeout(90000);
  await mkdir("output/screenshots", { recursive: true });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  for (const width of [320, 375, 390, 428, 768, 1024, 1280, 1440, 1600, 1920]) {
    await page.setViewportSize({ width, height: width < 701 ? 844 : 1000 });
    for (const id of ["home", "menu", "bar", "visit"]) {
      await page.evaluate((id) => {
        const el = document.getElementById(id);
        window.scrollTo({
          top: id === "home" ? 0 : el?.offsetTop || 0,
          behavior: "instant",
        });
      }, id);
      await page.waitForTimeout(100);
      const bad = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll("a,button,h1,h2,h3,p,address,select"),
        )
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return (
              r.width > 0 &&
              (r.left < -0.5 || r.right > innerWidth + 0.5) &&
              !el.closest(".hero-artwork")
            );
          })
          .map((el) => ({
            tag: el.tagName,
            text: el.textContent?.slice(0, 60),
            rect: {
              left: el.getBoundingClientRect().left,
              right: el.getBoundingClientRect().right,
            },
          })),
      );
      expect(bad, `Visible content must fit at ${width}px in ${id}`).toEqual(
        [],
      );
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await page.screenshot({ path: `output/screenshots/${width}-${id}.png` });
    }
  }
});

test("reduced motion leaves artwork visible and stops scene motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  await expect(page.locator(".masthead")).toBeVisible();
  expect(
    await page
      .locator(".hero-photograph")
      .evaluate((el) => getComputedStyle(el).opacity),
  ).toBe("1");
  await expect(
    page.locator(
      ".drip-drop,.tongue-drip,.waffle-glaze,.portrait-layer,.box-layer,.cocktail-layer",
    ),
  ).toHaveCount(0);
  const before = await page.locator(".hero-photograph").getAttribute("style");
  await page.waitForTimeout(300);
  expect(await page.locator(".hero-photograph").getAttribute("style")).toBe(
    before,
  );
});

test("unavailable local storage leaves the bag usable and explains persistence failure", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage blocked", "SecurityError");
    };
  });
  await ready(page);
  await page
    .locator(".selected-actions")
    .getByRole("button", { name: "Add to bag · €17", exact: true })
    .click();
  await page.getByRole("button", { name: "Your bag 1 item" }).click();
  await expect(
    page.getByText("Your browser could not save the bag", { exact: false }),
  ).toBeVisible();
  await expect(page.locator(".cart-summary strong")).toHaveText("€17");
});

test("quantity limits produce accurate feedback without silently adding extra items", async ({
  page,
}) => {
  await page.addInitScript(
    (k) =>
      localStorage.setItem(
        k,
        JSON.stringify({
          version: 1,
          items: [{ id: "dick-trio", quantity: 19 }],
        }),
      ),
    key,
  );
  await ready(page);
  const add = page
    .locator(".selected-actions")
    .getByRole("button", { name: "Add to bag · €17", exact: true });
  await add.click();
  await add.click();
  await expect(page.getByRole("status")).toContainText(
    "already holds the limit of 20",
  );
  await page.getByRole("button", { name: "Your bag 20 items" }).click();
  await expect(
    page.getByRole("button", {
      name: "Increase Box of 3 Dick Waffles quantity",
    }),
  ).toBeDisabled();
  await expect(page.locator(".cart-summary strong")).toHaveText("€340");
});
