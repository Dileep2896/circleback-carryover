import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, Check, GitMerge } from "lucide-react";
import { Scene } from "./Scene";
import { entrance, stagger } from "./motion";
export function Hero() {
  const reduced = useReducedMotion();
  return (
    <Scene id="scene-0" className="hero-scene">
      <div className="story-kicker">AN INDEPENDENT PROJECT · AI MEETING NOTES</div>
      <motion.h1 variants={stagger} className="story-title">
        {"Great meetings deserve".split(" ").map((word) => (
          <motion.span variants={entrance} key={word}>
            {word}{" "}
          </motion.span>
        ))}
        <span className="underlined">
          <motion.span variants={entrance}>follow-through.</motion.span>
          <svg viewBox="0 0 600 20" aria-hidden>
            <motion.path
              d="M4 14 Q280 0 596 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              initial={{ pathLength: reduced ? 1 : 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            />
          </svg>
        </span>
      </motion.h1>
      <motion.p variants={entrance} className="story-lede">
        AI note-takers turn every conversation into notes and action items.
        But recurring meetings restate the same promise every week. Carryover
        connects what happens next.
      </motion.p>
      <motion.div variants={entrance} className="story-chips">
        <span>Recurring 1:1s and syncs</span>
        <span>Duplicate action items</span>
        <span>Stalled promises</span>
      </motion.div>
      <motion.div variants={entrance} className="hero-thread">
        <span className="thread-node">
          <span className="thread-dot" />A conversation
        </span>
        <span className="thread-line" />
        <span className="thread-node">
          <Check size={16} />A commitment
        </span>
        <span className="thread-line brand-line" />
        <span className="thread-node accent-node">
          <GitMerge size={18} />A continuous thread
        </span>
      </motion.div>
      <div className="story-scroll">
        <ArrowDown size={14} />
        The story of Carryover
      </div>
    </Scene>
  );
}
