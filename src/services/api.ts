import type { NextApiRequest, NextApiResponse } from "next";
export function api(
  methods: string[],
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Cache-Control", "no-store");
    if (!methods.includes(req.method ?? "")) {
      res.setHeader("Allow", methods.join(", "));
      res.status(405).json({ error: "Method not allowed" });
      return;
    }
    if (req.method === "POST" && req.headers.origin) {
      try {
        if (new URL(req.headers.origin).host !== req.headers.host) {
          res.status(403).json({ error: "Origin not allowed" });
          return;
        }
      } catch {
        res.status(403).json({ error: "Invalid origin" });
        return;
      }
    }
    try {
      await handler(req, res);
    } catch (error) {
      console.error(error);
      const missing =
        error instanceof Error && error.message.includes("pnpm db:seed");
      res.status(500).json({
        error: missing
          ? "Demo data is missing. Run pnpm db:seed, then retry."
          : "Something went wrong. Please retry.",
      });
    }
  };
}
