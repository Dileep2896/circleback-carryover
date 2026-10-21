import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, CalendarDays, Copy } from "lucide-react";
import { Scene } from "./Scene";
import { entrance } from "./motion";
const dates = ["Sep 23", "Sep 30", "Oct 7", "Oct 14"];
export function PainScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setStep(3);
      return;
    }
    const interval = setInterval(() => setStep((s) => Math.min(3, s + 1)), 650);
    return () => clearInterval(interval);
  }, [inView, reduced]);
  return (
    <Scene id="scene-1" className="pain-scene">
      <motion.h2 variants={entrance}>
        Different meeting.
        <br />
        <span className="brand-text">Same promise.</span>
      </motion.h2>
      <motion.p className="story-lede" variants={entrance}>
        Recurring meetings re-capture the same promise.
        <br />
        Every restatement becomes another task to track.
      </motion.p>
      <div className="pain-demo" ref={ref}>
        <div className="pain-meetings">
          {dates.map((date, i) => (
            <motion.div
              className="pain-meeting"
              key={date}
              initial={reduced ? false : { opacity: 0, x: -20 }}
              animate={
                i <= step ? { opacity: 1, x: 0 } : { opacity: 0.2, x: 0 }
              }
            >
              <div>
                <CalendarDays size={15} />
                <span>{date}</span>
              </div>
              <strong>
                {i % 2 ? "Product standup" : "Initech weekly sync"}
              </strong>
              <motion.div
                className="duplicate-task"
                animate={
                  !reduced && i === step
                    ? { rotate: [0, -1, 1, 0] }
                    : { rotate: 0 }
                }
              >
                <Copy size={13} />
                Send pricing deck
              </motion.div>
            </motion.div>
          ))}
        </div>
        <ArrowRight className="pain-arrow" size={26} />
        <div className="pain-linear">
          <span className="story-small-label">LINEAR</span>
          {dates.slice(0, step + 1).map((d, i) => (
            <motion.div
              key={d}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span>ENG-{142 + i}</span>Send pricing deck
            </motion.div>
          ))}
          <span className="duplicate-warning">One promise. Four issues.</span>
        </div>
      </div>
      <div className="pain-tally">
        <strong>{[9, 16, 24, 31][step]}</strong>
        <span>
          extracted action items.
          <br />
          And a growing list of déjà vu.
        </span>
      </div>
    </Scene>
  );
}
