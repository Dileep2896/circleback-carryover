import { replayMeetings } from "@/lib/carryover/replay";
import { stallRadar } from "@/lib/carryover/stall";
import { DEMO_NOW } from "@/lib/carryover/constants";
import { SeedMeetingSource } from "./source";
import { SeedExtractor } from "./extractor";
export async function loadWorkspace(clock = () => new Date(DEMO_NOW)) {
  const source = new SeedMeetingSource();
  const extractor = new SeedExtractor();
  const [meetings, stored] = await Promise.all([
    source.listMeetings(),
    source.listActionItems({}),
  ]);
  if (!meetings.length)
    throw new Error("Demo data is missing. Run pnpm db:seed.");
  const extracted = await Promise.all(
    meetings.map(async (m) => ({ ...m, rawItems: await extractor.extract(m) })),
  );
  const links = Object.fromEntries(
    stored.filter((i) => i.linearIssueId).map((i) => [i.id, i.linearIssueId!]),
  );
  const replay = replayMeetings(extracted, links);
  return {
    meetings,
    ...replay,
    stalls: stallRadar(replay.items, clock()),
    now: clock().toISOString(),
  };
}
export type Workspace = Awaited<ReturnType<typeof loadWorkspace>>;
