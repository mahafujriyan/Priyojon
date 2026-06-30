import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { parseThemeColors } from "@/lib/theme";
import type { RelationType } from "@/generated/prisma/client";

const RELATION_TYPES = new Set<string>([
  "GIRLFRIEND_BOYFRIEND",
  "BEST_FRIEND",
  "CLOSE_FRIEND",
  "FAMILY",
  "CRUSH",
  "CUSTOM",
]);

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const relationType = searchParams.get("relationType");

  if (!relationType || !RELATION_TYPES.has(relationType)) {
    return NextResponse.json(
      { error: "সম্পর্কের ধরন প্রয়োজন" },
      { status: 400 },
    );
  }

  const themes = await prisma.themeSet.findMany({
    where: {
      relationType: relationType as RelationType,
      kind: "DAILY",
    },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(
    themes.map((theme, index) => {
      const colors = parseThemeColors(theme.colors);
      return {
        id: theme.id,
        label: `থিম ${index + 1}`,
        bgImageUrl: theme.bgImageUrl,
        gradient: colors.gradient,
        animationType: theme.animationType,
      };
    }),
  );
}
