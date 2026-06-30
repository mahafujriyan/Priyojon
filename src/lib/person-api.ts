import { Prisma } from "@/generated/prisma/client";
import { buildAccessPath } from "./slug";
import { formatDateForInput, formatDateTimeForInput } from "./date";
import type { Person } from "@/generated/prisma/client";

export function serializePerson(person: Person) {
  return {
    id: person.id,
    name: person.name,
    slug: person.slug,
    relationType: person.relationType,
    eventType: person.eventType,
    targetDate: formatDateForInput(person.targetDate),
    targetDateTime: formatDateTimeForInput(person.targetDate),
    useExactTime: person.useExactTime,
    isRecurringYearly: person.isRecurringYearly,
    accessToken: person.accessToken,
    coverImageUrl: person.coverImageUrl ?? "",
    customBgImageUrl: person.customBgImageUrl ?? "",
    customQuote: person.customQuote ?? "",
    celebrationPopupMessage: person.celebrationPopupMessage ?? "",
    preferredThemeId: person.preferredThemeId ?? "",
    hasAccessCode: Boolean(person.accessCodeHash),
    accessPath: buildAccessPath(person.slug, person.accessToken),
  };
}

export function getApiErrorResponse(err: unknown): {
  status: number;
  message: string;
} {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return {
        status: 409,
        message: "এই তথ্য ইতিমধ্যে আছে — নাম বা লিংক পরিবর্তন করুন",
      };
    }
    if (err.code === "P2025") {
      return { status: 404, message: "প্রিয়জন পাওয়া যায়নি" };
    }
    if (err.code === "P2000") {
      return {
        status: 400,
        message: "কিছু তথ্য খুব বড় — ছোট করে লিখুন",
      };
    }
  }

  if (err instanceof Error) {
    const msg = err.message;

    if (msg.includes("does not exist") || msg.includes("column")) {
      return {
        status: 500,
        message:
          "ডাটাবেস আপডেট দরকার — টার্মিনালে npm run db:schema চালান",
      };
    }

    const validationHints = [
      "নাম প্রয়োজন",
      "জন্মতারিখ",
      "সম্পর্কের ধরন",
      "অবৈধ ডেটা",
      "থিম",
      "গোপন কোড",
    ];
    if (validationHints.some((hint) => msg.includes(hint))) {
      return { status: 400, message: msg };
    }

    return { status: 500, message: msg };
  }

  return { status: 500, message: "আপডেট ব্যর্থ — আবার চেষ্টা করুন" };
}

export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new Error("অবৈধ রিকোয়েস্ট ডেটা");
  }
}
