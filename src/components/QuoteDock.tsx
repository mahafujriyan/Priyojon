"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Person = { id: string; name: string; accessPath: string };

type Props = {
  persons: Person[];
  selectedId: string | null;
  quoteText: string | null;
  onSelect: (id: string) => void;
};

export function QuoteDock({
  persons,
  selectedId,
  quoteText,
  onSelect,
}: Props) {
  const selected = persons.find((p) => p.id === selectedId);

  return (
    <motion.div
      className="fixed left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] sm:w-full max-w-lg bottom-6 sm:bottom-10 pb-[env(safe-area-inset-bottom)]"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 24 }}
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/25"
      >
        <div className="bg-black/55 backdrop-blur-2xl px-5 py-5 sm:px-7 sm:py-6">
          {/* Name pills */}
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
            {persons.map((person) => (
              <motion.button
                key={person.id}
                type="button"
                onClick={() => onSelect(person.id)}
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.03 }}
                className={`rounded-full px-5 py-2.5 text-sm sm:text-base font-semibold transition-all duration-300 ${
                  selectedId === person.id
                    ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/50"
                    : "bg-white/12 text-white/85 hover:bg-white/22"
                }`}
              >
                {person.name}
              </motion.button>
            ))}
          </div>

          {/* Bani */}
          <AnimatePresence mode="wait">
            {quoteText && (
              <motion.div
                key={quoteText}
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
                className="border-t border-white/15 pt-4"
              >
                <motion.p
                  className="text-center text-base sm:text-lg md:text-xl leading-relaxed text-white font-medium italic px-1 text-balance"
                  animate={{ opacity: [0.85, 1, 0.85] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  &ldquo;{quoteText}&rdquo;
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {selected && (
            <div className="flex justify-center mt-4">
              <Link
                href={`/c/${selected.accessPath}`}
                className="text-xs sm:text-sm text-white/45 hover:text-rose-300 transition-colors tracking-wide"
              >
                ফুলস্ক্রিন দেখুন ↗
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
