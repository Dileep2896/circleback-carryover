import { ChevronRight, CalendarDays } from "lucide-react";
import type { Meeting } from "@/lib/carryover/types";
export function shortDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
export function MeetingTimeline({
  meetings,
  selected,
  onSelect,
}: {
  meetings: Meeting[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="meeting-sidebar">
      <div className="sidebar-heading">
        <span>Meeting timeline</span>
        <span className="count">{meetings.length}</span>
      </div>
      <div className="timeline-range">
        <CalendarDays size={14} />
        Sep 23 – Oct 14, 2026
      </div>
      <div className="timeline-list">
        {meetings.map((m, index) => (
          <button
            key={m.id}
            className={`meeting-card ${selected === m.id ? "selected" : ""}`}
            onClick={() => onSelect(m.id)}
            aria-pressed={selected === m.id}
          >
            <span className="timeline-dot" />
            <span className="meeting-date">
              {shortDate(m.date)}{" "}
              <span>
                {index === meetings.length - 1 ? "Latest" : `${m.duration} min`}
              </span>
            </span>
            <strong>{m.title}</strong>
            <span className="meeting-card-bottom">
              <span>{m.rawItems.length} action items</span>
              <ChevronRight size={14} />
            </span>
            <span className="mini-avatars">
              {m.attendees.map((p) => (
                <span
                  key={p.profileId}
                  className={`avatar avatar-${p.profileId}`}
                  title={p.name}
                >
                  {p.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>
      <div className="timeline-note">
        <span className="status-dot" />
        All meetings processed
        <p>
          One continuous thread.
          <br />
          Every commitment accounted for.
        </p>
      </div>
    </aside>
  );
}
