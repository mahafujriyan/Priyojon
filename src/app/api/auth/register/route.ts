import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

function resolveLoginEmail(input: string): string {
  const value = input.trim().toLowerCase();
  if (!value) return value;
  if (value.includes("@")) return value;
  return `${value}@priyojon.local`;
}

function verifyMasterCode(input: string): boolean {
  const master = process.env.MASTER_ADMIN_CODE?.trim();
  if (!master) return false;
  return input.trim() === master;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const masterCode = String(body.masterCode ?? "");
    const username = String(body.username ?? "").trim();
    const password = String(body.password ?? "").trim();

    if (!verifyMasterCode(masterCode)) {
      return NextResponse.json(
        { error: "মাস্টার কোড ভুল" },
        { status: 403 },
      );
    }

    if (!username || password.length < 6) {
      return NextResponse.json(
        { error: "ইউজারনেম ও পাসওয়ার্ড (৬+ অক্ষর) দিন" },
        { status: 400 },
      );
    }

    const email = resolveLoginEmail(username);
    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "এই ইউজারনেম ইতিমধ্যে আছে" },
        { status: 409 },
      );
    }

    await prisma.adminUser.create({
      data: {
        email,
        passwordHash: await hashPassword(password),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin register error:", err);
    return NextResponse.json(
      { error: "সার্ভার সমস্যা — আবার চেষ্টা করুন" },
      { status: 500 },
    );
  }
}
