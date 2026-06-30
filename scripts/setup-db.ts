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

loadEnvFile();

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is missing from .env");
}

const parsed = new URL(url);
console.log(
  `Database: ${parsed.hostname}:${parsed.port || "5432"}${parsed.pathname}`,
);
console.log("Pushing schema...");

execSync("npx prisma db push --accept-data-loss", {
  stdio: "inherit",
  env: process.env,
});

console.log("Seeding data...");
execSync("npx prisma db seed", {
  stdio: "inherit",
  env: process.env,
});

console.log("Done! Tables ready.");
