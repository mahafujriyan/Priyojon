import { readFileSync } from "node:fs";
import { resolve } from "node:path";

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
    process.env[key] = raw.replace(/^["']|["']$/g, "");
  }
}

loadEnvFile();

const base = process.env.TEST_BASE_URL ?? "http://localhost:3000";
const id = "cmr14ernt000080kqszzb8ymx";

async function main() {
  const loginRes = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "priyojon2026" }),
  });
  console.log("Login:", loginRes.status);
  const cookie = loginRes.headers.getSetCookie?.() ?? [];
  const sessionCookie = cookie.find((c) => c.startsWith("priyojon_admin_session="));
  if (!sessionCookie) {
    console.error("No session cookie", await loginRes.text());
    process.exit(1);
  }

  const cookieHeader = sessionCookie.split(";")[0];

  const body = {
    name: "Faru",
    relationType: "GIRLFRIEND_BOYFRIEND",
    targetDate: "2000-07-15",
    isRecurringYearly: true,
    coverImageUrl: "",
    customQuote: "test quote",
    celebrationPopupMessage: "happy bday",
  };

  const putRes = await fetch(`${base}/api/persons/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
    body: JSON.stringify(body),
  });

  const text = await putRes.text();
  console.log("PUT:", putRes.status, text);
}

main().catch(console.error);
