import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { parsePersonBody } from "@/lib/person-input";
import {
  getApiErrorResponse,
  readJsonBody,
  serializePerson,
} from "@/lib/person-api";
import { personDataFromInput, resolveAccessCodeHash } from "@/lib/person-mutate";
import { resolvePreferredThemeId } from "@/lib/theme-selection";

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

  return NextResponse.json(serializePerson(person));
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

    const body = await readJsonBody(request);
    const input = parsePersonBody(body);
    const slug =
      input.name.trim() === existing.name.trim()
        ? existing.slug
        : input.slug;
    const preferredThemeId = await resolvePreferredThemeId(
      input.preferredThemeId,
      input.relationType,
      input.eventType,
    );
    const accessCodeHash = await resolveAccessCodeHash(
      input.accessCode,
      existing.accessCodeHash,
      false,
    );

    const person = await prisma.person.update({
      where: { id },
      data: {
        ...personDataFromInput(input),
        slug,
        preferredThemeId,
        accessCodeHash,
      },
    });

    return NextResponse.json(
      serializePerson(person, {
        accessCode: input.accessCode ?? undefined,
      }),
    );
  } catch (err) {
    console.error("Person update error:", err);
    const { status, message } = getApiErrorResponse(err);
    return NextResponse.json({ error: message }, { status });
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
    const { status, message } = getApiErrorResponse(err);
    return NextResponse.json({ error: message }, { status });
  }
}
