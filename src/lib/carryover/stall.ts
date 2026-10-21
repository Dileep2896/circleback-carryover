import { DAY_MS, STALL_DAYS, STALL_MENTIONS } from "./constants";
import type { ActionItem } from "./types";
export function isStalled(
  item: ActionItem,
  now: Date,
  thresholds = { mentions: STALL_MENTIONS, days: STALL_DAYS },
) {
  return (
    item.status === "PENDING" &&
    item.mentionCount >= thresholds.mentions &&
    now.getTime() - Date.parse(item.firstMentionedAt) >=
      thresholds.days * DAY_MS
  );
}
export function stallRadar(items: ActionItem[], now: Date) {
  return items
    .filter((i) => isStalled(i, now))
    .sort(
      (a, b) => Date.parse(a.firstMentionedAt) - Date.parse(b.firstMentionedAt),
    );
}
