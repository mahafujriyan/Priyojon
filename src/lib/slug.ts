import { customAlphabet } from "nanoid";

const tokenAlphabet = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  8,
);

export function slugifyName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^\w\s\u0980-\u09FF-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "person";
}

export function generateAccessToken(): string {
  return tokenAlphabet();
}

export function buildAccessPath(slug: string, token: string): string {
  return `${slug}-${token}`;
}

export function parseAccessPath(accessPath: string): {
  slug: string;
  token: string;
} | null {
  const lastDash = accessPath.lastIndexOf("-");
  if (lastDash <= 0) return null;
  return {
    slug: accessPath.slice(0, lastDash),
    token: accessPath.slice(lastDash + 1),
  };
}
