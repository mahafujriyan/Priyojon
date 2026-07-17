import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execSync } from "node:child_process";

function loadEnvFile() {
  const envPath = resolve(process.cwd(), ".env");
  const content = readFileSync(envPath, "utf8");

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    const raw = trimmed.slice(eq + 1).trim();
    const value = raw.replace(/^["']|["']$/g, "");
    process.env[key] = value;
  }
}

/** Prisma MongoDB requires a database name in the path: /dbname */
function normalizeMongoUrl(url: string): string {
  const parsed = new URL(url);
  const dbName = parsed.pathname.replace(/^\//, "").trim();

  if (!dbName) {
    parsed.pathname = "/priyojon";
  }

  if (!parsed.searchParams.has("retryWrites")) {
    parsed.searchParams.set("retryWrites", "true");
  }
  if (!parsed.searchParams.has("w")) {
    parsed.searchParams.set("w", "majority");
  }

  return parsed.toString();
}

loadEnvFile();

const rawUrl = process.env.DATABASE_URL;
if (!rawUrl) {
  throw new Error("DATABASE_URL is missing from .env");
}

if (!rawUrl.startsWith("mongodb://") && !rawUrl.startsWith("mongodb+srv://")) {
  throw new Error(
    "DATABASE_URL must be a MongoDB URL (mongodb:// or mongodb+srv://)",
  );
}

const url = normalizeMongoUrl(rawUrl);
process.env.DATABASE_URL = url;

const host = new URL(url).hostname;
const dbName = new URL(url).pathname.replace(/^\//, "") || "priyojon";

console.log(`Database: MongoDB → ${host}/${dbName}`);
console.log("Pushing schema...");

execSync("npx prisma db push", {
  stdio: "inherit",
  env: process.env,
});

console.log("Seeding data...");
execSync("npx prisma db seed", {
  stdio: "inherit",
  env: process.env,
});

console.log("Done! MongoDB collections ready.");
