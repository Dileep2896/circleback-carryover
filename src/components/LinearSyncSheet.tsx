import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, X, ArrowUpRight, ShieldCheck } from "lucide-react";
import type { LinearPlan } from "@/lib/carryover/types";
export function LinearSyncSheet({
  plan,
  updateCount,
  onConfirm,
  onClose,
}: {
  plan: LinearPlan;
  updateCount: number;
  onConfirm: () => Promise<{ issues: string[]; commented: number }>;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [result, setResult] = useState<{
      issues: string[];
      commented: number;
    } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    ref.current?.focus();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
      previous?.focus();
    };
  }, []);
  async function confirm() {
    if (busy || result) return;
    setBusy(true);
    setError("");
    try {
      setResult(await onConfirm());
    } catch {
      setError("Sync could not finish. Your plan is safe to retry.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div
      className="sheet-backdrop"
      onClick={() => {
        if (!busy) onClose();
      }}
    >
      <motion.div
        initial={reduced ? false : { x: 40, opacity: 0 }}
        transition={{ duration: reduced ? 0 : 0.25 }}
        animate={{ x: 0, opacity: 1 }}
        className="sync-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sync-title"
        tabIndex={-1}
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape" && !busy) onClose();
          if (e.key === "Tab") {
            const nodes = ref.current?.querySelectorAll<HTMLElement>(
              "button:not(:disabled),a[href]",
            );
            if (!nodes?.length) return;
            const first = nodes[0],
              last = nodes[nodes.length - 1];
            if (
              e.shiftKey &&
              (document.activeElement === first ||
                document.activeElement === ref.current)
            ) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }}
      >
        <header className="sheet-header">
          <span className="linear-icon">◩</span>
          <button
            className="icon-button"
            aria-label="Close sync review"
            onClick={onClose}
            disabled={busy}
          >
            <X size={20} />
          </button>
        </header>
        <h2 id="sync-title">
          {result ? "Sync complete" : "A cleaner Linear starts here."}
        </h2>
        <p className="sheet-description">
          {result
            ? "Every new commitment is tracked. Existing issues kept their history."
            : "Review what goes to Linear before anything is created."}
        </p>
        <div className="sync-counts">
          {plan.create.length} new · {plan.comment.length} already tracked ·{" "}
          {updateCount} update{updateCount === 1 ? "" : "s"}
        </div>
        {result ? (
          <div role="status" className="sync-success">
            <Check size={28} />
            <strong>
              {result.issues.length} issues ready · {result.commented} comments
              added
            </strong>
            <p>{result.issues.join(" · ")}</p>
          </div>
        ) : (
          <>
            <h3 className="sheet-subheading">CREATE NEW ISSUES</h3>
            {plan.create.map((v) => (
              <div className="sync-item" key={v.item.id}>
                <span className="badge new">New</span>
                <span>{v.item.title}</span>
              </div>
            ))}
            {!plan.create.length && (
              <p className="muted">No new issues needed.</p>
            )}
            <h3 className="sheet-subheading">ADD CONTEXT TO EXISTING ISSUES</h3>
            {plan.comment.map((v) => (
              <div className="sync-item" key={v.item.id}>
                <span className="issue-link">
                  {v.matchedItem?.linearIssueId}
                </span>
                <span>{v.item.title}</span>
              </div>
            ))}
          </>
        )}
        <div className="sync-guarantee">
          <ShieldCheck size={18} />
          <span>
            Only new work creates issues.
            <br />
            Restated commitments add context.
          </span>
        </div>
        <p className="demo-disclosure">
          Demo mode · Changes stay in the local mock Linear.
        </p>
        {error && (
          <p role="alert" className="error-text">
            {error}
          </p>
        )}
        <button
          className="button primary full-width"
          onClick={result ? onClose : confirm}
          disabled={busy}
        >
          {result ? "Back to commitments" : busy ? "Syncing…" : "Confirm sync"}
          {!busy && <ArrowUpRight size={16} />}
        </button>
      </motion.div>
    </div>
  );
}
