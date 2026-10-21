import type { ActionItem, Verdict } from "./types";
export function applyVerdicts(
  items: ActionItem[],
  verdicts: Verdict[],
): ActionItem[] {
  const result = items.map((i) => ({
    ...i,
    meetingIds: [...i.meetingIds],
    contexts: [...i.contexts],
  }));
  for (const v of verdicts) {
    if (v.kind === "ignored_done") continue;
    if (v.kind === "new") {
      if (!result.some((i) => i.id === v.item.id))
        result.push({
          ...v.item,
          meetingIds: [v.context.meetingId],
          firstMentionedAt: v.context.date,
          mentionCount: 1,
          contexts: [v.context],
          linearIssueId: null,
        });
      continue;
    }
    const target = result.find((i) => i.id === v.matchId);
    if (!target || target.meetingIds.includes(v.context.meetingId)) continue;
    target.meetingIds.push(v.context.meetingId);
    target.contexts.push(v.context);
    target.mentionCount += 1;
    if (Date.parse(v.context.date) < Date.parse(target.firstMentionedAt))
      target.firstMentionedAt = v.context.date;
    if (v.kind === "updated") {
      for (const c of v.changes) {
        if (c.field === "assignee" && v.item.assignee)
          target.assignee = v.item.assignee;
        if (c.field === "dueDate" && v.item.dueDate)
          target.dueDate = v.item.dueDate;
      }
    }
  }
  return result;
}
