import type { LinearClient } from "@/lib/carryover/linearPlan";
import type { Verdict } from "@/lib/carryover/types";
import { db } from "./db";
export type LinearStore = Pick<typeof db, "linearIssue" | "linearComment">;
export class MockLinearClient implements LinearClient {
  readonly calls: {
    method: "createIssue" | "commentOnIssue";
    id: string;
    itemId: string;
  }[] = [];
  constructor(private store: LinearStore = db) {}
  async createIssue(verdict: Verdict) {
    if (verdict.kind !== "new")
      throw new Error("Only new work can create a Linear issue.");
    const id = `ENG-DEMO-${verdict.item.id.toUpperCase()}`;
    const issue = await this.store.linearIssue.upsert({
      where: { actionItemId: verdict.item.id },
      update: {},
      create: { id, title: verdict.item.title, actionItemId: verdict.item.id },
    });
    this.calls.push({
      method: "createIssue",
      id: issue.id,
      itemId: verdict.item.id,
    });
    return issue.id;
  }
  async commentOnIssue(issueId: string, verdict: Verdict) {
    const key = `${issueId}:${verdict.context.meetingId}:${verdict.item.id}`;
    const changes = verdict.changes
      .map(
        (c) =>
          `${c.field}: ${c.from ?? "unassigned"} → ${c.to ?? "unassigned"}`,
      )
      .join("; ");
    await this.store.linearComment.upsert({
      where: { key },
      update: {},
      create: {
        key,
        issueId,
        body: `Mentioned in ${verdict.context.meetingId}: ${verdict.item.title}. ${changes}`,
      },
    });
    this.calls.push({
      method: "commentOnIssue",
      id: issueId,
      itemId: verdict.item.id,
    });
  }
}
