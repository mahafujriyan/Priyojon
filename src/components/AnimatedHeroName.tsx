"use client";

import { motion } from "framer-motion";
import type { RelationType } from "@/generated/prisma";

type Props = {
  name: string;
  relationType: RelationType;
  subtitle?: string;
};

const SPARKLES = ["✦", "♥", "✨", "♡", "❀"];

export function AnimatedHeroName({ name, relationType, subtitle }: Props) {
  const isRomantic =
    relationType === "GIRLFRIEND_BOYFRIEND" || relationType === "CRUSH";

  return (
    <div className="relative inline-block max-w-full px-2">
      {isRomantic &&
        SPARKLES.map((s, i) => (
          <motion.span
            key={i}
            className="absolute text-sm sm:text-base pointer-events-none select-none opacity-80"
            style={{
              top: `${-8 + (i % 3) * 12}px`,
              left: `${i * 18 - 10}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.4, 1, 0.4],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 2.5 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          >
            {s}
          </motion.span>
        ))}

      <motion.h1
        className="relative text-3xl sm:text-5xl md:text-6xl font-bold leading-tight text-balance"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.span
          className={
            isRomantic
              ? "inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-rose-200 to-amber-100"
              : "inline-block text-white drop-shadow-lg"
          }
          animate={
            isRomantic
              ? { backgroundPosition: ["0% center", "200% center", "0% center"] }
              : { scale: [1, 1.02, 1] }
          }
          transition={
            isRomantic
              ? { duration: 4, repeat: Infinity, ease: "linear" }
              : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
          style={
            isRomantic
              ? { backgroundSize: "200% auto" }
              : undefined
          }
        >
          {name}
        </motion.span>
      </motion.h1>

      {subtitle && (
        <motion.p
          className="mt-2 text-sm sm:text-lg opacity-95 drop-shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {subtitle}
        </motion.p>
      )}

      <motion.div
        className="mx-auto mt-3 h-0.5 rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "min(120px, 40%)", opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
    </div>
  );
}
