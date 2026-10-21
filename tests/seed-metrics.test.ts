import { expect, it } from "vitest";
import { meetings, initialLinearLinks } from "@/lib/seed";
import { replayMeetings } from "@/lib/carryover/replay";
import { stallRadar } from "@/lib/carryover/stall";
it("replays 4 meetings: 31 raw → 19 unique, 2 conflicts, 2 stalls, 2 tracked", () => {
  const result = replayMeetings(meetings, initialLinearLinks);
  expect(meetings).toHaveLength(4);
  expect(meetings.map((m) => m.rawItems.length)).toEqual([9, 7, 8, 7]);
  expect(result.rawCount).toBe(31);
  expect(result.items).toHaveLength(19);
  expect(result.verdicts.filter((v) => v.kind === "updated")).toHaveLength(2);
  expect(stallRadar(result.items, new Date("2026-10-21"))).toHaveLength(2);
  expect(result.items.filter((i) => i.linearIssueId)).toHaveLength(2);
  expect(planThird(result)).toEqual([3, 2]);
});
function planThird(result: ReturnType<typeof replayMeetings>) {
  const vs = result.byMeeting["m3"];
  return [
    vs.filter((v) => v.kind === "new").length,
    vs.filter((v) => v.matchedItem?.linearIssueId).length,
  ];
}
