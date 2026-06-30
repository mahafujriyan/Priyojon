import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PersonForm } from "@/components/PersonForm";
import { formatDateTimeForInput } from "@/lib/date";
import { buildAccessPath } from "@/lib/slug";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditPersonPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const person = await prisma.person.findUnique({ where: { id } });

  if (!person) {
    redirect("/admin/dashboard?missing=person");
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link
            href="/admin/dashboard"
            className="text-sm text-rose-500 hover:underline"
          >
            ← ড্যাশবোর্ড
          </Link>
          <h1 className="text-xl font-bold text-zinc-900 mt-1">
            {person.name} — সম্পাদনা
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <PersonForm
          mode="edit"
          initial={{
            id: person.id,
            name: person.name,
            relationType: person.relationType,
            eventType: person.eventType,
            targetDate: formatDateTimeForInput(person.targetDate),
            useExactTime: person.useExactTime,
            isRecurringYearly: person.isRecurringYearly,
            coverImageUrl: person.coverImageUrl ?? "",
            customBgImageUrl: person.customBgImageUrl ?? "",
            customQuote: person.customQuote ?? "",
            celebrationPopupMessage: person.celebrationPopupMessage ?? "",
            preferredThemeId: person.preferredThemeId ?? "",
            accessPath: buildAccessPath(person.slug, person.accessToken),
          }}
        />
      </main>
    </div>
  );
}
