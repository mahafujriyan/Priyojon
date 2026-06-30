import type { EventType, RelationType, ThemeSet } from "@/generated/prisma/client";
import { getMilestoneThreshold } from "./countdown";

export type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  gradient: string;
};

export function parseThemeColors(colors: unknown): ThemeColors {
  const c = colors as Partial<ThemeColors>;
  return {
    primary: c.primary ?? "#ec4899",
    secondary: c.secondary ?? "#be185d",
    accent: c.accent ?? "#fbbf24",
    text: c.text ?? "#ffffff",
    gradient:
      c.gradient ??
      "linear-gradient(135deg, #ec4899 0%, #be185d 50%, #831843 100%)",
  };
}

export function selectTheme(
  themes: ThemeSet[],
  relationType: RelationType,
  eventType: EventType,
  daysRemaining: number,
  isCelebration: boolean,
  now: Date = new Date(),
): ThemeSet | null {
  const filtered = themes.filter(
    (t) => t.relationType === relationType && t.eventType === eventType,
  );
  if (filtered.length === 0) {
    const birthdayThemes = themes.filter(
      (t) => t.relationType === relationType && t.eventType === "BIRTHDAY",
    );
    if (birthdayThemes.length === 0) return null;
    return selectTheme(
      birthdayThemes,
      relationType,
      "BIRTHDAY",
      daysRemaining,
      isCelebration,
      now,
    );
  }

  if (isCelebration) {
    const celebration = filtered.find((t) => t.kind === "CELEBRATION");
    if (celebration) return celebration;
  }

  const milestone = getMilestoneThreshold(daysRemaining);
  if (milestone !== null) {
    const milestoneTheme = filtered.find(
      (t) => t.kind === "MILESTONE" && t.milestoneDays === milestone,
    );
    if (milestoneTheme) return milestoneTheme;
  }

  const dailyThemes = filtered
    .filter((t) => t.kind === "DAILY")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (dailyThemes.length === 0) {
    return filtered[0];
  }

  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  const index = dayOfYear % dailyThemes.length;
  return dailyThemes[index];
}

export const RELATION_LABELS: Record<RelationType, string> = {
  GIRLFRIEND_BOYFRIEND: "গার্লফ্রেন্ড / বয়ফ্রেন্ড",
  BEST_FRIEND: "বেস্ট ফ্রেন্ড",
  CLOSE_FRIEND: "ক্লোজ ফ্রেন্ড",
  FAMILY: "পরিবার",
  CRUSH: "ক্রাশ / স্পেশাল ইন্টারেস্ট",
  CUSTOM: "কাস্টম",
};
