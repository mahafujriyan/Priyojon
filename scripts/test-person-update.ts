import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "../src/generated/prisma";
import { parsePersonBody } from "../src/lib/person-input";

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

const id = process.argv[2];
if (!id) {
  console.error("Usage: tsx scripts/test-person-update.ts <personId>");
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  const person = await prisma.person.findUnique({ where: { id } });
  if (!person) {
    console.log("Person not found:", id);
    return;
  }

  console.log("Found:", person.name);

  const input = parsePersonBody({
    name: person.name,
    relationType: person.relationType,
    targetDate: "2000-07-15",
    isRecurringYearly: true,
    coverImageUrl: person.coverImageUrl ?? "",
    customQuote: "তোমার হাসিটা মাথা থেকে সহজে যায় না।",
    celebrationPopupMessage: "শুভ জন্মদিন!",
  });

  const updated = await prisma.person.update({
    where: { id },
    data: {
      name: input.name,
      slug: input.slug,
      relationType: input.relationType,
      targetDate: input.targetDate,
      isRecurringYearly: input.isRecurringYearly,
      coverImageUrl: input.coverImageUrl,
      customQuote: input.customQuote,
      celebrationPopupMessage: input.celebrationPopupMessage,
    },
  });

  console.log("Update OK:", updated.id, updated.customQuote);
}

main()
  .catch((e) => {
    console.error("FAILED:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
