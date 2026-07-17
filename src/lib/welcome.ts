import type { EventType } from "@/generated/prisma";

const WELCOME_BY_EVENT: Record<EventType, (name: string) => string> = {
  BIRTHDAY: (name) =>
    `${name}, তোমার জন্য একটা গোপন জগৎ তৈরি করা হয়েছে। তোমার বিশেষ দিনের কাউন্টডাউন শুরু — প্রতিটা সেকেন্ড শুধু তোমার জন্য।`,
  ANNIVERSARY: (name) =>
    `${name}, আমাদের সুন্দর একটা গল্পের কাউন্টডাউন শুরু। এই পোর্টাল শুধু তোমার আর আমার — আমাদের বিশেষ দিনের অপেক্ষায়।`,
  APOLOGY: (name) =>
    `${name}, তোমার কাছে কিছু বলার আছে। এই পোর্টাল শুধু তোমার জন্য — সময় যখন মিলবে, ভিতরে ঢুকো।`,
  SPECIAL: (name) =>
    `${name}, তোমার জন্য একটা বিশেষ সারপ্রাইজ অপেক্ষা করছে। কাউন্টডাউন শেষ হলে জানতে পারবে কতটা বিশেষ তুমি।`,
  CUSTOM: (name) =>
    `${name}, তোমার জন্য তৈরি এক ব্যক্তিগত পোর্টালে স্বাগতম। এটা শুধু তোমার — ধীরে ধীরে সময় গুনতে থাকো।`,
};

export function buildDefaultWelcomeMessage(
  name: string,
  eventType: EventType,
): string {
  return WELCOME_BY_EVENT[eventType](name.trim() || "প্রিয়জন");
}

export function resolveWelcomeMessage(person: {
  name: string;
  eventType: EventType;
  welcomeMessage?: string | null;
}): string {
  const custom = person.welcomeMessage?.trim();
  if (custom) return custom;
  return buildDefaultWelcomeMessage(person.name, person.eventType);
}
