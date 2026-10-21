import { expect, it } from "vitest";
import { applyVerdicts } from "@/lib/carryover/merge";
import { reconcile } from "@/lib/carryover/reconcile";
import { ctx, dana, item, raw } from "./fixtures";
it("merges provenance, increments once and stays idempotent on replay", () => {
  const old = item();
  const verdicts = reconcile([raw()], [old], ctx);
  const merged = applyVerdicts([old], verdicts);
  expect(merged).toHaveLength(1);
  expect(merged[0].meetingIds).toEqual(["m1", "m2"]);
  expect(merged[0].mentionCount).toBe(2);
  expect(merged[0].firstMentionedAt).toBe("2026-09-23");
  expect(applyVerdicts(merged, verdicts)).toEqual(merged);
  expect(old.mentionCount).toBe(1);
});
it("applies updates and retains the original title and Linear link", () => {
  const merged = applyVerdicts(
    [item()],
    reconcile([raw({ assignee: dana })], [item()], ctx),
  );
  expect(merged[0].assignee).toEqual(dana);
  expect(merged[0].linearIssueId).toBe("ENG-142");
});
it("does not create items for completed matches", () => {
  const done = item({ status: "DONE" });
  expect(applyVerdicts([done], reconcile([raw()], [done], ctx))).toEqual([
    done,
  ]);
});
it("never erases a known owner or due date when a restatement omits them", () => {
  const old = item();
  const verdicts = reconcile(
    [raw({ assignee: null, dueDate: null })],
    [old],
    ctx,
  );
  const [merged] = applyVerdicts([old], verdicts);
  expect(merged.assignee).toEqual(old.assignee);
  expect(merged.dueDate).toBe(old.dueDate);
  expect(merged.mentionCount).toBe(old.mentionCount + 1);
});
