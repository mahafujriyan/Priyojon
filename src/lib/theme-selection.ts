import type { RelationType } from "@/generated/prisma/client";
import { prisma } from "./prisma";

export async function resolvePreferredThemeId(
  themeId: string | null,
  relationType: RelationType,
): Promise<string | null> {
  if (!themeId) return null;

  const theme = await prisma.themeSet.findFirst({
    where: {
      id: themeId,
      relationType,
      kind: "DAILY",
    },
  });

  if (!theme) {
    throw new Error("থিম সঠিক নয়");
  }

  return theme.id;
}
