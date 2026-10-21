import { api } from "@/services/api";
import { loadWorkspace } from "@/services/workspace";
export default api(["GET"], async (req, res) => {
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
  res.json({ verdicts });
});
