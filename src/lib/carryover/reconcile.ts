import { DAY_MS, MATCH_THRESHOLD } from "./constants";
import { similarity } from "./score";
import type {
  ActionItem,
  Change,
  Context,
  RawActionItem,
  Verdict,
} from "./types";
export function reconcile(
  newItems: RawActionItem[],
  openItems: ActionItem[],
  ctx: Context,
): Verdict[] {
  const related = openItems.filter((item) =>
    item.contexts.some(
      (c) =>
        (c.seriesId && c.seriesId === ctx.seriesId) ||
        (c.companyId && c.companyId === ctx.companyId) ||
        c.attendeeIds.some((id) => ctx.attendeeIds.includes(id)),
    ),
  );
  return newItems.map((item) => {
    const candidates = related
      .map((candidate) => ({ candidate, ...similarity(item, candidate, ctx) }))
      .sort(
        (a, b) =>
          b.score - a.score || a.candidate.id.localeCompare(b.candidate.id),
      );
    const best = candidates[0];
    const base = {
      item,
      context: ctx,
      changes: [] as Change[],
      reasons: best?.reasons ?? [],
      score: best?.score ?? 0,
    };
    if (!best || best.score < MATCH_THRESHOLD)
      return {
        ...base,
        kind: item.status === "DONE" ? "ignored_done" : "new",
        matchId: null,
        matchedItem: null,
      };
    const matched = best.candidate;
    if (matched.status === "DONE" || item.status === "DONE")
      return {
        ...base,
        kind: "ignored_done",
        matchId: matched.id,
        matchedItem: matched,
      };
    const changes: Change[] = [];
    // A restatement that omits the owner or due date is not a change: only a
    // concrete new value that differs counts, so vaguer mentions never erase data.
    if (
      item.assignee &&
      item.assignee.profileId !== matched.assignee?.profileId
    )
      changes.push({
        field: "assignee",
        from: matched.assignee?.name ?? null,
        to: item.assignee?.name ?? null,
      });
    if (
      item.dueDate &&
      item.dueDate !== matched.dueDate &&
      (!matched.dueDate ||
        Math.abs(Date.parse(item.dueDate) - Date.parse(matched.dueDate)) >=
          DAY_MS)
    )
      changes.push({
        field: "dueDate",
        from: matched.dueDate,
        to: item.dueDate,
      });
    return {
      ...base,
      kind: changes.length ? "updated" : "carried_over",
      matchId: matched.id,
      matchedItem: matched,
      changes,
    };
  });
}
