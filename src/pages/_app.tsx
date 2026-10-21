import type { AppProps } from "next/app";
import { Instrument_Sans } from "next/font/google";
import { MotionConfig, useReducedMotion } from "motion/react";
import "@/styles/globals.css";
const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
export default function App({ Component, pageProps }: AppProps) {
  const reduced = useReducedMotion();
  return (
    <div className={sans.variable}>
      <MotionConfig
        reducedMotion="user"
        transition={reduced ? { duration: 0 } : undefined}
      >
        <Component {...pageProps} />
      </MotionConfig>
    </div>
  );
}
