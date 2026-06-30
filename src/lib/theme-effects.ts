import type { RelationType } from "@/generated/prisma/client";

export type ParticleVariant = "hearts" | "sparkle" | "petals";

export function resolveParticleVariant(
  relationType: RelationType,
  animationType: string,
): ParticleVariant | null {
  if (animationType === "confetti") return null;

  const romantic =
    relationType === "GIRLFRIEND_BOYFRIEND" || relationType === "CRUSH";

  if (romantic) {
    if (animationType === "float") return "petals";
    return "hearts";
  }

  if (relationType === "BEST_FRIEND" || relationType === "CLOSE_FRIEND") {
    return "sparkle";
  }

  if (relationType === "FAMILY") {
    return animationType === "pulse" ? "sparkle" : "petals";
  }

  return "sparkle";
}
