import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { parseThemeColors } from "@/lib/theme";
import type { EventType, RelationType } from "@/generated/prisma";

const RELATION_TYPES = new Set<string>([
  "GIRLFRIEND_BOYFRIEND",
  "BEST_FRIEND",
  "CLOSE_FRIEND",
  "FAMILY",
  "CRUSH",
  "CUSTOM",
]);

const EVENT_TYPES = new Set<string>([
  "BIRTHDAY",
  "ANNIVERSARY",
  "APOLOGY",
  "SPECIAL",
  "CUSTOM",
]);

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const relationType = searchParams.get("relationType");
  const eventType = searchParams.get("eventType") ?? "BIRTHDAY";

  if (!relationType || !RELATION_TYPES.has(relationType)) {
    return NextResponse.json(
      { error: "সম্পর্কের ধরন প্রয়োজন" },
      { status: 400 },
    );
  }

  if (!EVENT_TYPES.has(eventType)) {
    return NextResponse.json(
      { error: "ইভেন্টের ধরন সঠিক নয়" },
      { status: 400 },
    );
  }

  let themes = await prisma.themeSet.findMany({
    where: {
      relationType: relationType as RelationType,
      eventType: eventType as EventType,
      kind: "DAILY",
    },
    orderBy: { sortOrder: "asc" },
  });

  if (themes.length === 0 && eventType !== "BIRTHDAY") {
    themes = await prisma.themeSet.findMany({
      where: {
        relationType: relationType as RelationType,
        eventType: "BIRTHDAY",
        kind: "DAILY",
      },
      orderBy: { sortOrder: "asc" },
    });
  }

  return NextResponse.json(
    themes.map((theme, index) => {
      const colors = parseThemeColors(theme.colors);
      return {
        id: theme.id,
        label: `থিম ${index + 1}`,
        bgImageUrl: theme.bgImageUrl,
        gradient: colors.gradient,
        animationType: theme.animationType,
        overlayEmoji: theme.overlayEmoji,
      };
    }),
  );
}
