import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { ArrowRight, GitMerge, Radio } from "lucide-react";
import { Scene } from "./Scene";
import { entrance } from "./motion";
import { DiagramRows } from "./DiagramRows";
export function BeforeAfterDiagram() {
  const ref = useRef<HTMLDivElement>(null),
    inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [merged, setMerged] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => setMerged(true), reduced ? 0 : 1200);
    return () => clearTimeout(timer);
  }, [inView, reduced]);
  return (
    <Scene id="scene-3" className="diagram-scene">
      <motion.h2 variants={entrance}>
        Keep the context.
        <br />
        <span className="brand-text">Lose the duplicates.</span>
      </motion.h2>
      <motion.p variants={entrance} className="story-lede">
        Match related meetings. Merge restatements. Flag what changed.
      </motion.p>
      <LayoutGroup id="story-merge">
        <div className="before-after" ref={ref}>
          <div className="diagram-side before">
            <div className="diagram-label">
              <span>BEFORE</span>
              <strong>31 scattered items</strong>
            </div>
            <div className="mini-rows">
              {!merged ? (
                <DiagramRows merged={false} />
              ) : (
                <motion.div
                  className="empty-diagram"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <GitMerge size={42} />
                  <span>
                    12 repeated items
                    <br />
                    connected to the originals.
                  </span>
                </motion.div>
              )}
            </div>
            <div className="diagram-linear">
              Linear: duplicate issues pile up
            </div>
          </div>
          <span className="diagram-bridge">
            <ArrowRight size={25} />
          </span>
          <div className="diagram-side after">
            <div className="diagram-label">
              <span>WITH CARRYOVER</span>
              <strong>
                {merged ? "19 clear commitments" : "Connecting the dots…"}
              </strong>
            </div>
            <div className="mini-rows">
              <AnimatePresence>
                {merged && <DiagramRows merged />}
              </AnimatePresence>
            </div>
            <div className="diagram-linear clean">
              Linear: 3 new · 2 tracked
            </div>
          </div>
        </div>
      </LayoutGroup>
      <motion.div
        className="diagram-radar"
        animate={
          merged && !reduced ? { opacity: [0.55, 1, 0.55, 1] } : { opacity: 1 }
        }
        transition={{ duration: reduced ? 0 : 1.4 }}
      >
        <Radio size={18} />
        <strong>Stall radar</strong>
        <span>Pricing deck · SOC 2 report</span>
        <span className="badge updated">2 promises need a follow-up</span>
      </motion.div>
    </Scene>
  );
}
