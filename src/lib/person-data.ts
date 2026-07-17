import { prisma } from "./prisma";
import { verifyPassword } from "./auth";
import { getCountdownParts } from "./countdown";
import { parseThemeColors, selectTheme } from "./theme";
import { selectQuote, resolveQuoteText } from "./quotes";
import type { CountdownPageData } from "@/components/CountdownDisplay";
import type { EventType, ThemeSet } from "@/generated/prisma";
import { EVENT_OVERLAY_EMOJIS } from "./events";
import { resolveWelcomeMessage } from "./welcome";

function serializeTheme(theme: ThemeSet) {
  const colors = parseThemeColors(theme.colors);
  const emojis = theme.overlayEmoji
    ? theme.overlayEmoji.split(/\s+/).filter(Boolean)
    : EVENT_OVERLAY_EMOJIS[theme.eventType];
  return {
    id: theme.id,
    colors: theme.colors,
    bgImageUrl: theme.bgImageUrl,
    animationType: theme.animationType,
    kind: theme.kind,
    milestoneDays: theme.milestoneDays,
    gradient: colors.gradient,
    overlayEmojis: emojis,
  };
}

export type BuildCountdownOptions = {
  logView?: boolean;
  visitorKey?: string | null;
};

export async function buildCountdownPageData(
  personId: string,
  options?: BuildCountdownOptions,
): Promise<CountdownPageData | null> {
  const person = await prisma.person.findUnique({ where: { id: personId } });
  if (!person) return null;

  const now = new Date();
  const parts = getCountdownParts(
    person.targetDate,
    person.isRecurringYearly,
    person.useExactTime,
    now,
  );

  const [themes, quotes] = await Promise.all([
    prisma.themeSet.findMany(),
    prisma.quote.findMany(),
  ]);

  let theme = selectTheme(
    themes,
    person.relationType,
    person.eventType,
    parts.daysRemaining,
    parts.isCelebration,
    now,
  );

  if (
    theme?.kind === "DAILY" &&
    !parts.isCelebration &&
    person.preferredThemeId
  ) {
    const preferred = themes.find(
      (t) =>
        t.id === person.preferredThemeId &&
        t.relationType === person.relationType &&
        t.eventType === person.eventType &&
        t.kind === "DAILY",
    );
    if (preferred) theme = preferred;
  }

  const quote = selectQuote(
    quotes,
    person.relationType,
    parts.daysRemaining,
    parts.isCelebration,
    now,
  );

  const quoteText = resolveQuoteText(
    person,
    quote,
    parts.daysRemaining,
    parts.isCelebration,
  );

  const welcomeMessage = resolveWelcomeMessage(person);

  const popupMessage = parts.isCelebration
    ? person.celebrationPopupMessage?.trim() ||
      quote?.text ||
      quoteText ||
      null
    : null;

  const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  if (!theme) return null;

  if (options?.logView) {
    await prisma.accessLog.create({
      data: {
        personId: person.id,
        visitorKey: options.visitorKey  ?? null,
      },
    });
  }

  const bgImageUrl = person.customBgImageUrl || theme.bgImageUrl;

  return {
    personId: person.id,
    person: {
      name: person.name,
      relationType: person.relationType,
      eventType: person.eventType,
      targetDateIso: person.targetDate.toISOString(),
      isRecurringYearly: person.isRecurringYearly,
      useExactTime: person.useExactTime,
      coverImageUrl: person.coverImageUrl,
    },
    theme: { ...serializeTheme(theme), bgImageUrl },
    quote: quoteText ? { text: quoteText } : null,
    welcomeMessage,
    popupMessage,
    showPopup: Boolean(popupMessage),
    dateKey,
    serverTimeIso: now.toISOString(),
    isCelebration: parts.isCelebration,
    daysRemaining: parts.daysRemaining,
    countdown: {
      days: parts.days,
      hours: parts.hours,
      minutes: parts.minutes,
      seconds: parts.seconds,
      isCelebration: parts.isCelebration,
    },
  };
}

export async function findPersonByAccess(slug: string, token: string) {
  return prisma.person.findFirst({
    where: { slug, accessToken: token },
  });
}

export async function findPersonByAccessCode(code: string) {
  const trimmed = code.trim();
  if (!trimmed) return null;

  const persons = await prisma.person.findMany({
    where: { accessCodeHash: { not: null } },
  });

  for (const person of persons) {
    if (
      person.accessCodeHash &&
      (await verifyPassword(trimmed, person.accessCodeHash))
    ) {
      return person;
    }
  }

  return null;
}

export async function buildCountdownPageDataByAccess(
  slug: string,
  token: string,
  options?: BuildCountdownOptions,
): Promise<CountdownPageData | null> {
  const person = await findPersonByAccess(slug, token);
  if (!person) return null;

  return buildCountdownPageData(person.id, {
    logView: options?.logView,
    visitorKey: options?.visitorKey ?? person.id,
  });
}

export async function getPersonVisitStats(personId: string) {
  const logs = await prisma.accessLog.findMany({
    where: { personId },
    orderBy: { viewedAt: "desc" },
    take: 50,
  });
  const uniqueVisitors = new Set(
    logs.map((l) => l.visitorKey ?? l.id),
  ).size;
  return { totalVisits: logs.length, uniqueVisitors, recent: logs };
}
