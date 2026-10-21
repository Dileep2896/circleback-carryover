import { Radio, ArrowUpRight } from "lucide-react";
import type { ActionItem } from "@/lib/carryover/types";
import { DAY_MS } from "@/lib/carryover/constants";
export function StallRadar({
  items,
  now,
  onSelect,
}: {
  items: ActionItem[];
  now: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="radar-panel">
      <div className="radar-heading">
        <Radio size={18} />
        <h2>Stall radar</h2>
        <span className="radar-count">{items.length}</span>
      </div>
      <p className="radar-intro">
        Still coming up.
        <br />
        Still not done.
      </p>
      {items.length === 0 ? (
        <p className="muted">No stalled commitments.</p>
      ) : (
        items.map((item) => (
          <div className="stall-item" key={item.id}>
            <span className="stalled-label">
              <span />
              Needs a follow-up
            </span>
            <h3>{item.title}</h3>
            <div className="stall-person">
              <span
                className={`avatar small avatar-${item.assignee?.profileId}`}
              >
                {item.assignee?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              {item.assignee?.name}
            </div>
            <div className="stall-stats">
              <span>
                <strong>{item.mentionCount}</strong> mentions
              </span>
              <span>
                <strong>
                  {Math.floor(
                    (Date.parse(now) - Date.parse(item.firstMentionedAt)) /
                      DAY_MS,
                  )}
                </strong>{" "}
                days open
              </span>
            </div>
            <button
              className="text-button"
              onClick={() =>
                onSelect(item.meetingIds[item.meetingIds.length - 1])
              }
            >
              View latest mention
              <ArrowUpRight size={14} />
            </button>
          </div>
        ))
      )}
      <div className="radar-rule">
        Pending for 14+ days.
        <br />
        Mentioned in 3+ meetings.
        <br />
        <span>That’s a pattern worth noticing.</span>
      </div>
    </aside>
  );
}
