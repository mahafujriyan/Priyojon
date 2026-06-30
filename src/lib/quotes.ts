import type { Quote, RelationType } from "@/generated/prisma/client";
import { getMilestoneThreshold } from "./countdown";

type PersonQuotes = {
  customQuote?: string | null;
  celebrationPopupMessage?: string | null;
};

export function resolveQuoteText(
  person: PersonQuotes,
  bankQuote: Quote | null,
  daysRemaining: number,
  isCelebration: boolean,
): string | null {
  if (isCelebration) {
    return (
      person.celebrationPopupMessage?.trim() ||
      bankQuote?.text ||
      null
    );
  }

  if (person.customQuote?.trim()) {
    return person.customQuote.trim();
  }

  return bankQuote?.text ?? null;
}

export function selectQuote(
  quotes: Quote[],
  relationType: RelationType,
  daysRemaining: number,
  isCelebration: boolean,
  now: Date = new Date(),
): Quote | null {
  const filtered = quotes.filter((q) => q.relationType === relationType);
  if (filtered.length === 0) return null;

  if (isCelebration) {
    const celebration = filtered.filter((q) => q.kind === "CELEBRATION");
    if (celebration.length > 0) {
      const start = new Date(now.getFullYear(), 0, 0);
      const dayOfYear = Math.floor(
        (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
      );
      return celebration[dayOfYear % celebration.length];
    }
  }

  const milestone = getMilestoneThreshold(daysRemaining);
  if (milestone !== null) {
    const milestoneQuotes = filtered.filter(
      (q) => q.kind === "MILESTONE" && q.milestoneDays === milestone,
    );
    if (milestoneQuotes.length > 0) {
      const start = new Date(now.getFullYear(), 0, 0);
      const dayOfYear = Math.floor(
        (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
      );
      return milestoneQuotes[dayOfYear % milestoneQuotes.length];
    }
  }

  const dailyQuotes = filtered
    .filter((q) => q.kind === "DAILY" && q.dayOffset !== null)
    .sort((a, b) => (a.dayOffset ?? 0) - (b.dayOffset ?? 0));

  if (dailyQuotes.length === 0) {
    const anyDaily = filtered.filter((q) => q.kind === "DAILY");
    return anyDaily[0] ?? filtered[0];
  }

  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  return dailyQuotes[dayOfYear % dailyQuotes.length];
}
