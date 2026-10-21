import { expect, it } from "vitest";
import { planLinearSync, confirmLinearSync } from "@/lib/carryover/linearPlan";
import { reconcile } from "@/lib/carryover/reconcile";
import { ctx, dana, item, raw } from "./fixtures";
it("only creates new work and comments on tracked carryovers and updates", async () => {
  const verdicts = reconcile(
    [
      raw(),
      raw({ id: "r2", title: "Build billing portal" }),
      raw({ id: "r3", title: "Security review", assignee: dana }),
    ],
    [
      item(),
      item({ id: "a2", title: "Security review", linearIssueId: "ENG-151" }),
    ],
    ctx,
  );
  const plan = planLinearSync(verdicts);
  expect(plan.create).toHaveLength(1);
  expect(plan.comment).toHaveLength(2);
  const calls: string[] = [];
  const mock = {
    createIssue: async (v: (typeof verdicts)[number]) => {
      calls.push(v.item.title);
      return "ENG-200";
    },
    commentOnIssue: async () => {},
  };
  await confirmLinearSync(plan, mock);
  expect(calls).toEqual(["Build billing portal"]);
});
it("never creates for untracked carryovers or completed items", () => {
  const vs = reconcile([raw()], [item({ linearIssueId: null })], ctx);
  expect(planLinearSync(vs)).toEqual({ create: [], comment: [] });
});
it("does not re-create new items that are already linked to a Linear issue", () => {
  const vs = reconcile(
    [raw({ id: "r9", title: "Build billing portal" })],
    [],
    ctx,
  );
  expect(planLinearSync(vs).create).toHaveLength(1);
  expect(planLinearSync(vs, { r9: "ENG-DEMO-R9" }).create).toHaveLength(0);
});
