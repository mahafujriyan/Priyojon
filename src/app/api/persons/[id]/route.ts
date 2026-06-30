import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { buildAccessPath } from "@/lib/slug";
import { parsePersonBody } from "@/lib/person-input";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const person = await prisma.person.findUnique({ where: { id } });

  if (!person) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...person,
    accessPath: buildAccessPath(person.slug, person.accessToken),
    targetDate: person.targetDate.toISOString().split("T")[0],
    customQuote: person.customQuote ?? "",
    celebrationPopupMessage: person.celebrationPopupMessage ?? "",
  });
}

export async function PUT(request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const existing = await prisma.person.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "প্রিয়জন পাওয়া যায়নি" }, { status: 404 });
    }

    const body = await request.json();
    const input = parsePersonBody(body);

    const person = await prisma.person.update({
      where: { id },
      data: {
        name: input.name,
        slug: input.slug,
        relationType: input.relationType,
        targetDate: input.targetDate,
        isRecurringYearly: input.isRecurringYearly,
        coverImageUrl: input.coverImageUrl,
        customQuote: input.customQuote,
        celebrationPopupMessage: input.celebrationPopupMessage,
      },
    });

    return NextResponse.json({
      ...person,
      accessPath: buildAccessPath(person.slug, person.accessToken),
      targetDate: person.targetDate.toISOString().split("T")[0],
    });
  } catch (err) {
    console.error("Person update error:", err);
    const message =
      err instanceof Error ? err.message : "আপডেট ব্যর্থ";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    await prisma.person.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Person delete error:", err);
    return NextResponse.json({ error: "মুছে ফেলা ব্যর্থ" }, { status: 500 });
  }
}
