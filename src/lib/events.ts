import type { EventType } from "@/generated/prisma";

export const EVENT_LABELS: Record<EventType, string> = {
  BIRTHDAY: "জন্মদিন",
  ANNIVERSARY: "বার্ষিকী",
  APOLOGY: "ক্ষমা / Sorry",
  SPECIAL: "বিশেষ দিন",
  CUSTOM: "কাস্টম ইভেন্ট",
};

export const EVENT_CELEBRATION: Record<
  EventType,
  { title: string; subtitle: string }
> = {
  BIRTHDAY: {
    title: "🎂 শুভ জন্মদিন! 🎉",
    subtitle: "আজ তোমার বিশেষ দিন",
  },
  ANNIVERSARY: {
    title: "💍 শুভ বার্ষিকী! 💕",
    subtitle: "আমাদের সুন্দর একটা দিন",
  },
  APOLOGY: {
    title: "🙏 আমার আন্তরিক ক্ষমা",
    subtitle: "তুমি আমার কাছে সবচেয়ে গুরুত্বপূর্ণ",
  },
  SPECIAL: {
    title: "✨ আজ তোমার বিশেষ দিন",
    subtitle: "এই মুহূর্তটা শুধু তোমার জন্য",
  },
  CUSTOM: {
    title: "💌 তোমার জন্য একটা বিশেষ বার্তা",
    subtitle: "সময় এসেছে — এটা তোমার",
  },
};

export const EVENT_OVERLAY_EMOJIS: Record<EventType, string[]> = {
  BIRTHDAY: ["🎂", "🎉", "🎈", "🎁", "🥳", "💖"],
  ANNIVERSARY: ["💍", "💕", "🥂", "✨", "🌹", "💐"],
  APOLOGY: ["🙏", "💐", "🕊️", "💌", "🤍", "🌸"],
  SPECIAL: ["✨", "⭐", "💫", "🌟", "🎊", "💝"],
  CUSTOM: ["💌", "✨", "💖", "🌸", "🦋", "☀️"],
};

export function defaultExactTimeForEvent(eventType: EventType): boolean {
  return eventType !== "BIRTHDAY";
}

export function defaultRecurringForEvent(eventType: EventType): boolean {
  return eventType === "BIRTHDAY";
}
