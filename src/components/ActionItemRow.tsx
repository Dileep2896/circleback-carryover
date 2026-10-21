import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronDown, GitMerge, CalendarDays } from "lucide-react";
import type { Meeting, Verdict } from "@/lib/carryover/types";
import { VerdictBadge } from "./VerdictBadge";
import { shortDate } from "./MeetingTimeline";
export function ActionItemRow({
  verdict: v,
  meetings,
}: {
  verdict: Verdict;
  meetings: Meeting[];
}) {
  const reduced = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const ids = [...(v.matchedItem?.meetingIds ?? []), v.context.meetingId];
  return (
    <motion.article
      layout
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.25 }}
      className="action-row"
    >
      <div className="action-row-top">
        <span className={`item-symbol ${v.kind}`}>
          <GitMerge size={15} />
        </span>
        <div className="action-row-content">
          <button
            className="item-title"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
          >
            {v.item.title}
            <ChevronDown size={14} className={expanded ? "rotated" : ""} />
          </button>
          <div className="item-meta">
            <span
              className={`avatar small avatar-${v.item.assignee?.profileId}`}
            >
              {v.item.assignee?.name
                .split(" ")
                .map((n) => n[0])
                .join("") ?? "–"}
            </span>
            <span>{v.item.assignee?.name ?? "Unassigned"}</span>
            <span className="meta-dot">·</span>
            <CalendarDays size={12} />
            <span>
              {v.item.dueDate ? shortDate(v.item.dueDate) : "No due date"}
            </span>
            {v.matchedItem?.linearIssueId && (
              <span className="issue-link">
                ◩ {v.matchedItem.linearIssueId}
              </span>
            )}
          </div>
        </div>
        <VerdictBadge verdict={v} />
      </div>
      {v.changes.length > 0 && (
        <div className="changes">
          {v.changes.map((c) => (
            <span key={c.field}>
              {c.field === "assignee" ? "Owner" : "Due date"}:{" "}
              <s>{c.from ?? "None"}</s> <span aria-hidden>→</span>{" "}
              <strong>{c.to ?? "None"}</strong>
            </span>
          ))}
        </div>
      )}
      {expanded && (
        <div className="item-details">
          {v.item.description && (
            <p className="item-description">{v.item.description}</p>
          )}
          <p>
            {v.kind === "new"
              ? "No related commitment met the matching threshold."
              : `${Math.round(v.score * 100)}% match · ${v.reasons.join(" · ")}`}
          </p>
          <div className="mention-chips">
            <span>Mentioned in</span>
            {[...new Set(ids)].map((id) => (
              <span className="mention-chip" key={id}>
                {shortDate(
                  meetings.find((m) => m.id === id)?.date ?? v.context.date,
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.article>
  );
}
