import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { stagger } from "./motion";
export function Scene({
  children,
  id,
  className = "",
}: {
  children: ReactNode;
  id: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.section
      id={id}
      className={`story-scene ${className}`}
      initial={reduced ? false : "hidden"}
      animate={reduced ? "visible" : undefined}
      whileInView={reduced ? undefined : "visible"}
      viewport={{ amount: 0.35, once: true }}
      variants={
        reduced ? { visible: { transition: { staggerChildren: 0 } } } : stagger
      }
    >
      <div className="scene-content">{children}</div>
    </motion.section>
  );
}
