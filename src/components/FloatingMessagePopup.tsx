"use client";

import { useLayoutEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { WelcomeSparkles } from "@/components/WelcomeSparkles";

type Props = {
  personName: string;
  message: string | null;
  imageUrl?: string | null;
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
  imageUrl,
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
            emojis={
              isCelebration
                ? ["🎂", "🎉", "🎈", "🎁", "🥳", "💖"]
                : ["💌", "✨", "💖", "🌸", "💕", "⭐"]
            }
            fullScreen
          />
          <motion.div
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
          />
          <motion.div
            className="fixed inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-[10%] sm:top-[12%] bottom-auto z-[70] w-auto sm:max-w-md max-h-[80dvh] overflow-y-auto"
            initial={{ opacity: 0, y: 80, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-3xl overflow-hidden shadow-2xl ring-2 ring-white/30"
            >
              <motion.div
                className="absolute -inset-0.5 bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 opacity-50 blur-md"
                animate={{ opacity: [0.35, 0.65, 0.35] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />

              <div className="relative bg-gradient-to-br from-rose-500/95 via-pink-600/95 to-purple-700/95 backdrop-blur-xl text-center text-white overflow-hidden">
                {imageUrl && (
                  <motion.div
                    className="relative w-full aspect-[4/3] sm:aspect-[16/11] overflow-hidden"
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <Image
                      src={imageUrl}
                      alt={personName}
                      fill
                      sizes="(max-width: 640px) 100vw, 28rem"
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-black/10" />
                    <motion.div
                      className="absolute bottom-3 left-0 right-0 text-3xl sm:text-4xl"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.25, type: "spring" }}
                    >
                      {isCelebration ? "🎂🎉" : "💌"}
                    </motion.div>
                  </motion.div>
                )}

                <div className="px-5 py-6 sm:px-8 sm:py-8">
                  {!imageUrl && (
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="text-4xl sm:text-5xl mb-3"
                    >
                      {isCelebration ? "🎂🎉" : "💌"}
                    </motion.div>
                  )}

                  <p className="text-xs sm:text-sm uppercase tracking-[0.2em] opacity-90 mb-2">
                    {isCelebration ? "শুভ বিশেষ দিন" : "আজকের বার্তা"}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold mb-3 drop-shadow">
                    {personName}
                  </p>

                  {message && (
                    <p className="text-sm sm:text-lg leading-relaxed italic opacity-95 text-balance">
                      &ldquo;{message}&rdquo;
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={dismiss}
                    className="mt-6 rounded-full bg-white/20 hover:bg-white/30 px-6 py-2.5 text-sm font-medium transition-colors"
                  >
                    ঠিক আছে ✨
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
