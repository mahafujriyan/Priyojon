"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getCountdownParts,
  padTwo,
  type CountdownParts,
} from "@/lib/countdown";

type InitialCountdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCelebration: boolean;
};

type Props = {
  targetDateIso: string;
  isRecurringYearly: boolean;
  serverTimeIso: string;
  initialCountdown: InitialCountdown;
  highlight?: boolean;
};

function CountdownUnit({
  value,
  label,
  highlight,
  animate,
}: {
  value: string;
  label: string;
  highlight?: boolean;
  animate: boolean;
}) {
  const digit = (
    <div
      className={`countdown-digit rounded-xl sm:rounded-2xl px-2 py-3 sm:px-5 sm:py-6 text-center backdrop-blur-md ${
        highlight
          ? "bg-white/25 ring-2 ring-white/50 shadow-lg shadow-white/20"
          : "bg-white/15 ring-1 ring-white/20"
      }`}
    >
      <span className="font-mono text-3xl sm:text-6xl md:text-7xl font-bold tracking-wider tabular-nums drop-shadow-md">
        {value}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2">
      {animate ? (
        <AnimatePresence mode="popLayout">
          <motion.div
            key={value}
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {digit}
          </motion.div>
        </AnimatePresence>
      ) : (
        digit
      )}
      <span className="text-xs sm:text-sm font-medium uppercase tracking-widest opacity-80">
        {label}
      </span>
    </div>
  );
}

function toParts(initial: InitialCountdown): CountdownParts {
  return {
    days: initial.days,
    hours: initial.hours,
    minutes: initial.minutes,
    seconds: initial.seconds,
    totalMs: 0,
    isCelebration: initial.isCelebration,
    daysRemaining: initial.days,
    effectiveTarget: new Date(),
  };
}

export function CountdownTimer({
  targetDateIso,
  isRecurringYearly,
  serverTimeIso,
  initialCountdown,
  highlight = false,
}: Props) {
  const [parts, setParts] = useState<CountdownParts>(() =>
    toParts(initialCountdown),
  );
  const [animateDigits, setAnimateDigits] = useState(false);

  useEffect(() => {
    setAnimateDigits(true);

    const serverOffset =
      new Date(serverTimeIso).getTime() - Date.now();

    const tick = () => {
      const now = new Date(Date.now() + serverOffset);
      setParts(
        getCountdownParts(
          new Date(targetDateIso),
          isRecurringYearly,
          now,
        ),
      );
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDateIso, isRecurringYearly, serverTimeIso]);

  if (parts.isCelebration) {
    return (
      <motion.div
        initial={false}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <p className="text-3xl sm:text-5xl md:text-6xl font-bold">
          🎂 শুভ জন্মদিন! 🎉
        </p>
        <p className="mt-4 text-lg sm:text-xl opacity-90">
          আজ তোমার বিশেষ দিন
        </p>
      </motion.div>
    );
  }

  const units = [
    { value: padTwo(parts.days), label: "দিন" },
    { value: padTwo(parts.hours), label: "ঘণ্টা" },
    { value: padTwo(parts.minutes), label: "মিনিট" },
    { value: padTwo(parts.seconds), label: "সেকেন্ড" },
  ];

  return (
    <div className="grid grid-cols-4 gap-1.5 sm:gap-4 md:gap-6 w-full max-w-xs sm:max-w-2xl mx-auto px-1">
      {units.map((unit) => (
        <CountdownUnit
          key={unit.label}
          value={unit.value}
          label={unit.label}
          highlight={highlight}
          animate={animateDigits}
        />
      ))}
    </div>
  );
}
