import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { parseAccessPath } from "@/lib/slug";
import { findPersonByAccess } from "@/lib/person-data";
import { verifyPassword } from "@/lib/auth";
import { hasPersonUnlock, setPersonUnlock } from "@/lib/person-access";

type PageProps = {
  params: Promise<{ accessPath: string; portalCode: string }>;
};

export const metadata: Metadata = {
  title: "প্রবেশ হচ্ছে — প্রিয়জন",
  robots: { index: false, follow: false },
};

export default async function PortalCodeEntryPage({ params }: PageProps) {
  const { accessPath, portalCode } = await params;
  const parsed = parseAccessPath(accessPath);

  if (!parsed) notFound();

  const person = await findPersonByAccess(parsed.slug, parsed.token);
  if (!person?.accessCodeHash) notFound();

  if (await hasPersonUnlock(person.id)) {
    redirect(`/c/${accessPath}`);
  }

  let code: string;
  try {
    code = decodeURIComponent(portalCode);
  } catch {
    redirect(`/c/${accessPath}`);
  }

  const valid = await verifyPassword(code, person.accessCodeHash);
  if (valid) {
    await setPersonUnlock(person.id);
  }

  redirect(`/c/${accessPath}`);
}
