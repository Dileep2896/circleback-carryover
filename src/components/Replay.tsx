import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, X } from "lucide-react";
import type { Workspace } from "@/services/workspace";
export function Replay({
  workspace,
  onClose,
}: {
  workspace: Workspace;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = old;
      previous?.focus();
    };
  }, []);
  const reduced = useReducedMotion();
  const [merged, setMerged] = useState(!!reduced);
  useEffect(() => {
    const id = setTimeout(() => setMerged(true), reduced ? 0 : 1400);
    return () => clearTimeout(id);
  }, [reduced]);
  const rows = merged
    ? workspace.items
    : workspace.meetings.flatMap((m) => m.rawItems);
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="replay-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Meeting reconciliation replay"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="icon-button replay-close"
          onClick={onClose}
          aria-label="Close replay"
          ref={closeRef}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "Tab") {
              e.preventDefault();
              closeRef.current?.focus();
            }
          }}
        >
          <X size={20} />
        </button>
        <p className="eyebrow">FOUR MEETINGS. ONE SOURCE OF TRUTH.</p>
        <h2>
          {merged ? "Same promises. Less noise." : "Let’s connect the dots."}
        </h2>
        <div className="replay-count">
          <span>31</span>
          <ArrowRight size={28} />
          <motion.strong
            key={merged ? "19" : "31"}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
          >
            {merged ? workspace.items.length : 31}
          </motion.strong>
          {merged && <span className="badge carried_over">−39%</span>}
        </div>
        <div className="replay-grid">
          <AnimatePresence>
            {rows.map((i) => (
              <motion.div
                layout
                key={i.id}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: reduced ? 0 : 0.55 }}
              >
                <Check size={12} />
                {i.title}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <p className="muted" role="status">
          {merged
            ? "12 repeated commitments merged. Every meeting reference preserved."
            : "Replaying extracted commitments in chronological order…"}
        </p>
      </div>
    </div>
  );
}
