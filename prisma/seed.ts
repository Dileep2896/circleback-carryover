import { db } from "../src/services/db";
import { meetings, people, initialLinearLinks } from "../src/lib/seed";
import { replayMeetings } from "../src/lib/carryover/replay";
import { Prisma } from "@prisma/client";
async function main() {
  await db.$transaction(
    async (tx) => {
      await tx.linearComment.deleteMany();
      await tx.linearIssue.deleteMany();
      await tx.actionItemMention.deleteMany();
      await tx.actionItem.deleteMany();
      await tx.meetingAttendee.deleteMany();
      await tx.meeting.deleteMany();
      await tx.person.deleteMany();
      await tx.series.deleteMany();
      await tx.company.deleteMany();
      for (const [id, name] of [
        ["acme", "Acme Robotics"],
        ["initech", "Initech"],
        ["globex", "Globex"],
      ])
        await tx.company.create({ data: { id, name } });
      for (const p of people)
        await tx.person.create({
          data: {
            id: p.profileId,
            name: p.name,
            title: p.title,
            email: p.email,
            companyId: p.companyName === "Initech" ? "initech" : "acme",
          },
        });
      await tx.series.createMany({
        data: [
          { id: "customer", name: "Initech weekly sync" },
          { id: "product", name: "Product standup" },
        ],
      });
      for (const m of meetings)
        await tx.meeting.create({
          data: {
            id: m.id,
            title: m.title,
            date: new Date(m.date),
            duration: m.duration,
            seriesId: m.seriesId,
            companyId: m.companyId,
            rawItems: m.rawItems as unknown as Prisma.InputJsonValue,
            attendees: {
              create: m.attendees.map((p) => ({ personId: p.profileId })),
            },
          },
        });
      for (const i of replayMeetings(meetings, initialLinearLinks).items) {
        await tx.actionItem.create({
          data: {
            id: i.id,
            title: i.title,
            description: i.description,
            status: i.status,
            assigneeId: i.assignee?.profileId,
            dueDate: i.dueDate ? new Date(i.dueDate) : null,
            firstMentionedAt: new Date(i.firstMentionedAt),
            mentionCount: i.mentionCount,
            context: i.contexts as unknown as Prisma.InputJsonValue,
            mentions: {
              create: i.meetingIds.map((meetingId) => ({ meetingId })),
            },
          },
        });
        if (i.linearIssueId)
          await tx.linearIssue.create({
            data: { id: i.linearIssueId, actionItemId: i.id, title: i.title },
          });
      }
    },
    { timeout: 30_000 },
  );
  console.log(
    "Seeded 4 meetings, 31 extracted items, 19 commitments, 2 existing Linear issues.",
  );
}
main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
