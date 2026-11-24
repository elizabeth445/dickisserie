import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }, info) => {
  test.skip(
    info.project.name !== "desktop",
    "Review tools are for desktop browsers.",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("feedback survives reload and exports an editable element comment", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator.clipboard, "writeText", {
      configurable: true,
      value: async (text: string) => {
        (window as unknown as { reviewExport: string }).reviewExport = text;
      },
    });
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Start feedback mode", exact: true })
    .click();
  await page.locator(".masthead").click();
  await page
    .getByPlaceholder("What should change?", { exact: true })
    .fill("Сделать заголовок меньше.");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await page.reload();
  await page
    .getByRole("button", { name: "Start feedback mode", exact: true })
    .click();
  const marker = page.getByRole("button", { name: /^Edit annotation 1:/ });
  await expect(marker).toBeVisible();
  await marker.click();
  await expect(
    page.getByPlaceholder("Edit your feedback...", { exact: true }),
  ).toHaveValue("Сделать заголовок меньше.");
  await page
    .getByPlaceholder("Edit your feedback...", { exact: true })
    .fill("Сделать заголовок немного меньше, сохранив шрифт.");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page
    .getByRole("button", { name: "Copy feedback", exact: true })
    .click();
  const output = await page.evaluate(
    () => (window as unknown as { reviewExport: string }).reviewExport,
  );
  expect(output).toContain("DICKISSERIE");
  expect(output).toContain(".masthead");
  expect(output).toContain("src/sections/Hero.tsx");
  expect(output).toContain("Сделать заголовок немного меньше, сохранив шрифт.");
  await marker.click();
  await page
    .getByRole("button", { name: "Delete annotation", exact: true })
    .click();
  await expect(marker).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Copy feedback", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Exit", exact: true }).click();
  await page.locator(".hero-cta .button").click();
  await expect(page).toHaveURL(/#menu$/);
});

test("feedback can target the cart without closing its dialog", async ({
  page,
}) => {
  await page.goto("/");
  // Ensure the lazy-loaded local tools are ready before opening the host dialog.
  await expect(
    page.getByRole("button", { name: "Start feedback mode", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Your bag 0 items", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Start feedback mode", exact: true })
    .click();
  await page.getByRole("heading", { name: "Your bag", exact: true }).click();
  await page
    .getByPlaceholder("What should change?", { exact: true })
    .fill("Изменить заголовок корзины.");
  await page.keyboard.press("Escape");
  await expect(
    page.getByPlaceholder("What should change?", { exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("dialog", { name: "Your bag", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Exit", exact: true }).click();
  await page.getByRole("button", { name: "Close panel", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Your bag 0 items", exact: true }),
  ).toBeFocused();
});
