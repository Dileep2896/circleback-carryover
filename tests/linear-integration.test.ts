import { afterAll, expect, it } from "vitest";
import { db } from "@/services/db";
import { MockLinearClient } from "@/services/linear";
import { confirmLinearSync, planLinearSync } from "@/lib/carryover/linearPlan";
import { replayMeetings } from "@/lib/carryover/replay";
import { initialLinearLinks, meetings } from "@/lib/seed";
afterAll(() => db.$disconnect());
it("mock records only new creates and two comments; retries remain idempotent", async () => {
  // Roll the transaction back so the shared demo stays pristine.
  const rollback = new Error("test rollback");
  try {
    await db.$transaction(async (tx) => {
      const plan = planLinearSync(
        replayMeetings(meetings, initialLinearLinks).byMeeting.m3,
      );
      const ids = plan.create.map((v) => v.item.id);
      await tx.linearComment.deleteMany({
        where: { key: { contains: ":m3:" } },
      });
      await tx.linearIssue.deleteMany({ where: { actionItemId: { in: ids } } });
      const client = new MockLinearClient(tx);
      await confirmLinearSync(plan, client);
      await confirmLinearSync(plan, client);
      expect(
        client.calls
          .filter((c) => c.method === "createIssue")
          .map((c) => c.itemId),
      ).toEqual([...ids, ...ids]);
      expect(
        client.calls.filter((c) => c.method === "commentOnIssue"),
      ).toHaveLength(4);
      expect(
        await tx.linearIssue.count({ where: { actionItemId: { in: ids } } }),
      ).toBe(3);
      expect(
        await tx.linearComment.count({ where: { key: { contains: ":m3:" } } }),
      ).toBe(2);
      expect(
        await tx.linearIssue.count({
          where: { actionItemId: { in: ["pricing", "soc"] } },
        }),
      ).toBe(2);
      throw rollback;
    });
  } catch (e) {
    if (e !== rollback) throw e;
  }
});
