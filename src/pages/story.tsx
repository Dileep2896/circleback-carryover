import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, GitMerge, Pause, Play } from "lucide-react";
import { Hero } from "@/components/story/Hero";
import { PainScene } from "@/components/story/PainScene";
import { DecisionScene } from "@/components/story/DecisionScene";
import { BeforeAfterDiagram } from "@/components/story/BeforeAfterDiagram";
import { ImpactCounter } from "@/components/story/ImpactCounter";
import { ThemeToggle } from "@/components/ThemeToggle";
const scenes = [
  Hero,
  PainScene,
  DecisionScene,
  BeforeAfterDiagram,
  ImpactCounter,
];
const labels = [
  "The domain",
  "The problem",
  "The opportunity",
  "The feature",
  "The impact",
];
export default function Story() {
  const router = useRouter(),
    reduced = useReducedMotion();
  const autoplay = router.query.autoplay === "1";
  const [active, setActive] = useState(0),
    [paused, setPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!autoplay || paused || reduced || active === 4) return;
    const timer = setTimeout(() => setActive((a) => a + 1), 4000);
    return () => clearTimeout(timer);
  }, [autoplay, paused, reduced, active]);
  useEffect(() => {
    if (autoplay) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting)
            setActive(Number(entry.target.id.split("-")[1]));
      },
      { root: scrollRef.current, threshold: 0.55 },
    );
    scrollRef.current
      ?.querySelectorAll(".story-scene")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [autoplay]);
  function go(index: number) {
    const next = Math.max(0, Math.min(4, index));
    if (autoplay) setActive(next);
    else
      document.getElementById(`scene-${next}`)?.scrollIntoView({
        behavior: reduced ? "instant" : "smooth",
        block: "start",
      });
  }
  const Current = scenes[active];
  return (
    <>
      <Head>
        <title>The story of Carryover</title>
        <meta
          name="description"
          content="From repeated promises to connected commitments. The story behind Carryover."
        />
      </Head>
      <div className="story-shell">
        <header className="story-nav">
          <Link href="/" className="brand">
            <span className="brand-mark">
              <GitMerge size={23} />
            </span>
            carryover
          </Link>
          <span className="story-nav-caption">
            A little less noise. A lot more clarity.
          </span>
          <div>
            <ThemeToggle />
            <Link href="/" className="story-link">
              Open the app
              <ArrowRight size={14} />
            </Link>
          </div>
        </header>
        <main
          ref={scrollRef}
          className={`story-scroll-container ${autoplay ? "autoplay" : ""}`}
          aria-label="Carryover story"
        >
          {autoplay ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.2 }}
              >
                <Current />
              </motion.div>
            </AnimatePresence>
          ) : (
            scenes.map((Component, index) => <Component key={index} />)
          )}
        </main>
        <nav className="story-controls" aria-label="Story controls">
          <div className="story-progress">
            {labels.map((label, i) => (
              <button
                key={label}
                aria-label={`Scene ${i + 1}: ${label}`}
                aria-current={i === active ? "step" : undefined}
                onClick={() => go(i)}
                className={i === active ? "current" : ""}
              >
                <span />
                {i === active && (
                  <span className="scene-label">
                    {String(i + 1).padStart(2, "0")} — {label}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="story-controls-right">
            {autoplay && (
              <button
                className="icon-button"
                onClick={() => setPaused(!paused)}
                aria-label={paused ? "Play story" : "Pause story"}
              >
                {paused ? <Play size={15} /> : <Pause size={15} />}
              </button>
            )}
            <button
              className="icon-button"
              disabled={active === 0}
              onClick={() => go(active - 1)}
              aria-label="Previous scene"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              className="icon-button"
              disabled={active === 4}
              onClick={() => go(active + 1)}
              aria-label="Next scene"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
