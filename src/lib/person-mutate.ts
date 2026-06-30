import { hashPassword } from "./auth";
import type { PersonInput } from "./person-input";

export async function resolveAccessCodeHash(
  accessCode: string | null,
  existingHash: string | null,
  isCreate: boolean,
): Promise<string | null> {
  if (accessCode) {
    return hashPassword(accessCode);
  }

  if (existingHash) {
    return existingHash;
  }

  if (isCreate) {
    throw new Error("গোপন কোড প্রয়োজন");
  }

  throw new Error("নতুন গোপন কোড দিন");
}

export function personDataFromInput(input: PersonInput) {
  return {
    name: input.name,
    slug: input.slug,
    relationType: input.relationType,
    eventType: input.eventType,
    targetDate: input.targetDate,
    useExactTime: input.useExactTime,
    isRecurringYearly: input.isRecurringYearly,
    coverImageUrl: input.coverImageUrl,
    customBgImageUrl: input.customBgImageUrl,
    customQuote: input.customQuote,
    welcomeMessage: input.welcomeMessage,
    celebrationPopupMessage: input.celebrationPopupMessage,
  };
}
