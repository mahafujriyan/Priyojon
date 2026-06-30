import { NextResponse } from "next/server";
import { buildAccessPath } from "@/lib/slug";
import { findPersonByAccessCode } from "@/lib/person-data";
import { setPersonUnlock } from "@/lib/person-access";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = typeof body.code === "string" ? body.code.trim() : "";

    if (!code) {
      return NextResponse.json({ error: "গোপন কোড দিন" }, { status: 400 });
    }

    const person = await findPersonByAccessCode(code);
    if (!person) {
      return NextResponse.json(
        { error: "গোপন কোড ভুল — আবার চেষ্টা করুন" },
        { status: 401 },
      );
    }

    await setPersonUnlock(person.id);

    const accessPath = buildAccessPath(person.slug, person.accessToken);
    return NextResponse.json({ success: true, accessPath, personId: person.id });
  } catch (err) {
    console.error("Access verify-code error:", err);
    return NextResponse.json(
      { error: "সার্ভার সমস্যা — আবার চেষ্টা করুন" },
      { status: 500 },
    );
  }
}
