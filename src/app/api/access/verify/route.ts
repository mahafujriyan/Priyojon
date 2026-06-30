import { NextResponse } from "next/server";
import { parseAccessPath } from "@/lib/slug";
import { findPersonByAccess } from "@/lib/person-data";
import { verifyPassword } from "@/lib/auth";
import { setPersonUnlock } from "@/lib/person-access";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const accessPath =
      typeof body.accessPath === "string" ? body.accessPath.trim() : "";
    const code = typeof body.code === "string" ? body.code.trim() : "";

    if (!accessPath || !code) {
      return NextResponse.json(
        { error: "লিংক ও গোপন কোড দিন" },
        { status: 400 },
      );
    }

    const parsed = parseAccessPath(accessPath);
    if (!parsed) {
      return NextResponse.json({ error: "লিংক সঠিক নয়" }, { status: 404 });
    }

    const person = await findPersonByAccess(parsed.slug, parsed.token);
    if (!person) {
      return NextResponse.json({ error: "পেজ পাওয়া যায়নি" }, { status: 404 });
    }

    if (!person.accessCodeHash) {
      return NextResponse.json(
        { error: "এই পেজের গোপন কোড এখনো সেট করা হয়নি" },
        { status: 403 },
      );
    }

    const valid = await verifyPassword(code, person.accessCodeHash);
    if (!valid) {
      return NextResponse.json(
        { error: "গোপন কোড ভুল — আবার চেষ্টা করুন" },
        { status: 401 },
      );
    }

    await setPersonUnlock(person.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Access verify error:", err);
    return NextResponse.json(
      { error: "সার্ভার সমস্যা — আবার চেষ্টা করুন" },
      { status: 500 },
    );
  }
}
