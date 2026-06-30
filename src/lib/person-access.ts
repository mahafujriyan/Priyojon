import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const UNLOCK_DURATION = 60 * 60 * 24 * 365;

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

function unlockCookieName(personId: string) {
  return `priyojon_unlock_${personId}`;
}

export async function setPersonUnlock(personId: string): Promise<void> {
  const token = await new SignJWT({ personId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${UNLOCK_DURATION}s`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(unlockCookieName(personId), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: UNLOCK_DURATION,
    path: "/",
  });
}

export async function hasPersonUnlock(personId: string): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(unlockCookieName(personId))?.value;
  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.personId === personId;
  } catch {
    return false;
  }
}

export async function clearPersonUnlock(personId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(unlockCookieName(personId));
}
