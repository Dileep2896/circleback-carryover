import { api } from "@/services/api";
import { loadWorkspace } from "@/services/workspace";
export default api(["GET"], async (_req, res) => {
  res.json(await loadWorkspace());
});
