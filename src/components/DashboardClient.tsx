"use client";

import { useState } from "react";
import Link from "next/link";
import { CountdownDisplay, type CountdownPageData } from "./CountdownDisplay";
import { RELATION_LABELS } from "@/lib/theme";
import { EVENT_LABELS } from "@/lib/events";
import type { EventType, RelationType } from "@/generated/prisma/client";

type PersonItem = {
  id: string;
  name: string;
  relationType: RelationType;
  eventType: EventType;
  accessPath: string;
  hasAccessCode: boolean;
  visitCount: number;
  uniqueVisitors: number;
  targetDateIso: string;
  isRecurringYearly: boolean;
  coverImageUrl: string | null;
};

type Props = {
  persons: PersonItem[];
  previewData: CountdownPageData | null;
};

export function DashboardClient({ persons, previewData }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(
    persons[0]?.id ?? null,
  );
  const [preview, setPreview] = useState<CountdownPageData | null>(previewData);
  const [loadingPreview, setLoadingPreview] = useState(false);

  async function loadPreview(personId: string) {
    setSelectedId(personId);
    setLoadingPreview(true);
    try {
      const res = await fetch(`/api/persons/${personId}/preview`);
      if (res.ok) {
        const data = await res.json();
        setPreview(data);
      }
    } finally {
      setLoadingPreview(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-800">
            প্রিয়জনের তালিকা ({persons.length})
          </h2>
          <Link
            href="/admin/person/new"
            className="rounded-lg bg-rose-500 px-4 py-2 text-sm text-white hover:bg-rose-600 transition-colors"
          >
            + নতুন যোগ
          </Link>
        </div>

        {persons.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500">
            <p>এখনো কেউ যোগ করা হয়নি।</p>
            <Link
              href="/admin/person/new"
              className="mt-3 inline-block text-rose-500 hover:underline"
            >
              প্রথম প্রিয়জন যোগ করুন
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {persons.map((person) => (
              <li key={person.id}>
                <button
                  onClick={() => loadPreview(person.id)}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${
                    selectedId === person.id
                      ? "border-rose-400 bg-rose-50 ring-1 ring-rose-200"
                      : "border-zinc-200 hover:border-zinc-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-zinc-900">{person.name}</p>
                      <p className="text-sm text-zinc-500">
                        {EVENT_LABELS[person.eventType]} ·{" "}
                        {RELATION_LABELS[person.relationType]}
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">
                        ভিজিট: {person.visitCount} ({person.uniqueVisitors}{" "}
                        ইউনিক)
                        {!person.hasAccessCode && " · কোড সেট করুন"}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link
                        href={`/admin/person/${person.id}/edit`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-zinc-500 hover:underline"
                      >
                        এডিট
                      </Link>
                      <Link
                        href={`/c/${person.accessPath}`}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-rose-500 hover:underline"
                      >
                        লিংক ↗
                      </Link>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 overflow-hidden bg-zinc-100 min-h-[400px]">
        <div className="px-4 py-2 bg-white border-b border-zinc-200 text-sm text-zinc-600">
          প্রিভিউ {loadingPreview && "— লোড হচ্ছে..."}
        </div>
        {preview ? (
          <div className="scale-[0.85] origin-top-left w-[117.6%]">
            <CountdownDisplay data={preview} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-zinc-400">
            প্রিভিউ দেখতে একজনকে বেছে নিন
          </div>
        )}
      </div>
    </div>
  );
}
