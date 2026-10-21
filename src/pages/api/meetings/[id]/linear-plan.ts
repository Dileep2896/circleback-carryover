import { api } from "@/services/api";
import { loadWorkspace } from "@/services/workspace";
import { confirmLinearSync, planLinearSync } from "@/lib/carryover/linearPlan";
import { MockLinearClient } from "@/services/linear";
import { db } from "@/services/db";
export default api(["GET", "POST"], async (req, res) => {
  const workspace = await loadWorkspace();
  const id = req.query.id;
  if (typeof id !== "string" || !/^[\w-]{1,64}$/.test(id)) {
    res.status(400).json({ error: "Invalid meeting id" });
    return;
  }
  const verdicts = Object.hasOwn(workspace.byMeeting, id)
    ? workspace.byMeeting[id]
    : undefined;
  if (!verdicts) {
    res.status(404).json({ error: "Meeting not found" });
    return;
  }
  const links = Object.fromEntries(
    workspace.items
      .filter((i) => i.linearIssueId)
      .map((i) => [i.id, i.linearIssueId as string]),
  );
  const plan = planLinearSync(verdicts, links);
  if (req.method === "GET") {
    res.json({
      plan,
      updateCount: verdicts.filter((v) => v.kind === "updated").length,
    });
    return;
  }
  const result = await db.$transaction(async (tx) => {
    const client = new MockLinearClient(tx);
    const result = await confirmLinearSync(plan, client);
    return { ...result, calls: client.calls };
  });
  res.json(result);
});
