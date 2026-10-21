import { motion, useReducedMotion } from "motion/react";
const beforeTitles = [
  "Send pricing deck",
  "Share SOC 2 report",
  "Scope SSO requirement",
  "Follow up on commitment",
];
const afterTitles = [
  "Pricing deck",
  "SOC 2 report",
  "SSO requirement",
  "CSV export timeout",
];
export function DiagramRows({ merged }: { merged: boolean }) {
  const reduced = useReducedMotion();
  return (
    <>
      {Array.from({ length: merged ? 19 : 31 }, (_, i) => (
        <motion.div
          key={i}
          layoutId={`row-${i}`}
          className={!merged && i >= 19 ? "duplicate-mini" : ""}
          transition={{
            duration: reduced ? 0 : 0.7,
            type: "spring",
            bounce: 0,
          }}
          animate={
            merged && i < 2 && !reduced
              ? { opacity: [1, 0.55, 1] }
              : { opacity: 1 }
          }
        >
          <span />
          {merged
            ? (afterTitles[i] ?? "A distinct commitment")
            : beforeTitles[i % 4]}
          {merged &&
            (i < 2 ? (
              <em>Carried over ×3</em>
            ) : i === 2 ? (
              <em className="changed">Owner changed</em>
            ) : i === 3 ? (
              <em className="changed">Due moved</em>
            ) : null)}
        </motion.div>
      ))}
    </>
  );
}
