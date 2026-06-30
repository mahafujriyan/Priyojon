"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

type Sparkle = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
};

type RisingDot = {
  id: number;
  x: number;
  delay: number;
  emoji?: string;
};

type Props = {
  emojis: string[];
  fullScreen?: boolean;
};

export function WelcomeSparkles({ emojis, fullScreen = false }: Props) {
  const sparkles = useMemo<Sparkle[]>(
    () =>
      Array.from({ length: 32 }, (_, id) => ({
        id,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 5,
        delay: Math.random() * 2.5,
        duration: 2 + Math.random() * 2,
      })),
    [],
  );

  const rising = useMemo<RisingDot[]>(
    () =>
      Array.from({ length: 14 }, (_, id) => ({
        id,
        x: 5 + Math.random() * 90,
        delay: Math.random() * 3,
        emoji: id % 3 === 0 ? emojis[id % emojis.length] : undefined,
      })),
    [emojis],
  );

  const containerClass = fullScreen
    ? "fixed inset-0 z-[85] pointer-events-none overflow-hidden"
    : "absolute inset-0 overflow-hidden pointer-events-none";

  return (
    <div className={containerClass} aria-hidden>
      {sparkles.map((s) => (
        <motion.span
          key={`sparkle-${s.id}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            boxShadow: "0 0 8px 2px rgba(255,255,255,0.8)",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0.4, 1, 0],
            scale: [0, 1.2, 0.8, 1.4, 0],
          }}
          transition={{
            delay: s.delay,
            duration: s.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {rising.map((r) => (
        <motion.span
          key={`rise-${r.id}`}
          className="absolute bottom-0 text-lg sm:text-xl select-none"
          style={{ left: `${r.x}%` }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 0.9, 0.9, 0],
            y: [0, -120, -280, -420],
            x: [0, (r.id % 2 === 0 ? 1 : -1) * 20, 0],
          }}
          transition={{
            delay: r.delay,
            duration: 5 + (r.id % 3),
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          {r.emoji ?? "✨"}
        </motion.span>
      ))}

      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] rounded-full border border-white/10"
        animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full border border-pink-300/20"
        animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </div>
  );
}
