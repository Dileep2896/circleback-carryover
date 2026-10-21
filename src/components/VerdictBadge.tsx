import { motion } from "motion/react";
import {
  ArrowRightLeft,
  CalendarClock,
  CornerDownRight,
  Plus,
} from "lucide-react";
import type { Verdict } from "@/lib/carryover/types";
export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const owner = verdict.changes.some((c) => c.field === "assignee");
  const label =
    verdict.kind === "new"
      ? "New"
      : verdict.kind === "updated"
        ? owner
          ? "Owner changed"
          : "Due date moved"
        : verdict.kind === "ignored_done"
          ? "Already done"
          : `Carried over ×${(verdict.matchedItem?.mentionCount ?? 1) + 1}`;
  const Icon =
    verdict.kind === "new"
      ? Plus
      : verdict.kind === "updated"
        ? owner
          ? ArrowRightLeft
          : CalendarClock
        : CornerDownRight;
  return (
    <motion.span layout className={`badge ${verdict.kind}`}>
      <Icon size={12} />
      {label}
    </motion.span>
  );
}
