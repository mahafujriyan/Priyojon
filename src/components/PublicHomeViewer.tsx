"use client";

import { useState } from "react";
import Link from "next/link";
import { CountdownDisplay, type CountdownPageData } from "./CountdownDisplay";
import { QuoteDock } from "./QuoteDock";
import { SiteLogo } from "./SiteLogo";

type PersonItem = {
  id: string;
  name: string;
  accessPath: string;
};

type Props = {
  persons: PersonItem[];
  initialPreview: CountdownPageData | null;
};

export function PublicHomeViewer({ persons, initialPreview }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(
    persons[0]?.id ?? null,
  );
  const [preview, setPreview] = useState<CountdownPageData | null>(
    initialPreview,
  );
  const [loading, setLoading] = useState(false);

  async function selectPerson(personId: string) {
    if (personId === selectedId) return;
    setSelectedId(personId);
    setLoading(true);
    try {
      const res = await fetch(`/api/public/persons/${personId}/preview`);
      if (res.ok) {
        setPreview(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }

  if (persons.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 bg-gradient-to-br from-rose-50 via-white to-violet-50">
        <main className="max-w-md text-center space-y-4">
          <div className="flex justify-center">
            <SiteLogo href={null} size={80} showName={false} />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900">প্রিয়জন কাউন্টডাউন</h1>
          <p className="text-zinc-500">
            এখনো কাউন্টডাউন সেট করা হয়নি। অ্যাডমিন প্যানেল থেকে প্রিয়জন যোগ করুন।
          </p>
          <Link
            href="/admin/login"
            className="inline-block mt-4 rounded-xl bg-rose-500 px-6 py-2.5 text-white text-sm font-medium hover:bg-rose-600"
          >
            অ্যাডমিন লগইন
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col min-h-screen">
      {loading && (
        <div className="absolute inset-0 z-30 bg-black/10 backdrop-blur-[1px] pointer-events-none" />
      )}

      {preview ? (
        <CountdownDisplay
          key={`${preview.personId}-${preview.dateKey}`}
          data={preview}
          showQuote={false}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center text-white/60">
          লোড হচ্ছে...
        </div>
      )}

      <QuoteDock
        persons={persons}
        selectedId={selectedId}
        quoteText={preview?.quote?.text ?? null}
        onSelect={selectPerson}
      />
    </div>
  );
}
