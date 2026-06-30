import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildAccessPath } from "@/lib/slug";
import { buildCountdownPageData } from "@/lib/person-data";
import { DashboardClient } from "@/components/DashboardClient";
import { LogoutButton } from "@/components/LogoutButton";

type PageProps = {
  searchParams: Promise<{ missing?: string }>;
};

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { missing } = await searchParams;

  const persons = await prisma.person.findMany({
    orderBy: { createdAt: "desc" },
  });

  const personItems = persons.map((p) => ({
    id: p.id,
    name: p.name,
    relationType: p.relationType,
    accessPath: buildAccessPath(p.slug, p.accessToken),
    targetDateIso: p.targetDate.toISOString(),
    isRecurringYearly: p.isRecurringYearly,
    coverImageUrl: p.coverImageUrl,
  }));

  const previewData =
    persons.length > 0
      ? await buildCountdownPageData(persons[0].id)
      : null;

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-wider">
              অ্যাডমিন প্যানেল
            </p>
            <h1 className="text-xl font-bold text-zinc-900">ড্যাশবোর্ড</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-zinc-500 hover:text-zinc-800"
            >
              সাইটে যান
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        {missing === "person" && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            এই প্রিয়জন খুঁজে পাওয়া যায়নি — হয়তো মুছে ফেলা হয়েছে বা লিংক পুরনো।
            নতুন করে যোগ করুন অথবা তালিকা থেকে বেছে নিন।
          </div>
        )}
        <DashboardClient persons={personItems} previewData={previewData} />
      </main>
    </div>
  );
}
