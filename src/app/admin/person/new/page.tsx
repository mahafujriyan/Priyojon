import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { PersonForm } from "@/components/PersonForm";

export default async function NewPersonPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

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
            নতুন প্রিয়জন যোগ করুন
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <PersonForm mode="create" />
      </main>
    </div>
  );
}
