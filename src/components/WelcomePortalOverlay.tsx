"use client";

import { useLayoutEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EventType } from "@/generated/prisma/client";
import { EVENT_OVERLAY_EMOJIS } from "@/lib/events";
import { WelcomeSparkles } from "@/components/WelcomeSparkles";

type Props = {
  personName: string;
  message: string;
  eventType: EventType;
};

function FloatingEmoji({
  emoji,
  delay,
  x,
  y,
  size = "text-2xl sm:text-3xl",
}: {
  emoji: string;
  delay: number;
  x: string;
  y: string;
  size?: string;
}) {
  return (
    <motion.span
      className={`absolute ${size} pointer-events-none select-none`}
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0, rotate: -30 }}
      animate={{
        opacity: [0.4, 0.85, 0.4],
        scale: [0.75, 1.15, 0.75],
        y: [0, -18, 0],
        rotate: [-8, 8, -8],
      }}
      transition={{
        delay,
        duration: 3.5 + delay * 0.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {emoji}
    </motion.span>
  );
}

function ShimmerText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"
        initial={{ x: "-120%" }}
        animate={{ x: "220%" }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          repeatDelay: 1.2,
          ease: "easeInOut",
        }}
        style={{ mixBlendMode: "overlay" }}
      />
    </span>
  );
}

export function WelcomePortalOverlay({
  personName,
  message,
  eventType,
}: Props) {
  const [visible, setVisible] = useState(false);
  const emojis = EVENT_OVERLAY_EMOJIS[eventType];

  useLayoutEffect(() => {
    const timer = setTimeout(() => setVisible(true), 350);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          <WelcomeSparkles emojis={emojis} fullScreen />

          <motion.div
            className="fixed inset-0 z-[80] bg-gradient-to-br from-black/70 via-purple-950/60 to-rose-950/70 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onClick={dismiss}
          />

          <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6 pointer-events-none overflow-hidden">
            {emojis.map((emoji, i) => (
              <FloatingEmoji
                key={`viewport-${emoji}-${i}`}
                emoji={emoji}
                delay={i * 0.28}
                x={`${(i * 17 + 5) % 88}%`}
                y={`${(i * 13 + 8) % 82}%`}
                size={
                  i % 2 === 0
                    ? "text-3xl sm:text-4xl opacity-50"
                    : "text-xl sm:text-2xl opacity-40"
                }
              />
            ))}

            <motion.div
              className="pointer-events-auto w-full max-w-lg relative"
              initial={{ opacity: 0, scale: 0.82, y: 50, rotateX: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <motion.div
                className="absolute -inset-1 rounded-[2.2rem] bg-gradient-to-r from-rose-400 via-fuchsia-400 to-violet-400 opacity-60 blur-lg"
                animate={{ opacity: [0.4, 0.75, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />

              <motion.div
                className="relative rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/30"
                animate={{
                  boxShadow: [
                    "0 0 50px rgba(244,63,94,0.45)",
                    "0 0 80px rgba(168,85,247,0.55)",
                    "0 0 50px rgba(244,63,94,0.45)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <WelcomeSparkles emojis={emojis} />

                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-rose-600 via-fuchsia-600 to-violet-800"
                  animate={{
                    background: [
                      "linear-gradient(135deg, #e11d48, #c026d3, #6d28d9)",
                      "linear-gradient(135deg, #db2777, #a855f7, #7c3aed)",
                      "linear-gradient(135deg, #e11d48, #c026d3, #6d28d9)",
                    ],
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />

                <motion.div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 25% 15%, rgba(255,255,255,0.45) 0%, transparent 45%), radial-gradient(circle at 75% 85%, rgba(255,192,203,0.35) 0%, transparent 40%)",
                  }}
                  animate={{ opacity: [0.35, 0.65, 0.35] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                />

                <div className="relative px-5 py-8 sm:px-10 sm:py-12 text-center text-white">
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 280 }}
                    className="flex justify-center gap-2 sm:gap-3 text-4xl sm:text-5xl mb-5"
                  >
                    {emojis.slice(0, 3).map((emoji, i) => (
                      <motion.span
                        key={emoji + i}
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          delay: i * 0.15,
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        {emoji}
                      </motion.span>
                    ))}
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs sm:text-sm uppercase tracking-[0.35em] text-white/90 mb-3 font-medium"
                  >
                    <ShimmerText>স্বাগতম</ShimmerText>
                  </motion.p>

                  <motion.h2
                    initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.32, duration: 0.6 }}
                    className="text-2xl sm:text-4xl font-bold mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)] text-balance"
                  >
                    <ShimmerText>{personName}</ShimmerText>
                  </motion.h2>

                  <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.48, type: "spring" }}
                    className="relative rounded-2xl bg-white/12 backdrop-blur-md border border-white/25 px-4 py-5 sm:px-6 sm:py-6 mb-7 overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut",
                      }}
                    />
                    <p className="relative text-sm sm:text-lg leading-relaxed italic text-white/95 text-balance">
                      &ldquo;{message}&rdquo;
                    </p>
                  </motion.div>

                  <motion.button
                    type="button"
                    onClick={dismiss}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.62 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="relative w-full sm:w-auto min-w-[220px] rounded-full bg-white text-rose-600 font-semibold px-8 py-3.5 text-sm sm:text-base shadow-xl shadow-black/25 overflow-hidden"
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-rose-100 via-white to-pink-100"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <span className="relative">ভিতরে যাও ✨</span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
