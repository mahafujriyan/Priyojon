"use client";

import { motion } from "framer-motion";

const HEARTS = ["💕", "💖", "💗", "✨", "🌸", "💝", "🩷"];

function FloatingItem({ index, emoji }: { index: number; emoji: string }) {
  const left = `${(index * 13.7) % 100}%`;
  const duration = 6 + (index % 4) * 1.5;
  const delay = (index % 8) * 0.6;
  const size = 14 + (index % 3) * 6;

  return (
    <motion.span
      className="absolute pointer-events-none select-none"
      style={{ left, bottom: -20, fontSize: size }}
      initial={{ y: 0, opacity: 0, rotate: 0 }}
      animate={{
        y: "-110vh",
        opacity: [0, 0.85, 0.85, 0],
        rotate: [0, 15, -10, 20],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {emoji}
    </motion.span>
  );
}

type Props = {
  variant?: "hearts" | "sparkle" | "petals";
};

export function ThemeParticles({ variant = "hearts" }: Props) {
  const items =
    variant === "petals"
      ? ["🌸", "🌺", "🩷", "✿", "💮", "🌷", "🪷"]
      : variant === "sparkle"
        ? ["✨", "⭐", "💫", "🌟", "✦", "☆", "✧"]
        : HEARTS;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[5]">
      {Array.from({ length: 18 }).map((_, i) => (
        <FloatingItem
          key={i}
          index={i}
          emoji={items[i % items.length]}
        />
      ))}
    </div>
  );
}
