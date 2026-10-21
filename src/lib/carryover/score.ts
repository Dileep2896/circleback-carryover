import { companyEntities, jaccard, normalize } from "./normalize";
import type { ActionItem, Context, RawActionItem } from "./types";
export function similarity(a: RawActionItem, b: ActionItem, ctx: Context) {
  const at = `${a.title} ${a.description}`,
    bt = `${b.title} ${b.description}`;
  const ac = companyEntities(at, ctx.companies),
    bc = companyEntities(bt, ctx.companies);
  if (ac.length && bc.length && !ac.some((c) => bc.includes(c)))
    return { score: 0, reasons: ["Different company entities"] };
  const lexical = jaccard(normalize(at, false), normalize(bt, false));
  const semantic = jaccard(normalize(at), normalize(bt));
  const sameOwner =
    !!a.assignee && a.assignee.profileId === b.assignee?.profileId;
  const score = Math.min(
    1,
    0.25 * lexical + 0.65 * semantic + (sameOwner ? 0.1 : 0),
  );
  return {
    score: Math.round(score * 1000) / 1000,
    reasons: [
      `${Math.round(semantic * 100)}% normalized meaning overlap`,
      ...(sameOwner ? ["Same assignee"] : []),
    ],
  };
}
