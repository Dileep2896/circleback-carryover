import { expect, it } from "vitest";
import { reconcile } from "@/lib/carryover/reconcile";
import { ctx, dana, item, raw } from "./fixtures";
it("returns one verdict per input, including completed commitments", () => {
  const result = reconcile(
    [
      raw(),
      raw({ id: "r2", title: "Design mobile navigation" }),
      raw({ id: "r3", title: "Finish security review" }),
    ],
    [
      item(),
      item({ id: "done", title: "Finish security review", status: "DONE" }),
    ],
    ctx,
  );
  expect(result.map((v) => v.kind)).toEqual([
    "carried_over",
    "new",
    "ignored_done",
  ]);
  expect(
    result.every((v) => "matchId" in v && typeof v.score === "number"),
  ).toBe(true);
});
it("flags changed owner and >= one-day changed deadline", () => {
  const [v] = reconcile(
    [raw({ assignee: dana, dueDate: "2026-10-11" })],
    [item()],
    ctx,
  );
  expect(v.kind).toBe("updated");
  expect(v.changes).toEqual([
    { field: "assignee", from: "Marcus Lee", to: "Dana Kim" },
    { field: "dueDate", from: "2026-10-10", to: "2026-10-11" },
  ]);
});
it("ignores sub-day movement and restatements that omit due date or owner", () => {
  expect(
    reconcile([raw({ dueDate: "2026-10-10T12:00:00Z" })], [item()], ctx)[0]
      .kind,
  ).toBe("carried_over");
  expect(reconcile([raw({ dueDate: null })], [item()], ctx)[0].kind).toBe(
    "carried_over",
  );
  expect(reconcile([raw({ assignee: null })], [item()], ctx)[0].kind).toBe(
    "carried_over",
  );
});
it("unrelated identical titles remain new", () => {
  expect(
    reconcile(
      [raw()],
      [
        item({
          contexts: [
            {
              ...ctx,
              attendeeIds: ["other"],
              seriesId: "other",
              companyId: "other",
            },
          ],
        }),
      ],
      ctx,
    )[0].kind,
  ).toBe("new");
});
it.each(["attendee", "series", "company"])(
  "allows relation by %s independently",
  (key) => {
    const related = {
      ...ctx,
      attendeeIds: ["other"],
      seriesId: "other",
      companyId: "other",
    };
    if (key === "attendee") related.attendeeIds = ["marcus"];
    if (key === "series") related.seriesId = ctx.seriesId;
    if (key === "company") related.companyId = ctx.companyId;
    expect(
      reconcile([raw()], [item({ contexts: [related] })], ctx)[0].kind,
    ).toBe("carried_over");
  },
);
