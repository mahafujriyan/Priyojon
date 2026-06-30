"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getCountdownParts,
  padTwo,
  type CountdownParts,
} from "@/lib/countdown";
import { EVENT_CELEBRATION } from "@/lib/events";
import type { EventType } from "@/generated/prisma/client";

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
  useExactTime: boolean;
  eventType: EventType;
  serverTimeIso: string;
  initialCountdown: InitialCountdown;
  highlight?: boolean;
  onCelebrationChange?: (active: boolean) => void;
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
  useExactTime,
  eventType,
  serverTimeIso,
  initialCountdown,
  highlight = false,
  onCelebrationChange,
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
      const next = getCountdownParts(
        new Date(targetDateIso),
        isRecurringYearly,
        useExactTime,
        now,
      );
      setParts(next);
      onCelebrationChange?.(next.isCelebration);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [
    targetDateIso,
    isRecurringYearly,
    useExactTime,
    serverTimeIso,
    onCelebrationChange,
  ]);

  const celebration = EVENT_CELEBRATION[eventType];

  if (parts.isCelebration) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="text-center"
      >
        <p className="text-3xl sm:text-5xl md:text-6xl font-bold">
          {celebration.title}
        </p>
        <p className="mt-4 text-lg sm:text-xl opacity-90">
          {celebration.subtitle}
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
