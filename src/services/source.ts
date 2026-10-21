import type {
  ActionItem,
  Context,
  Meeting,
  RawActionItem,
} from "@/lib/carryover/types";
import { db } from "./db";
export interface MeetingSource {
  listMeetings(): Promise<Meeting[]>;
  listActionItems(filter: {
    status?: "PENDING" | "DONE";
  }): Promise<ActionItem[]>;
}
export class SeedMeetingSource implements MeetingSource {
  async listMeetings(): Promise<Meeting[]> {
    const rows = await db.meeting.findMany({
      orderBy: { date: "asc" },
      include: {
        attendees: { include: { person: { include: { company: true } } } },
      },
    });
    return rows.map((m) => ({
      id: m.id,
      title: m.title,
      date: m.date.toISOString(),
      duration: m.duration,
      seriesId: m.seriesId,
      companyId: m.companyId,
      rawItems: m.rawItems as unknown as RawActionItem[],
      attendees: m.attendees.map(({ person: p }) => ({
        profileId: p.id,
        name: p.name,
        title: p.title,
        email: p.email,
        companyName: p.company.name,
      })),
    }));
  }
  async listActionItems({
    status,
  }: {
    status?: "PENDING" | "DONE";
  }): Promise<ActionItem[]> {
    const rows = await db.actionItem.findMany({
      where: { status },
      include: {
        assignee: { include: { company: true } },
        mentions: true,
        linearIssue: true,
      },
    });
    return rows.map((i) => ({
      id: i.id,
      title: i.title,
      description: i.description,
      status: i.status as "PENDING" | "DONE",
      assignee: i.assignee
        ? {
            profileId: i.assignee.id,
            name: i.assignee.name,
            title: i.assignee.title,
            email: i.assignee.email,
            companyName: i.assignee.company.name,
          }
        : null,
      dueDate: i.dueDate?.toISOString().slice(0, 10) ?? null,
      firstMentionedAt: i.firstMentionedAt.toISOString(),
      mentionCount: i.mentionCount,
      meetingIds: i.mentions.map((m) => m.meetingId),
      contexts: i.context as unknown as Context[],
      linearIssueId: i.linearIssue?.id ?? null,
    }));
  }
}
/** Integration seam only. Implement cursor pagination and validation before enabling. */
export class HttpMeetingSource implements MeetingSource {
  readonly baseUrl = process.env.MEETINGS_API_URL ?? "";
  async listMeetings(): Promise<Meeting[]> {
    throw new Error(
      "HTTP source disabled. Implement GET /meetings with Authorization: Bearer <server-side key>.",
    );
  }
  async listActionItems(): Promise<ActionItem[]> {
    throw new Error(
      "HTTP source disabled. Implement GET /action-items with Authorization: Bearer <server-side key>.",
    );
  }
}
