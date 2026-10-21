import { api } from "@/services/api";
import { loadWorkspace } from "@/services/workspace";
export default api(["GET"], async (_req, res) => {
  const workspace = await loadWorkspace();
  res.json({ items: workspace.stalls, now: workspace.now });
});
