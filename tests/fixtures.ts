import type { ActionItem, Context, RawActionItem } from "@/lib/carryover/types";
export const marcus = {
  profileId: "marcus",
  name: "Marcus Lee",
  title: "AE",
  companyName: "Acme Robotics",
  email: "marcus@example.test",
};
export const dana = { ...marcus, profileId: "dana", name: "Dana Kim" };
export const ctx: Context = {
  meetingId: "m2",
  date: "2026-10-07",
  attendeeIds: ["marcus"],
  seriesId: "initech",
  companyId: "initech",
  companies: ["Initech", "Globex", "Acme Robotics"],
};
export function raw(overrides: Partial<RawActionItem> = {}): RawActionItem {
  return {
    id: "r1",
    title: "Send Initech the updated pricing deck",
    description: "",
    assignee: marcus,
    dueDate: "2026-10-10",
    status: "PENDING",
    ...overrides,
  };
}
export function item(overrides: Partial<ActionItem> = {}): ActionItem {
  return {
    ...raw({ id: "a1" }),
    meetingIds: ["m1"],
    firstMentionedAt: "2026-09-23",
    mentionCount: 1,
    contexts: [{ ...ctx, meetingId: "m1" }],
    linearIssueId: "ENG-142",
    ...overrides,
  };
}
