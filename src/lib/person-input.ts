import type { EventType, RelationType } from "@/generated/prisma/client";
import { slugifyName } from "./slug";
import {
  defaultExactTimeForEvent,
  defaultRecurringForEvent,
} from "./events";

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

export type PersonInput = {
  name: string;
  relationType: RelationType;
  eventType: EventType;
  targetDate: Date;
  useExactTime: boolean;
  isRecurringYearly: boolean;
  coverImageUrl: string | null;
  customBgImageUrl: string | null;
  customQuote: string | null;
  welcomeMessage: string | null;
  celebrationPopupMessage: string | null;
  preferredThemeId: string | null;
  accessCode: string | null;
  slug: string;
};

function optText(value: unknown): string | null {
  if (value == null) return null;
  const text = typeof value === "string" ? value : String(value);
  const trimmed = text.trim();
  return trimmed || null;
}

export function parseTargetDate(value: unknown): Date {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("তারিখ ও সময় প্রয়োজন");
  }

  const raw = value.trim();
  const datetime = raw.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/,
  );
  if (datetime) {
    const year = Number(datetime[1]);
    const month = Number(datetime[2]);
    const day = Number(datetime[3]);
    const hour = Number(datetime[4]);
    const minute = Number(datetime[5]);
    const date = new Date(year, month - 1, day, hour, minute, 0, 0);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      throw new Error("তারিখ ও সময় সঠিক নয়");
    }
    return date;
  }

  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    throw new Error("তারিখ ও সময় সঠিক নয়");
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error("তারিখ ও সময় সঠিক নয়");
  }

  return date;
}

export function parsePersonBody(body: unknown): PersonInput {
  if (!body || typeof body !== "object") {
    throw new Error("অবৈধ ডেটা");
  }

  const data = body as Record<string, unknown>;
  const name = optText(data.name);

  if (!name) {
    throw new Error("নাম প্রয়োজন");
  }

  const relationType = data.relationType;
  if (typeof relationType !== "string" || !RELATION_TYPES.has(relationType)) {
    throw new Error("সম্পর্কের ধরন সঠিক নয়");
  }

  const eventTypeRaw = data.eventType ?? "BIRTHDAY";
  if (typeof eventTypeRaw !== "string" || !EVENT_TYPES.has(eventTypeRaw)) {
    throw new Error("ইভেন্টের ধরন সঠিক নয়");
  }
  const eventType = eventTypeRaw as EventType;

  const useExactTime =
    typeof data.useExactTime === "boolean"
      ? data.useExactTime
      : defaultExactTimeForEvent(eventType);

  const isRecurringYearly =
    typeof data.isRecurringYearly === "boolean"
      ? data.isRecurringYearly
      : defaultRecurringForEvent(eventType);

  return {
    name,
    relationType: relationType as RelationType,
    eventType,
    targetDate: parseTargetDate(data.targetDate),
    useExactTime,
    isRecurringYearly,
    coverImageUrl: optText(data.coverImageUrl),
    customBgImageUrl: optText(data.customBgImageUrl),
    customQuote: optText(data.customQuote),
    welcomeMessage: optText(data.welcomeMessage),
    celebrationPopupMessage: optText(data.celebrationPopupMessage),
    preferredThemeId: optText(data.preferredThemeId),
    accessCode: optText(data.accessCode),
    slug: slugifyName(name),
  };
}
