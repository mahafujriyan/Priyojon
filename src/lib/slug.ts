import { customAlphabet } from "nanoid";

const tokenAlphabet = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  10,
);

export function slugifyName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "person";

  const latin = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);

  if (latin) return latin;

  const bengali = trimmed
    .toLowerCase()
    .replace(/[^\w\s\u0980-\u09FF-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);

  return bengali || "person";
}

export function generateAccessToken(): string {
  return tokenAlphabet();
}

export function buildAccessPath(slug: string, token: string): string {
  return `${slug}-${token}`;
}

export function buildPrivatePortalPath(
  slug: string,
  token: string,
  code: string,
): string {
  const accessPath = buildAccessPath(slug, token);
  return `/c/${accessPath}/${encodeURIComponent(code.trim())}`;
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
