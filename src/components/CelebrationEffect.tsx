"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const COLORS = ["#fbbf24", "#f472b6", "#a855f7", "#38bdf8", "#4ade80", "#fb7185"];

function ConfettiPiece({ index }: { index: number }) {
  const left = `${(index * 7.3) % 100}%`;
  const color = COLORS[index % COLORS.length];
  const delay = (index % 20) * 0.1;
  const duration = 2.5 + (index % 5) * 0.4;
  const size = 6 + (index % 4) * 2;

  return (
    <motion.div
      className="absolute rounded-sm pointer-events-none"
      style={{
        left,
        top: -20,
        width: size,
        height: size * 1.4,
        backgroundColor: color,
      }}
      initial={{ y: -20, rotate: 0, opacity: 1 }}
      animate={{
        y: "110vh",
        rotate: 360 + index * 30,
        opacity: [1, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

export function CelebrationEffect() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      {Array.from({ length: 50 }).map((_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <span className="text-8xl">✨</span>
      </motion.div>
    </div>
  );
}
