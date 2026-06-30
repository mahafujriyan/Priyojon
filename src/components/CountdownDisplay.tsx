"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CountdownTimer } from "./CountdownTimer";
import { CelebrationEffect } from "./CelebrationEffect";
import { ThemeParticles } from "./ThemeParticles";
import { AnimatedHeroName } from "./AnimatedHeroName";
import { FloatingMessagePopup } from "./FloatingMessagePopup";
import { ThemeEmojiOverlay } from "./ThemeEmojiOverlay";
import { CelebrationReveal } from "./CelebrationReveal";
import { WelcomePortalOverlay } from "./WelcomePortalOverlay";
import { parseThemeColors } from "@/lib/theme";
import { resolveParticleVariant } from "@/lib/theme-effects";
import type { EventType, RelationType } from "@/generated/prisma/client";

export type CountdownPageData = {
  person: {
    name: string;
    relationType: RelationType;
    eventType: EventType;
    targetDateIso: string;
    isRecurringYearly: boolean;
    useExactTime: boolean;
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
    overlayEmojis: string[];
  };
  quote: { text: string } | null;
  welcomeMessage: string;
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
  showQuote = true,
}: {
  data: CountdownPageData;
  showQuote?: boolean;
}) {
  const colors = parseThemeColors(data.theme.colors);
  const isMilestone = data.theme.kind === "MILESTONE";
  const [isCelebration, setIsCelebration] = useState(data.isCelebration);
  const bgImage = data.theme.bgImageUrl;
  const particles = resolveParticleVariant(
    data.person.relationType,
    data.theme.animationType,
  );

  useEffect(() => {
    setIsCelebration(data.isCelebration);
  }, [data.isCelebration]);

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
          style={{ background: colors.gradient }}
        />
      )}

      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(165deg, ${colors.primary}99 0%, ${colors.secondary}bb 45%, rgba(0,0,0,0.55) 100%)`,
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

      <ThemeEmojiOverlay emojis={data.theme.overlayEmojis} />
      {particles && <ThemeParticles variant={particles} />}
      {isCelebration && <CelebrationEffect />}
      <CelebrationReveal active={isCelebration} personName={data.person.name} />

      <WelcomePortalOverlay
        personName={data.person.name}
        message={data.welcomeMessage}
        eventType={data.person.eventType}
      />

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
      >
        <div className="space-y-1 sm:space-y-2">
          <AnimatedHeroName
            name={data.person.name}
            relationType={data.person.relationType}
            subtitle={
              !isCelebration ? "বিশেষ মুহূর্ত পর্যন্ত বাকি" : undefined
            }
          />
        </div>

        <CountdownTimer
          targetDateIso={data.person.targetDateIso}
          isRecurringYearly={data.person.isRecurringYearly}
          useExactTime={data.person.useExactTime}
          eventType={data.person.eventType}
          serverTimeIso={data.serverTimeIso}
          initialCountdown={data.countdown}
          highlight={isMilestone || isCelebration}
          onCelebrationChange={setIsCelebration}
        />

        {showQuote && data.quote && (
          <motion.blockquote
            className="mx-auto max-w-xl rounded-2xl sm:rounded-3xl bg-black/25 backdrop-blur-lg px-4 py-4 sm:px-8 sm:py-6 ring-1 ring-white/25 shadow-2xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
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
