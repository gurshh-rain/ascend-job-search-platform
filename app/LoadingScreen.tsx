"use client";

import { useEffect, useState } from "react";
import { ASCEND_LOGO_ASCII } from "./ascend-ascii";

export default function LoadingScreen() {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit" | "done">(
    "enter",
  );

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("hold"), 50),
      setTimeout(() => setPhase("exit"), 1300),
      setTimeout(() => setPhase("done"), 1900),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  if (phase === "done") {
    return null;
  }

  const isEnter = phase === "enter";
  const isExit = phase === "exit";
  const ease = "cubic-bezier(0.4, 0, 0.2, 1)";
  const outEase = "cubic-bezier(0.4, 0, 1, 1)";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      style={{
        opacity: isExit ? 0 : 1,
        transform: isExit ? "scale(1.02)" : "scale(1)",
        transition: `all 600ms ${outEase}`,
      }}
    >
      <div
        className="absolute inset-3 rounded-[2rem] border border-zinc-800 bg-black sm:inset-4 md:inset-6"
        style={{
          opacity: isExit ? 0 : 1,
          transform: isEnter
            ? "scale(0.85)"
            : isExit
              ? "scale(1.03)"
              : "scale(1)",
          transition: `all 800ms ${ease}`,
        }}
      />

      <div
        className="relative z-10 flex flex-col items-center justify-center gap-4 text-center"
        style={{
          opacity: isEnter ? 0 : isExit ? 0 : 1,
          transform: isEnter
            ? "translateY(1.5rem) scale(0.92)"
            : isExit
              ? "translateY(-0.5rem) scale(0.98)"
              : "none",
          transition: `all 800ms ${ease} ${isEnter ? "150ms" : "0ms"}`,
        }}
      >
        <pre
          className="pointer-events-none select-none font-mono whitespace-pre leading-none text-white/40 drop-shadow-lg"
          style={{ fontSize: "min(0.4vw, 0.4vh)" }}
          aria-hidden="true"
        >
          {ASCEND_LOGO_ASCII}
        </pre>
        <span className="text-lg font-semibold uppercase tracking-[0.12em] text-white sm:text-xl">
          Ascend
        </span>
      </div>
    </div>
  );
}
