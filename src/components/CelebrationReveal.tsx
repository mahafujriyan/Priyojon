"use client";

import { useEffect } from "react";

type Props = {
  active: boolean;
  personName: string;
};

export function CelebrationReveal({ active, personName }: Props) {
  useEffect(() => {
    if (!active || typeof document === "undefined") return;

    const root = document.documentElement;
    if (document.fullscreenElement) return;

    root.requestFullscreen?.().catch(() => {
      /* user gesture / browser policy */
    });
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-purple-600/20 to-amber-400/20 animate-pulse" />
    </div>
  );
}
