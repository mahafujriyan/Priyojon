import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";
import { QUOTE_SEEDS, buildThemeSeeds } from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding MongoDB...");

  await prisma.accessLog.deleteMany();
  // Keep existing persons — re-seed should not wipe user data
  await prisma.quote.deleteMany();
  await prisma.themeSet.deleteMany();

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@priyojon.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "priyojon2026";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash },
  });

  console.log(`Admin user: ${adminEmail}`);

  const themes = buildThemeSeeds();
  await prisma.themeSet.createMany({ data: themes });
  console.log(`Created ${themes.length} themes`);

  const quoteRows = Object.entries(QUOTE_SEEDS).flatMap(
    ([relationType, quotes]) =>
      quotes.map((q) => ({
        relationType: relationType as keyof typeof QUOTE_SEEDS,
        text: q.text,
        kind: q.kind ?? "DAILY",
        dayOffset: q.dayOffset ?? null,
        milestoneDays: q.milestoneDays ?? null,
      })),
  );

  await prisma.quote.createMany({ data: quoteRows });
  console.log(`Created ${quoteRows.length} quotes`);

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
