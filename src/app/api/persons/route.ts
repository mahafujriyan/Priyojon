import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  slugifyName,
  generateAccessToken,
  buildAccessPath,
} from "@/lib/slug";
import { parsePersonBody } from "@/lib/person-input";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const persons = await prisma.person.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    persons.map((p) => ({
      ...p,
      accessPath: buildAccessPath(p.slug, p.accessToken),
      targetDateIso: p.targetDate.toISOString(),
      targetDate: p.targetDate.toISOString().split("T")[0],
      customQuote: p.customQuote ?? "",
      celebrationPopupMessage: p.celebrationPopupMessage ?? "",
    })),
  );
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const input = parsePersonBody(body);
    const accessToken = generateAccessToken();

    const person = await prisma.person.create({
      data: {
        name: input.name,
        slug: input.slug || slugifyName(input.name),
        relationType: input.relationType,
        targetDate: input.targetDate,
        isRecurringYearly: input.isRecurringYearly,
        accessToken,
        coverImageUrl: input.coverImageUrl,
        customQuote: input.customQuote,
        celebrationPopupMessage: input.celebrationPopupMessage,
      },
    });

    return NextResponse.json({
      ...person,
      accessPath: buildAccessPath(person.slug, person.accessToken),
    });
  } catch (err) {
    console.error("Person create error:", err);
    const message =
      err instanceof Error ? err.message : "তৈরি ব্যর্থ";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
