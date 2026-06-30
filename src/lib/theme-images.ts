import type { RelationType } from "@/generated/prisma/client";

export type ThemeImageKind = "DAILY" | "MILESTONE" | "CELEBRATION";

const FOLDER: Record<RelationType, string> = {
  GIRLFRIEND_BOYFRIEND: "girlfriend-boyfriend",
  BEST_FRIEND: "best-friend",
  CLOSE_FRIEND: "close-friend",
  FAMILY: "family",
  CRUSH: "crush",
  CUSTOM: "custom",
};

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop`;

/** Local path under /public/themes — replace any file to use your own image */
export function getThemeImagePath(
  relationType: RelationType,
  kind: ThemeImageKind,
  index = 0,
  milestoneDays?: number,
): string {
  const folder = FOLDER[relationType];

  if (kind === "CELEBRATION") {
    return `/themes/${folder}/celebration.jpg`;
  }

  if (kind === "MILESTONE" && milestoneDays) {
    return `/themes/${folder}/milestone-${milestoneDays}.jpg`;
  }

  const day = String(index + 1).padStart(2, "0");
  return `/themes/${folder}/daily-${day}.jpg`;
}

/** Pexels sources — temporary stock images (replace in public/themes/ later) */
export const THEME_IMAGE_SOURCES: Record<
  RelationType,
  {
    daily: string[];
    milestone: Record<number, string>;
    celebration: string;
  }
> = {
  GIRLFRIEND_BOYFRIEND: {
    daily: [
      px(1024991), // couple sunset
      px(1456650), // red roses
      px(1232831), // rose bouquet
      px(3184393), // romantic couple
      px(325185), // wedding rings
      px(360145), // pink roses
      px(267360), // love hands
    ],
    milestone: {
      30: px(169193), // romantic lights
      7: px(1024991),
      3: px(1456650),
      1: px(3184393),
    },
    celebration: px(949592), // party celebration
  },
  BEST_FRIEND: {
    daily: [
      px(1267696), // friends group
      px(1523241), // friends fun
      px(3184418), // laughing friends
      px(2077022), // friends beach
      px(1267697),
      px(3184292),
      px(3184296),
    ],
    milestone: {
      30: px(1267696),
      7: px(3184418),
      3: px(1523241),
      1: px(949592),
    },
    celebration: px(949592),
  },
  CLOSE_FRIEND: {
    daily: [
      px(147411), // mountains
      px(414612), // forest
      px(113338), // ocean sunset
      px(167699), // lake
      px(1287145), // green hills
      px(1770808), // warm sunset
      px(1365425), // nature path
    ],
    milestone: {
      30: px(147411),
      7: px(113338),
      3: px(1770808),
      1: px(414612),
    },
    celebration: px(1287145),
  },
  FAMILY: {
    daily: [
      px(3823497), // family
      px(3825117),
      px(3820060),
      px(3820283),
      px(3820306),
      px(3820387),
      px(3820436),
    ],
    milestone: {
      30: px(3823497),
      7: px(3825117),
      3: px(3820060),
      1: px(3820283),
    },
    celebration: px(3820306),
  },
  CRUSH: {
    daily: [
      px(1162251), // starry sky
      px(1257860), // northern lights
      px(1933239), // moon
      px(1252890), // dreamy sky
      px(998641), // lavender
      px(2070033), // soft pink sky
      px(1528315), // night stars
    ],
    milestone: {
      30: px(1162251),
      7: px(1257860),
      3: px(998641),
      1: px(2070033),
    },
    celebration: px(1252890),
  },
  CUSTOM: {
    daily: [
      px(1103970), // abstract gradient
      px(713047),
      px(713056),
      px(713066),
      px(713149),
      px(713503),
      px(713504),
    ],
    milestone: {
      30: px(1103970),
      7: px(713047),
      3: px(713056),
      1: px(713066),
    },
    celebration: px(713149),
  },
};

export function resolveThemeBgUrl(
  relationType: RelationType,
  kind: ThemeImageKind,
  sortOrder = 0,
  milestoneDays?: number | null,
): string {
  return getThemeImagePath(
    relationType,
    kind,
    kind === "DAILY" ? sortOrder : 0,
    milestoneDays ?? undefined,
  );
}
