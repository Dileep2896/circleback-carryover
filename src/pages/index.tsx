import { useState } from "react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  GitMerge,
  Layers,
  Play,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import type { Workspace } from "@/services/workspace";
import type { LinearPlan, Verdict } from "@/lib/carryover/types";
import { MeetingTimeline, shortDate } from "@/components/MeetingTimeline";
import { ActionItemRow } from "@/components/ActionItemRow";
import { StallRadar } from "@/components/StallRadar";
import { LinearSyncSheet } from "@/components/LinearSyncSheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Replay } from "@/components/Replay";
async function fetcher(url: string) {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data;
}
const groups: { kind: Verdict["kind"]; label: string; description: string }[] =
  [
    {
      kind: "updated",
      label: "Changes to review",
      description: "Same commitment. Something changed.",
    },
    {
      kind: "carried_over",
      label: "Carried over",
      description: "Already on your list. Now with more context.",
    },
    {
      kind: "new",
      label: "New commitments",
      description: "Fresh work, ready to move forward.",
    },
    {
      kind: "ignored_done",
      label: "Already completed",
      description: "No new work needed.",
    },
  ];
export default function Home({ initial }: { initial: Workspace }) {
  const {
    data: workspace = initial,
    mutate,
    error,
  } = useSWR<Workspace>("/api/meetings", fetcher, { fallbackData: initial });
  const [selected, setSelected] = useState("m3"),
    [filter, setFilter] = useState("all"),
    [query, setQuery] = useState(""),
    [sheet, setSheet] = useState(false),
    [replay, setReplay] = useState(false);
  const meeting = workspace.meetings.find((m) => m.id === selected)!;
  const { data: reconciled } = useSWR<{ verdicts: Verdict[] }>(
    `/api/meetings/${selected}/reconcile`,
    fetcher,
  );
  const verdicts = reconciled?.verdicts ?? workspace.byMeeting[selected];
  const { data: review, error: reviewError } = useSWR<{
    plan: LinearPlan;
    updateCount: number;
  }>(sheet ? `/api/meetings/${selected}/linear-plan` : null, fetcher);
  const visible = verdicts.filter(
    (v) =>
      (filter === "all" || v.kind === filter) &&
      v.item.title.toLowerCase().includes(query.toLowerCase()),
  );
  const counts = (kind: string) =>
    verdicts.filter((v) => v.kind === kind).length;
  function select(id: string) {
    setSelected(id);
    setFilter("all");
    setQuery("");
    setSheet(false);
  }
  async function confirm() {
    const res = await fetch(`/api/meetings/${selected}/linear-plan`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Sync failed");
    const result = await res.json();
    await mutate();
    return result;
  }
  return (
    <>
      <Head>
        <title>Carryover — Every commitment, connected.</title>
        <meta
          name="description"
          content="An independent project for AI meeting notes. Connect commitments across meetings, catch stalled promises, and keep Linear clean."
        />
      </Head>
      <div className="app-shell" inert={sheet || replay}>
        <nav className="app-nav">
          <Link href="/" className="brand">
            <span className="brand-mark">
              <GitMerge size={22} />
            </span>
            carryover<span className="concept-tag">DEMO</span>
          </Link>
          <div className="nav-center">
            <span className="workspace-avatar">A</span>Acme Robotics
            <ChevronDown size={13} />
          </div>
          <div className="nav-right">
            <Link href="/story" className="story-link">
              <Play size={13} />
              The story
              <ArrowUpRight size={13} />
            </Link>
            <ThemeToggle />
            <span className="avatar avatar-priya nav-avatar" title="Priya Shah">
              PS
            </span>
          </div>
        </nav>
        <header className="workspace-header">
          <div>
            <div className="breadcrumb">
              Workspace <span>/</span> Action items <span>/</span>{" "}
              <strong>Carryover</strong>
            </div>
            <h1>
              Every commitment, connected<span>.</span>
            </h1>
            <p>Your meetings move forward. Your action items should, too.</p>
          </div>
          <button
            className="button secondary replay-button"
            onClick={() => setReplay(true)}
          >
            <RotateCcw size={15} />
            Replay all meetings
          </button>
        </header>
        <section className="metrics-strip" aria-label="Workspace results">
          <div className="metric-intro">
            <span className="metric-symbol">
              <Layers size={20} />
            </span>
            <div>
              <strong>Less noise. More follow-through.</strong>
              <span>Across 4 meetings · Sep 23 – Oct 14</span>
            </div>
          </div>
          <div className="metric">
            <strong>
              {workspace.rawCount}
              <ArrowRight size={18} />
              {workspace.items.length}
            </strong>
            <span>unique commitments</span>
          </div>
          <div className="metric improvement">
            <strong>
              <ArrowDownRight size={22} />
              39%
            </strong>
            <span>fewer action items</span>
          </div>
          <div className="metric">
            <strong>
              {workspace.stalls.length}
              <span className="tiny-dot" />
            </strong>
            <span>stalled promises caught</span>
          </div>
          <span className="seed-label">DEMO DATA</span>
        </section>
        <main className="workbench">
          <MeetingTimeline
            meetings={workspace.meetings}
            selected={selected}
            onSelect={select}
          />
          <section className="commitments">
            <div className="meeting-detail-header">
              <div className="meeting-eyebrow">
                <span className="status-dot" />
                RECONCILED <span>·</span> {shortDate(meeting.date)}, 2026
              </div>
              <h2>{meeting.title}</h2>
              <div className="detail-subline">
                <span>
                  {meeting.attendees
                    .map((p) => p.name.split(" ")[0])
                    .join(", ")}
                </span>
                <span>·</span>
                <span>{meeting.duration} min</span>
                <span>·</span>
                <span>{verdicts.length} extracted items</span>
              </div>
              <div className="meeting-summary">
                <span className="summary-check">
                  <Check size={14} />
                </span>
                <p>
                  <strong>
                    {counts("carried_over") + counts("updated")} commitments
                    connected
                  </strong>{" "}
                  to earlier meetings. Nothing lost, nothing duplicated.
                </p>
              </div>
            </div>
            <div className="list-controls">
              <div
                className="filters"
                role="group"
                aria-label="Filter action items"
              >
                {[
                  ["all", "All", verdicts.length],
                  ["updated", "Changes", counts("updated")],
                  ["carried_over", "Carried over", counts("carried_over")],
                  ["new", "New", counts("new")],
                ].map(([key, label, count]) => (
                  <button
                    key={key}
                    className={filter === key ? "active" : ""}
                    onClick={() => setFilter(String(key))}
                    aria-pressed={filter === key}
                  >
                    {label}
                    <span>{count}</span>
                  </button>
                ))}
              </div>
              <label className="search-box">
                <Search size={15} />
                <input
                  aria-label="Search commitments"
                  placeholder="Find an item…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
            </div>
            {error && (
              <p role="alert" className="error-text">
                Could not refresh. Showing the last loaded workspace.
              </p>
            )}
            <div className="action-groups">
              <AnimatePresence mode="popLayout">
                {groups.map((group) => {
                  const rows = visible.filter((v) => v.kind === group.kind);
                  return rows.length ? (
                    <motion.section
                      layout
                      key={`${selected}-${group.kind}`}
                      className="action-group"
                    >
                      <div className="group-heading">
                        <h3>
                          {group.label}
                          <span>{rows.length}</span>
                        </h3>
                        <p>{group.description}</p>
                      </div>
                      {rows.map((v) => (
                        <ActionItemRow
                          key={v.item.id}
                          verdict={v}
                          meetings={workspace.meetings}
                        />
                      ))}
                    </motion.section>
                  ) : null;
                })}
              </AnimatePresence>
              {!visible.length && (
                <div className="empty-state">
                  <Search size={24} />
                  <h3>No matching commitments</h3>
                  <p>Try another search or show all items.</p>
                  <button
                    className="button secondary"
                    onClick={() => {
                      setQuery("");
                      setFilter("all");
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
            <div className="sync-bar">
              <div>
                <span className="linear-icon small-linear">◩</span>
                <span>
                  Good context in.
                  <br />
                  <strong>Clean Linear out.</strong>
                </span>
              </div>
              <button className="button primary" onClick={() => setSheet(true)}>
                Review Linear sync
                <ArrowUpRight size={16} />
              </button>
            </div>
          </section>
          <StallRadar
            items={workspace.stalls}
            now={workspace.now}
            onSelect={select}
          />
        </main>
        <footer className="app-footer">
          <span>Carryover: an independent project for AI meeting notes</span>
          <span>
            Built with Codex, verified by Claude Code <span>·</span> All data is
            fictional
          </span>
        </footer>
      </div>
      <AnimatePresence>
        {sheet && review && (
          <LinearSyncSheet
            key={selected}
            plan={review.plan}
            updateCount={review.updateCount}
            onConfirm={confirm}
            onClose={() => setSheet(false)}
          />
        )}
      </AnimatePresence>
      {sheet && !review && (
        <div className="sheet-backdrop">
          <div className="loading-sheet" role="status">
            <button
              className="icon-button"
              aria-label="Close review"
              onClick={() => setSheet(false)}
            >
              <X size={18} />
            </button>
            {reviewError
              ? "Could not load the plan. Close and retry."
              : "Preparing your sync review…"}
          </div>
        </div>
      )}
      {replay && (
        <Replay workspace={workspace} onClose={() => setReplay(false)} />
      )}
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async () => {
  const { loadWorkspace } = await import("@/services/workspace");
  return { props: { initial: await loadWorkspace() } };
};
