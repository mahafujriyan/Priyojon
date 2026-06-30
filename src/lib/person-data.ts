import { prisma } from "./prisma";
import { getCountdownParts } from "./countdown";
import { selectTheme } from "./theme";
import { selectQuote, resolveQuoteText } from "./quotes";
import type { CountdownPageData } from "@/components/CountdownDisplay";

export async function buildCountdownPageData(
  personId: string,
): Promise<CountdownPageData | null> {
  const person = await prisma.person.findUnique({ where: { id: personId } });
  if (!person) return null;

  const now = new Date();
  const parts = getCountdownParts(
    person.targetDate,
    person.isRecurringYearly,
    now,
  );

  const [themes, quotes] = await Promise.all([
    prisma.themeSet.findMany(),
    prisma.quote.findMany(),
  ]);

  const theme = selectTheme(
    themes,
    person.relationType,
    parts.daysRemaining,
    parts.isCelebration,
    now,
  );

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

  const dateKey = now.toISOString().slice(0, 10);

  if (!theme) return null;

  return {
    personId: person.id,
    person: {
      name: person.name,
      relationType: person.relationType,
      targetDateIso: person.targetDate.toISOString(),
      isRecurringYearly: person.isRecurringYearly,
      coverImageUrl: person.coverImageUrl,
    },
    theme: {
      colors: theme.colors,
      bgImageUrl: theme.bgImageUrl,
      animationType: theme.animationType,
      kind: theme.kind,
      milestoneDays: theme.milestoneDays,
    },
    quote: quoteText ? { text: quoteText } : null,
    popupMessage: quoteText,
    showPopup: Boolean(quoteText),
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

export async function buildCountdownPageDataByAccess(
  slug: string,
  token: string,
  options?: { logView?: boolean },
): Promise<CountdownPageData | null> {
  const person = await findPersonByAccess(slug, token);
  if (!person) return null;

  if (options?.logView) {
    await prisma.accessLog.create({ data: { personId: person.id } });
  }

  return buildCountdownPageData(person.id);
}
