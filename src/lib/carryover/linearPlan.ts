import type { LinearPlan, Verdict } from "./types";
export interface LinearClient {
  createIssue(verdict: Verdict): Promise<string>;
  commentOnIssue(issueId: string, verdict: Verdict): Promise<void>;
}
export function planLinearSync(
  verdicts: Verdict[],
  existingLinks: Record<string, string> = {},
): LinearPlan {
  return {
    // Items already linked to a Linear issue (e.g. after a previous Confirm) are never re-created.
    create: verdicts.filter(
      (v) => v.kind === "new" && !existingLinks[v.item.id],
    ),
    comment: verdicts.filter(
      (v) =>
        (v.kind === "carried_over" || v.kind === "updated") &&
        v.matchedItem?.linearIssueId,
    ),
  };
}
export async function confirmLinearSync(
  plan: LinearPlan,
  client: LinearClient,
) {
  const issues: string[] = [];
  for (const v of plan.create) issues.push(await client.createIssue(v));
  for (const v of plan.comment)
    await client.commentOnIssue(v.matchedItem!.linearIssueId!, v);
  return { issues, commented: plan.comment.length };
}
