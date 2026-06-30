import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateAccessToken } from "@/lib/slug";
import { parsePersonBody } from "@/lib/person-input";
import {
  getApiErrorResponse,
  readJsonBody,
  serializePerson,
} from "@/lib/person-api";
import { resolvePreferredThemeId } from "@/lib/theme-selection";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const persons = await prisma.person.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(persons.map(serializePerson));
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await readJsonBody(request);
    const input = parsePersonBody(body);
    const accessToken = generateAccessToken();
    const preferredThemeId = await resolvePreferredThemeId(
      input.preferredThemeId,
      input.relationType,
    );

    const person = await prisma.person.create({
      data: {
        name: input.name,
        slug: input.slug,
        relationType: input.relationType,
        targetDate: input.targetDate,
        isRecurringYearly: input.isRecurringYearly,
        accessToken,
        coverImageUrl: input.coverImageUrl,
        customQuote: input.customQuote,
        celebrationPopupMessage: input.celebrationPopupMessage,
        preferredThemeId,
      },
    });

    return NextResponse.json(serializePerson(person));
  } catch (err) {
    console.error("Person create error:", err);
    const { status, message } = getApiErrorResponse(err);
    return NextResponse.json({ error: message }, { status });
  }
}
