import type { RelationType } from "@/generated/prisma/client";
import { slugifyName } from "./slug";

const RELATION_TYPES = new Set<string>([
  "GIRLFRIEND_BOYFRIEND",
  "BEST_FRIEND",
  "CLOSE_FRIEND",
  "FAMILY",
  "CRUSH",
  "CUSTOM",
]);

export type PersonInput = {
  name: string;
  relationType: RelationType;
  targetDate: Date;
  isRecurringYearly: boolean;
  coverImageUrl: string | null;
  customQuote: string | null;
  celebrationPopupMessage: string | null;
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
    throw new Error("জন্মতারিখ প্রয়োজন");
  }

  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    throw new Error("জন্মতারিখ সঠিক নয়");
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
    throw new Error("জন্মতারিখ সঠিক নয়");
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

  return {
    name,
    relationType: relationType as RelationType,
    targetDate: parseTargetDate(data.targetDate),
    isRecurringYearly: data.isRecurringYearly !== false,
    coverImageUrl: optText(data.coverImageUrl),
    customQuote: optText(data.customQuote),
    celebrationPopupMessage: optText(data.celebrationPopupMessage),
    slug: slugifyName(name),
  };
}
