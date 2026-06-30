import type { EventType, RelationType } from "@/generated/prisma/client";
import { prisma } from "./prisma";

export async function resolvePreferredThemeId(
  themeId: string | null,
  relationType: RelationType,
  eventType: EventType,
): Promise<string | null> {
  if (!themeId) return null;

  const theme = await prisma.themeSet.findFirst({
    where: {
      id: themeId,
      relationType,
      eventType,
      kind: "DAILY",
    },
  });

  if (!theme) {
    throw new Error("থিম সঠিক নয়");
  }

  return theme.id;
}
