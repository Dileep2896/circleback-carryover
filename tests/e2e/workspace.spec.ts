import { test, expect } from "@playwright/test";
test("workbench: meeting provenance, filters, replay, sync, theme", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Initech weekly sync #2" }),
  ).toBeVisible();
  await expect(page.getByText("Owner changed", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Share revised pricing slides with Initech" })
    .click();
  await expect(page.getByText("Mentioned in", { exact: true })).toBeVisible();
  await page.screenshot({ path: ".cache/qa/workbench.png", fullPage: true });
  await page.getByRole("button", { name: "New 3", exact: true }).click();
  await expect(
    page.getByText("Send Globex the pricing deck", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Scope SSO requirement", { exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "All 8", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Search commitments" })
    .fill("no such commitment");
  await expect(page.getByText("No matching commitments")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.getByRole("button", { name: "Review Linear sync" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByText("3 new · 2 already tracked · 1 update"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Confirm sync" }).click();
  await expect(page.getByText("Sync complete", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Back to commitments" }).click();
  await page.getByRole("button", { name: "Replay all meetings" }).click();
  await expect(
    page.getByText(
      "12 repeated commitments merged. Every meeting reference preserved.",
    ),
  ).toBeVisible();
  await expect(page.locator(".replay-grid>div")).toHaveCount(19);
  await page.getByRole("button", { name: "Close replay" }).click();
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveClass("dark");
  await page.screenshot({
    path: ".cache/qa/workbench-dark.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: /Oct 14.*Product standup/ }).click();
  await expect(page.getByText("Due date moved", { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
test("responsive workbench and every story scene fit the viewport", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 375, 414, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Initech weekly sync #2" }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator(".action-row").first()).toHaveCSS("opacity", "1");
    await page.screenshot({
      path: `.cache/qa/workbench-${width}.png`,
      fullPage: true,
    });
    await page.goto("/story?autoplay=1");
    for (let i = 0; i < 5; i++) {
      await page
        .getByRole("button", { name: new RegExp(`Scene ${i + 1}:`) })
        .click();
      await expect(page.locator(`#scene-${i}`)).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (width === 375)
        await page.screenshot({ path: `.cache/qa/story-375-${i}.png` });
    }
    await expect(page.locator(".impact-value")).toHaveText("−39%");
  }
});
test("story autoplay reaches impact, pauses and respects reduced motion", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/story?autoplay=1");
  await expect(page.locator("#scene-0")).toBeVisible();
  await expect(page.locator(".hero-thread")).toHaveCSS("opacity", "1");
  await expect(page.locator(".story-title > span").first()).toHaveCSS(
    "opacity",
    "1",
  );
  await page.screenshot({ path: ".cache/qa/story.png" });
  await expect(page.locator("#scene-4")).toBeVisible({ timeout: 23_000 });
  await expect(page.locator(".impact-value")).toHaveText("−39%", {
    timeout: 4000,
  });
  await page.screenshot({ path: ".cache/qa/story-impact.png" });
  await page.getByRole("button", { name: "Previous scene" }).click();
  await page.getByRole("button", { name: "Pause story" }).click();
  await expect(page.getByText("19 clear commitments")).toBeVisible();
  await page.screenshot({ path: ".cache/qa/story-diagram.png" });
  expect(errors).toEqual([]);
});
test("API scopes historical meetings and rejects invalid requests", async ({
  request,
  page,
}) => {
  const workspace = await request.get("/api/meetings");
  expect(workspace.ok()).toBe(true);
  const data = await workspace.json();
  expect(data.rawCount).toBe(31);
  expect(data.items).toHaveLength(19);
  const first = await request.get("/api/meetings/m1/reconcile");
  expect(
    (await first.json()).verdicts.every(
      (v: { kind: string }) => v.kind === "new",
    ),
  ).toBe(true);
  const stalls = await request.get("/api/stalls");
  expect((await stalls.json()).items).toHaveLength(2);
  expect((await request.get("/api/meetings/missing/reconcile")).status()).toBe(
    404,
  );
  expect((await request.delete("/api/meetings/m3/linear-plan")).status()).toBe(
    405,
  );
  expect(
    (
      await request.post("/api/meetings/m3/linear-plan", {
        headers: { Origin: "null" },
      })
    ).status(),
  ).toBe(403);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/story");
  await page.getByRole("button", { name: "Scene 5: The impact" }).click();
  await expect(
    page.getByRole("link", { name: "Try the feature" }),
  ).toBeInViewport();
  await page.getByRole("link", { name: "Try the feature" }).click();
  await expect(
    page.getByRole("heading", { name: "Every commitment, connected." }),
  ).toBeVisible();
});
