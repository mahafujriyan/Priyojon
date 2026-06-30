"use client";

import { motion } from "framer-motion";

type Props = {
  emojis: string[];
};

export function ThemeEmojiOverlay({ emojis }: Props) {
  if (emojis.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[6] overflow-hidden">
      {emojis.flatMap((emoji, emojiIndex) =>
        Array.from({ length: 3 }).map((_, i) => {
          const index = emojiIndex * 3 + i;
          return (
            <motion.span
              key={`${emoji}-${index}`}
              className="absolute text-2xl sm:text-4xl opacity-70 select-none"
              style={{
                left: `${(index * 17 + 5) % 90}%`,
                top: `${(index * 23 + 8) % 75}%`,
              }}
              animate={{
                y: [0, -18, 0],
                rotate: [0, 12, -8, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 4 + (index % 3),
                repeat: Infinity,
                delay: index * 0.4,
                ease: "easeInOut",
              }}
            >
              {emoji}
            </motion.span>
          );
        }),
      )}
    </div>
  );
}
