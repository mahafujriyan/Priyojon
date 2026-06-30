"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CountdownTimer } from "./CountdownTimer";
import { CelebrationEffect } from "./CelebrationEffect";
import { ThemeParticles } from "./ThemeParticles";
import { AnimatedHeroName } from "./AnimatedHeroName";
import { FloatingMessagePopup } from "./FloatingMessagePopup";
import { parseThemeColors, RELATION_LABELS } from "@/lib/theme";
import { resolveParticleVariant } from "@/lib/theme-effects";
import type { RelationType } from "@/generated/prisma/client";

export type CountdownPageData = {
  person: {
    name: string;
    relationType: RelationType;
    targetDateIso: string;
    isRecurringYearly: boolean;
    coverImageUrl: string | null;
  };
  theme: {
    id: string;
    colors: unknown;
    bgImageUrl: string | null;
    animationType: string;
    kind: string;
    milestoneDays: number | null;
    gradient: string;
  };
  quote: { text: string } | null;
  popupMessage: string | null;
  showPopup: boolean;
  personId: string;
  dateKey: string;
  serverTimeIso: string;
  isCelebration: boolean;
  daysRemaining: number;
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isCelebration: boolean;
  };
};

export function CountdownDisplay({
  data,
  showRelationLabel = true,
  showQuote = true,
}: {
  data: CountdownPageData;
  showRelationLabel?: boolean;
  showQuote?: boolean;
}) {
  const colors = parseThemeColors(data.theme.colors);
  const isMilestone = data.theme.kind === "MILESTONE";
  const isCelebration = data.isCelebration;
  const bgImage = data.theme.bgImageUrl;
  const particles = resolveParticleVariant(
    data.person.relationType,
    data.theme.animationType,
  );

  return (
    <div
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden px-3 sm:px-6 py-8 sm:py-12 pb-44 sm:pb-48"
      style={{ color: colors.text }}
    >
      <AnimatePresence mode="wait">
        {bgImage && (
          <motion.div
            key={bgImage}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <Image
              src={bgImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!bgImage && (
        <motion.div
          key={data.theme.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ background: colors.gradient }}
        />
      )}

      <motion.div
        key={`overlay-${data.theme.id}`}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          background: `linear-gradient(
            165deg,
            ${colors.primary}99 0%,
            ${colors.secondary}bb 45%,
            rgba(0,0,0,0.55) 100%
          )`,
        }}
      />

      {data.person.coverImageUrl && (
        <div className="absolute inset-0 mix-blend-soft-light opacity-40">
          <Image
            src={data.person.coverImageUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover blur-[2px]"
          />
        </div>
      )}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.35)_100%)]" />

      {particles && <ThemeParticles variant={particles} />}
      {isCelebration && <CelebrationEffect />}

      {data.showPopup && data.popupMessage && (
        <FloatingMessagePopup
          personName={data.person.name}
          message={data.popupMessage}
          isCelebration={isCelebration}
          personId={data.personId}
          dateKey={data.dateKey}
        />
      )}

      <motion.div
        className="relative z-10 w-full max-w-4xl text-center space-y-6 sm:space-y-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <div className="space-y-1 sm:space-y-2">
          {showRelationLabel && (
            <p className="text-xs sm:text-sm uppercase tracking-[0.25em] opacity-90 drop-shadow-md">
              {RELATION_LABELS[data.person.relationType]}
            </p>
          )}
          <AnimatedHeroName
            name={data.person.name}
            relationType={data.person.relationType}
            subtitle={
              !isCelebration ? "জন্মদিন পর্যন্ত বাকি" : undefined
            }
          />
          {isCelebration && (
            <motion.p
              className="text-lg sm:text-xl opacity-95 drop-shadow-md mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              আজ তোমার বিশেষ দিন ✨
            </motion.p>
          )}
        </div>

        <CountdownTimer
          targetDateIso={data.person.targetDateIso}
          isRecurringYearly={data.person.isRecurringYearly}
          serverTimeIso={data.serverTimeIso}
          initialCountdown={data.countdown}
          highlight={isMilestone || isCelebration}
        />

        {showQuote && data.quote && (
          <motion.blockquote
            className="mx-auto max-w-xl rounded-2xl sm:rounded-3xl bg-black/25 backdrop-blur-lg px-4 py-4 sm:px-8 sm:py-6 ring-1 ring-white/25 shadow-2xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <p className="text-sm sm:text-lg md:text-xl leading-relaxed italic drop-shadow-sm text-balance">
              &ldquo;{data.quote.text}&rdquo;
            </p>
          </motion.blockquote>
        )}
      </motion.div>
    </div>
  );
}
