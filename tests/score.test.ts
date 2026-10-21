import { expect, it } from "vitest";
import { similarity } from "@/lib/carryover/score";
import { ctx, item, raw } from "./fixtures";
it.each([
  [
    "Send Initech the updated pricing deck",
    "Share revised pricing slides with Initech",
    true,
  ],
  ["Follow up on onboarding", "Check in on onboarding", true],
  [
    "Open PR for webhook retries",
    "Open pull request for webhook retries",
    true,
  ],
  ["Fix CSV export timeout", "CSV export timeout fix", true],
  ["Send Initech the pricing deck", "Send Globex the pricing deck", false],
  ["Scope SSO requirement", "Draft onboarding empty states", false],
  ["Share SOC 2 report with John", "Send SOC 2 report to John", true],
])("scores %s vs %s", (a, b, match) => {
  expect(
    similarity(raw({ title: a }), item({ title: b }), ctx).score >= 0.62,
  ).toBe(match);
});
it("does not let a matching description bypass company guard", () => {
  expect(
    similarity(
      raw({
        title: "Send Globex the pricing deck",
        description: "Prepare the customer slides",
      }),
      item({ description: "Prepare the customer slides" }),
      ctx,
    ).score,
  ).toBe(0);
});
