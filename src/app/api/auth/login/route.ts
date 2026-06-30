import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";

function resolveLoginEmail(input: string): string {
  const value = input.trim().toLowerCase();
  if (!value) return value;
  if (value.includes("@")) return value;
  return `${value}@priyojon.local`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawUsername = body.username ?? body.email ?? "";
    const password = String(body.password ?? "").trim();

    if (!rawUsername || !password) {
      return NextResponse.json(
        { error: "ইউজারনেম ও পাসওয়ার্ড দিন" },
        { status: 400 },
      );
    }

    const email = resolveLoginEmail(String(rawUsername));

    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
      return NextResponse.json(
        { error: "ভুল ইউজারনেম বা পাসওয়ার্ড" },
        { status: 401 },
      );
    }

    await createSession(email);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "সার্ভার সমস্যা — আবার চেষ্টা করুন" },
      { status: 500 },
    );
  }
}
