import { expect, it } from "vitest";
import { isStalled, stallRadar } from "@/lib/carryover/stall";
import { item } from "./fixtures";
it("requires pending, three mentions and the 14-day boundary", () => {
  const pending = item({ mentionCount: 3, firstMentionedAt: "2026-10-07" });
  expect(isStalled(pending, new Date("2026-10-20"))).toBe(false);
  expect(isStalled(pending, new Date("2026-10-21"))).toBe(true);
  expect(
    isStalled({ ...pending, status: "DONE" }, new Date("2026-10-21")),
  ).toBe(false);
  expect(
    isStalled({ ...pending, mentionCount: 2 }, new Date("2026-10-21")),
  ).toBe(false);
  expect(stallRadar([pending], new Date("2026-10-21"))).toHaveLength(1);
  expect(
    isStalled({ ...pending, mentionCount: 2 }, new Date("2026-10-21"), {
      mentions: 2,
      days: 7,
    }),
  ).toBe(true);
});
