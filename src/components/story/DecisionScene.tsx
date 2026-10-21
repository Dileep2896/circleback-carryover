import { motion, useReducedMotion } from "motion/react";
import { Check, GitMerge, Quote } from "lucide-react";
import { Scene } from "./Scene";
import { entrance } from "./motion";
export function DecisionScene() {
  const reduced = useReducedMotion();
  return (
    <Scene id="scene-2">
      <motion.h2 variants={entrance}>
        Protect the part
        <br />
        people count on.
      </motion.h2>
      <motion.p variants={entrance} className="story-lede">
        Two opportunities. One that protects the core promise of an AI
        note-taker: nothing falls through the cracks.
      </motion.p>
      <div className="decision-options">
        <motion.div className="decision-card passed" variants={entrance}>
          <Quote size={28} />
          <h3>Inline citations</h3>
          <p>Many tools in this space already ship answer sources and transcript search.</p>
          <span>Strong idea. Already in motion.</span>
        </motion.div>
        <motion.div
          className="decision-card chosen"
          initial={reduced ? false : { y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 25 }}
        >
          <div className="chosen-label">
            <GitMerge size={28} />
            <span>THE OPPORTUNITY</span>
          </div>
          <h3>Carryover</h3>
          <p>One commitment. Every conversation it came from.</p>
          <ul>
            {[
              "Builds on a meetingIds[] model meeting APIs already use",
              "Protects the action-item list people rely on",
              "Today it is manual: re-read last week’s notes",
            ].map((text, i) => (
              <motion.li
                key={text}
                initial={reduced ? false : { opacity: 0, x: 8 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: reduced ? 0 : 0.4 + i * 0.35 }}
              >
                <Check size={15} />
                <motion.span
                  initial={reduced ? false : { clipPath: "inset(0 100% 0 0)" }}
                  whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                  transition={{
                    delay: reduced ? 0 : 0.5 + i * 0.35,
                    duration: reduced ? 0 : 0.6,
                    ease: "linear",
                  }}
                >
                  {text}
                </motion.span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
      <p className="story-footnote">
        Users of popular note-takers report AI action items “clogging up” their
        lists with duplicates. Carryover is built to fix exactly that.
      </p>
    </Scene>
  );
}
