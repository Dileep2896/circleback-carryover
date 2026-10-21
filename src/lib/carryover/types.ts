export type Person = {
  profileId: string;
  name: string;
  title: string;
  companyName: string;
  email: string;
};
export type Context = {
  meetingId: string;
  date: string;
  attendeeIds: string[];
  seriesId: string;
  companyId: string;
  companies: string[];
};
export type RawActionItem = {
  id: string;
  title: string;
  description: string;
  assignee: Person | null;
  dueDate: string | null;
  status: "PENDING" | "DONE";
};
export type ActionItem = RawActionItem & {
  meetingIds: string[];
  firstMentionedAt: string;
  mentionCount: number;
  contexts: Context[];
  linearIssueId: string | null;
};
export type Change = {
  field: "assignee" | "dueDate";
  from: string | null;
  to: string | null;
};
export type Verdict = {
  kind: "new" | "carried_over" | "updated" | "ignored_done";
  item: RawActionItem;
  matchId: string | null;
  score: number;
  reasons: string[];
  changes: Change[];
  matchedItem: ActionItem | null;
  context: Context;
};
export type Meeting = {
  id: string;
  title: string;
  date: string;
  duration: number;
  seriesId: string;
  companyId: string;
  attendees: Person[];
  rawItems: RawActionItem[];
};
export type LinearPlan = { create: Verdict[]; comment: Verdict[] };
