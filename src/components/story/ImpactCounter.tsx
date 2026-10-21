import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { Scene } from "./Scene";
import { entrance } from "./motion";
export function ImpactCounter() {
  const ref = useRef<HTMLDivElement>(null),
    inView = useInView(ref, { once: true }),
    reduced = useReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(39);
      return;
    }
    const controls = animate(0, 39, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced]);
  return (
    <Scene id="scene-4" className="impact-scene">
      <motion.h2 variants={entrance}>
        Fewer tasks.
        <br />
        More follow-through.
      </motion.h2>
      <div className="impact-metrics" ref={ref}>
        <div className="impact-main">
          <span className="impact-value">
            −{value}
            <span>%</span>
          </span>
          <strong>fewer action items</strong>
          <p>31 extracted → 19 unique commitments</p>
        </div>
        <motion.div variants={entrance} className="impact-secondary">
          <div>
            <strong>0</strong>
            <span>duplicate Linear issues</span>
          </div>
          <div>
            <strong>2</strong>
            <span>stalled promises caught</span>
          </div>
        </motion.div>
      </div>
      <p className="impact-note">
        Measured on the fictional demo dataset. Every meeting reference
        preserved.
      </p>
      <motion.div variants={entrance} className="story-ctas">
        <Link href="/" className="button primary">
          Try the feature
          <ArrowUpRight size={17} />
        </Link>
        <a
          href="https://github.com/Dileep2896/meeting-carryover"
          target="_blank"
          rel="noreferrer"
          className="button secondary"
        >
          <Github size={16} />
          Source on GitHub
          <ArrowUpRight size={14} />
        </a>
      </motion.div>
      <footer className="story-credit">
        Built with Codex, verified by Claude Code.
        <br />
        An independent open-source project. All data is fictional.
      </footer>
    </Scene>
  );
}
