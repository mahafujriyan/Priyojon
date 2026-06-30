import { NextResponse } from "next/server";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { getSession } from "@/lib/auth";

const IMAGE_EXT = /\.(jpg|jpeg|png|webp|gif)$/i;

function collectImages(dir: string, urlPrefix: string): string[] {
  const results: string[] = [];

  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return results;
  }

  for (const entry of entries) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...collectImages(full, `${urlPrefix}/${entry}`));
    } else if (IMAGE_EXT.test(entry)) {
      results.push(`${urlPrefix}/${entry}`.replace(/\\/g, "/"));
    }
  }

  return results;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const root = join(process.cwd(), "public");
  const themes = collectImages(join(root, "themes"), "/themes");
  const uploads = collectImages(join(root, "uploads"), "/uploads");

  return NextResponse.json({
    images: [...themes, ...uploads].sort(),
  });
}
