"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { EventType, RelationType } from "@/generated/prisma/client";
import { RELATION_LABELS } from "@/lib/theme";
import {
  EVENT_LABELS,
  defaultExactTimeForEvent,
  defaultRecurringForEvent,
} from "@/lib/events";
import {
  AdminThemeSelect,
  type AdminThemeOption,
} from "@/components/AdminThemeSelect";
import { AdminPublicImagePicker } from "@/components/AdminPublicImagePicker";

type PersonFormData = {
  name: string;
  relationType: RelationType;
  eventType: EventType;
  targetDate: string;
  useExactTime: boolean;
  isRecurringYearly: boolean;
  coverImageUrl: string;
  customBgImageUrl: string;
  customQuote: string;
  celebrationPopupMessage: string;
  preferredThemeId: string;
  accessCode: string;
};

type Props = {
  initial?: Partial<PersonFormData> & {
    id?: string;
    accessPath?: string;
  };
  mode: "create" | "edit";
};

const RELATION_TYPES = Object.keys(RELATION_LABELS) as RelationType[];
const EVENT_TYPES = Object.keys(EVENT_LABELS) as EventType[];

export function PersonForm({ initial, mode }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [themeOptions, setThemeOptions] = useState<AdminThemeOption[]>([]);
  const [themesLoading, setThemesLoading] = useState(false);
  const [publicImages, setPublicImages] = useState<string[]>([]);
  const [imagesLoading, setImagesLoading] = useState(false);

  const [form, setForm] = useState<PersonFormData>({
    name: initial?.name ?? "",
    relationType: initial?.relationType ?? "BEST_FRIEND",
    eventType: initial?.eventType ?? "BIRTHDAY",
    targetDate: initial?.targetDate ?? "",
    useExactTime: initial?.useExactTime ?? false,
    isRecurringYearly: initial?.isRecurringYearly ?? true,
    coverImageUrl: initial?.coverImageUrl ?? "",
    customBgImageUrl: initial?.customBgImageUrl ?? "",
    customQuote: initial?.customQuote ?? "",
    celebrationPopupMessage: initial?.celebrationPopupMessage ?? "",
    preferredThemeId: initial?.preferredThemeId ?? "",
    accessCode: "",
  });

  useEffect(() => {
    let cancelled = false;
    setImagesLoading(true);
    fetch("/api/public-images")
      .then((res) => (res.ok ? res.json() : { images: [] }))
      .then((data: { images: string[] }) => {
        if (!cancelled) setPublicImages(data.images ?? []);
      })
      .finally(() => {
        if (!cancelled) setImagesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadThemes() {
      setThemesLoading(true);
      try {
        const res = await fetch(
          `/api/themes?relationType=${form.relationType}&eventType=${form.eventType}`,
        );
        if (!res.ok) return;
        const data = (await res.json()) as AdminThemeOption[];
        if (!cancelled) {
          setThemeOptions(data);
          setForm((f) => {
            if (
              f.preferredThemeId &&
              !data.some((t) => t.id === f.preferredThemeId)
            ) {
              return { ...f, preferredThemeId: "" };
            }
            return f;
          });
        }
      } finally {
        if (!cancelled) setThemesLoading(false);
      }
    }

    loadThemes();
    return () => {
      cancelled = true;
    };
  }, [form.relationType, form.eventType]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Upload failed");

      setForm((f) => ({ ...f, coverImageUrl: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url =
        mode === "create"
          ? "/api/persons"
          : `/api/persons/${initial?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm("এই প্রিয়জনকে মুছে ফেলতে চান?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/persons/${initial.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Delete failed");
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      {error && (
        <div className="rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          নাম
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400"
          placeholder="প্রিয়জনের নাম"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          ইভেন্টের ধরন
        </label>
        <select
          value={form.eventType}
          onChange={(e) => {
            const eventType = e.target.value as EventType;
            setForm({
              ...form,
              eventType,
              preferredThemeId: "",
              useExactTime: defaultExactTimeForEvent(eventType),
              isRecurringYearly: defaultRecurringForEvent(eventType),
            });
          }}
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400"
        >
          {EVENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {EVENT_LABELS[type]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          সম্পর্কের ধরন
        </label>
        <select
          value={form.relationType}
          onChange={(e) =>
            setForm({
              ...form,
              relationType: e.target.value as RelationType,
              preferredThemeId: "",
            })
          }
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400"
        >
          {RELATION_TYPES.map((type) => (
            <option key={type} value={type}>
              {RELATION_LABELS[type]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          তারিখ ও সময়
        </label>
        <input
          type="datetime-local"
          required
          value={form.targetDate}
          onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
        <p className="text-xs text-zinc-400 mt-1">
          নির্দিষ্ট মিনিটে স্ক্রিনে অটো রিভিল হবে (exact time চালু থাকলে)
        </p>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.useExactTime}
          onChange={(e) =>
            setForm({ ...form, useExactTime: e.target.checked })
          }
          className="h-4 w-4 rounded border-zinc-300 text-rose-500 focus:ring-rose-400"
        />
        <span className="text-sm text-zinc-700">
          নির্দিষ্ট সময়ে রিভিল (মিনিট অনুযায়ী)
        </span>
      </label>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isRecurringYearly}
          onChange={(e) =>
            setForm({ ...form, isRecurringYearly: e.target.checked })
          }
          className="h-4 w-4 rounded border-zinc-300 text-rose-500 focus:ring-rose-400"
        />
        <span className="text-sm text-zinc-700">
          প্রতিবছর পুনরাবৃত্তি (Recurring Yearly)
        </span>
      </label>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          থিম (অ্যাডমিন)
        </label>
        <AdminThemeSelect
          themes={themeOptions}
          value={form.preferredThemeId}
          loading={themesLoading}
          onChange={(preferredThemeId) =>
            setForm({ ...form, preferredThemeId })
          }
        />
        <p className="text-xs text-zinc-400 mt-1">
          ডিফল্ট রাখলে প্রতিদিন অটো থিম বদলাবে
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          ব্যাকগ্রাউন্ড ছবি (public ফোল্ডার)
        </label>
        <AdminPublicImagePicker
          images={publicImages}
          value={form.customBgImageUrl}
          loading={imagesLoading}
          onChange={(customBgImageUrl) =>
            setForm({ ...form, customBgImageUrl })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          গোপন কোড {mode === "create" ? "" : "(নতুন দিতে চাইলে)"}
        </label>
        <input
          type="text"
          required={mode === "create"}
          value={form.accessCode}
          onChange={(e) => setForm({ ...form, accessCode: e.target.value })}
          placeholder={
            mode === "create"
              ? "শুধু তার জন্য সিক্রেট ওয়ার্ড..."
              : "খালি রাখলে পুরনো কোড থাকবে"
          }
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
        <p className="text-xs text-zinc-400 mt-1">
          লিংক + এই কোড ছাড়া কেউ পোর্টাল দেখতে পারবে না
        </p>
        {mode === "edit" && initial?.accessPath && (
          <p className="text-xs text-rose-600 mt-2 break-all">
            ব্যক্তিগত লিংক: /c/{initial.accessPath}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          কভার ছবি
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="w-full text-sm text-zinc-600"
        />
        {uploading && (
          <p className="text-sm text-zinc-500 mt-1">আপলোড হচ্ছে...</p>
        )}
        {form.coverImageUrl && (
          <p className="text-sm text-green-600 mt-1">ছবি আপলোড হয়েছে ✓</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          নিজের বাণি (ঐচ্ছিক)
        </label>
        <textarea
          value={form.customQuote}
          onChange={(e) => setForm({ ...form, customQuote: e.target.value })}
          rows={3}
          placeholder="খালি রাখলে অটো বাণি ব্যাংক থেকে আসবে..."
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
        />
        <p className="text-xs text-zinc-400 mt-1">
          প্রতিদিন নিচের ডকে এই বাণি দেখাবে
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          বিশেষ দিনে পপআপ মেসেজ (ঐচ্ছিক)
        </label>
        <textarea
          value={form.celebrationPopupMessage}
          onChange={(e) =>
            setForm({ ...form, celebrationPopupMessage: e.target.value })
          }
          rows={3}
          placeholder="জন্মদিনে ফোনে উড়ে আসা স্পেশাল মেসেজ..."
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
        />
        <p className="text-xs text-zinc-400 mt-1">
          টার্গেট ডেটে সুন্দর অ্যানিমেশনসহ পপআপ হবে
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-rose-500 px-6 py-2.5 text-white font-medium hover:bg-rose-600 disabled:opacity-50 transition-colors"
        >
          {loading ? "সেভ হচ্ছে..." : mode === "create" ? "যোগ করুন" : "আপডেট"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-zinc-300 px-6 py-2.5 text-zinc-700 hover:bg-zinc-50 transition-colors"
        >
          বাতিল
        </button>
        {mode === "edit" && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-lg border border-red-300 px-6 py-2.5 text-red-600 hover:bg-red-50 transition-colors ml-auto"
          >
            মুছুন
          </button>
        )}
      </div>
    </form>
  );
}
