import { mkdir, writeFile, copyFile, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { THEME_IMAGE_SOURCES } from "../src/lib/theme-images";
import type { RelationType } from "../src/generated/prisma";

const FOLDERS: Record<RelationType, string> = {
  GIRLFRIEND_BOYFRIEND: "girlfriend-boyfriend",
  BEST_FRIEND: "best-friend",
  CLOSE_FRIEND: "close-friend",
  FAMILY: "family",
  CRUSH: "crush",
  CUSTOM: "custom",
};

const ALL_FILES = [
  ...Array.from({ length: 7 }, (_, i) => `daily-${String(i + 1).padStart(2, "0")}.jpg`),
  "milestone-30.jpg",
  "milestone-7.jpg",
  "milestone-3.jpg",
  "milestone-1.jpg",
  "celebration.jpg",
];

async function download(url: string, dest: string) {
  await mkdir(dirname(dest), { recursive: true });
  const res = await fetch(url, {
    headers: { "User-Agent": "priyojon-countdown-setup/1.0" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  console.log(`  ok ${dest.replace(process.cwd(), "")}`);
}

async function fileExists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function downloadSafe(url: string, dest: string) {
  try {
    await download(url, dest);
  } catch (err) {
    console.warn(`  skip — ${err instanceof Error ? err.message : err}`);
  }
}

async function fillMissing(folderPath: string) {
  const fallback = resolve(folderPath, "daily-01.jpg");
  if (!(await fileExists(fallback))) return;

  for (const file of ALL_FILES) {
    const dest = resolve(folderPath, file);
    if (!(await fileExists(dest))) {
      await copyFile(fallback, dest);
      console.log(`  fallback ${file}`);
    }
  }
}

async function main() {
  const base = resolve(process.cwd(), "public", "themes");
  console.log("Downloading theme images to public/themes/...\n");

  for (const [type, folder] of Object.entries(FOLDERS) as [
    RelationType,
    string,
  ][]) {
    const src = THEME_IMAGE_SOURCES[type];
    const folderPath = resolve(base, folder);
    console.log(folder);

    for (let i = 0; i < src.daily.length; i++) {
      const day = String(i + 1).padStart(2, "0");
      await downloadSafe(
        src.daily[i],
        resolve(folderPath, `daily-${day}.jpg`),
      );
    }

    for (const [days, url] of Object.entries(src.milestone)) {
      await downloadSafe(url, resolve(folderPath, `milestone-${days}.jpg`));
    }

    await downloadSafe(src.celebration, resolve(folderPath, "celebration.jpg"));
    await fillMissing(folderPath);
  }

  console.log("\nDone! Replace any image in public/themes/ with your own.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
