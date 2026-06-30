import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { parseAccessPath } from "@/lib/slug";
import {
  buildCountdownPageDataByAccess,
  findPersonByAccess,
} from "@/lib/person-data";
import { hasPersonUnlock } from "@/lib/person-access";
import { CountdownPortal } from "@/components/CountdownPortal";
import { AccessCodeNotSet } from "@/components/AccessCodeNotSet";

type PageProps = { params: Promise<{ accessPath: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { accessPath } = await params;
  const parsed = parseAccessPath(accessPath);
  if (!parsed) return { title: "প্রিয়জন কাউন্টডাউন" };

  const person = await findPersonByAccess(parsed.slug, parsed.token);

  return {
    title: person ? `${person.name} — কাউন্টডাউন` : "প্রিয়জন কাউন্টডাউন",
    robots: { index: false, follow: false },
  };
}

export default async function CountdownPage({ params }: PageProps) {
  const { accessPath } = await params;
  const parsed = parseAccessPath(accessPath);

  if (!parsed) notFound();

  const person = await findPersonByAccess(parsed.slug, parsed.token);
  if (!person) notFound();

  if (!person.accessCodeHash) {
    return <AccessCodeNotSet personName={person.name} />;
  }

  const unlocked = await hasPersonUnlock(person.id);

  const data = unlocked
    ? await buildCountdownPageDataByAccess(parsed.slug, parsed.token, {
        logView: true,
        visitorKey: person.id,
      })
    : null;

  return (
    <CountdownPortal
      accessPath={accessPath}
      personName={person.name}
      eventType={person.eventType}
      unlocked={unlocked}
      data={data}
    />
  );
}
