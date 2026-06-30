"use client";

import { useLayoutEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WelcomeSparkles } from "@/components/WelcomeSparkles";

type Props = {
  personName: string;
  message: string;
  isCelebration: boolean;
  personId: string;
  dateKey: string;
};

function storageKey(personId: string, dateKey: string) {
  return `priyojon-popup-${personId}-${dateKey}`;
}

export function FloatingMessagePopup({
  personName,
  message,
  isCelebration,
  personId,
  dateKey,
}: Props) {
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const key = storageKey(personId, dateKey);
    if (sessionStorage.getItem(key)) return;

    const timer = setTimeout(() => {
      sessionStorage.setItem(key, "1");
      setVisible(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [personId, dateKey]);

  function dismiss() {
    sessionStorage.setItem(storageKey(personId, dateKey), "1");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          <WelcomeSparkles
            emojis={isCelebration ? ["🎂", "🎉", "🎈", "🎁", "🥳", "💖"] : ["💌", "✨", "💖", "🌸", "💕", "⭐"]}
            fullScreen
          />
          <motion.div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
          />
          <motion.div
            className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 bottom-[22%] sm:bottom-[28%] z-[70] w-auto sm:max-w-md"
            initial={{ opacity: 0, y: 120, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-3xl overflow-hidden shadow-2xl ring-2 ring-white/30"
            >
              <motion.div
                className="absolute -inset-0.5 bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 opacity-50 blur-md"
                animate={{ opacity: [0.35, 0.65, 0.35] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <div className="relative bg-gradient-to-br from-rose-500/95 via-pink-600/95 to-purple-700/95 backdrop-blur-xl px-6 py-7 sm:px-8 sm:py-9 text-center text-white">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-4xl sm:text-5xl mb-3"
                >
                  {isCelebration ? "🎂🎉" : "💌"}
                </motion.div>
                <p className="text-sm uppercase tracking-[0.2em] opacity-90 mb-2">
                  {isCelebration ? "শুভ জন্মদিন" : "আজকের বার্তা"}
                </p>
                <p className="text-xl sm:text-2xl font-bold mb-4">{personName}</p>
                <p className="text-base sm:text-lg leading-relaxed italic opacity-95 text-balance">
                  &ldquo;{message}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={dismiss}
                  className="mt-6 rounded-full bg-white/20 hover:bg-white/30 px-6 py-2.5 text-sm font-medium transition-colors"
                >
                  ঠিক আছে ✨
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
