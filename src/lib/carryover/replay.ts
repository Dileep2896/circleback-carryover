import { applyVerdicts } from "./merge";
import { reconcile } from "./reconcile";
import type { ActionItem, Context, Meeting, Verdict } from "./types";
export function meetingContext(m: Meeting): Context {
  return {
    meetingId: m.id,
    date: m.date,
    attendeeIds: m.attendees.map((p) => p.profileId),
    seriesId: m.seriesId,
    companyId: m.companyId,
    companies: ["Initech", "Globex", "Acme Robotics"],
  };
}
export function replayMeetings(
  meetings: Meeting[],
  linearLinks: Record<string, string> = {},
) {
  let items: ActionItem[] = [];
  const verdicts: Verdict[] = [],
    byMeeting: Record<string, Verdict[]> = {};
  let rawCount = 0;
  for (const meeting of [...meetings].sort(
    (a, b) => Date.parse(a.date) - Date.parse(b.date),
  )) {
    const vs = reconcile(meeting.rawItems, items, meetingContext(meeting));
    items = applyVerdicts(items, vs).map((i) => ({
      ...i,
      linearIssueId: linearLinks[i.id] ?? i.linearIssueId,
    }));
    verdicts.push(...vs);
    byMeeting[meeting.id] = vs;
    rawCount += meeting.rawItems.length;
  }
  return { items, verdicts, byMeeting, rawCount };
}
