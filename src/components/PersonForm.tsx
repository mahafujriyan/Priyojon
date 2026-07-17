"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { EventType, RelationType } from "@/generated/prisma";
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
import { slugifyName } from "@/lib/slug";

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
  welcomeMessage: string;
  celebrationPopupMessage: string;
  celebrationPopupImageUrl: string;
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
  const [savedPortalPath, setSavedPortalPath] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingPopup, setUploadingPopup] = useState(false);
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
    welcomeMessage: initial?.welcomeMessage ?? "",
    celebrationPopupMessage: initial?.celebrationPopupMessage ?? "",
    celebrationPopupImageUrl: initial?.celebrationPopupImageUrl ?? "",
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

  async function uploadImage(
    file: File,
    field: "coverImageUrl" | "celebrationPopupImageUrl",
  ) {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Upload failed");
    setForm((f) => ({ ...f, [field]: data.url as string }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      await uploadImage(file, "coverImageUrl");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handlePopupImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPopup(true);
    setError("");

    try {
      await uploadImage(file, "celebrationPopupImageUrl");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingPopup(false);
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

      if (data.privatePortalPath) {
        setSavedPortalPath(data.privatePortalPath);
        return;
      }

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
      {savedPortalPath && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 space-y-3">
          <p className="text-sm font-medium text-emerald-800">
            প্রিয়জন যোগ হয়েছে! এই লিংকটি পাঠাও:
          </p>
          <p className="text-xs font-mono break-all text-emerald-900 bg-white rounded-lg p-3 border border-emerald-100">
            {savedPortalPath}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(savedPortalPath)}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
            >
              কপি করুন
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/dashboard")}
              className="rounded-lg border border-emerald-300 px-4 py-2 text-sm text-emerald-800 hover:bg-emerald-100"
            >
              ড্যাশবোর্ডে যান
            </button>
          </div>
        </div>
      )}

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
          লিংক + কোড একসাথে পাঠাও — একবার খুললে আর কোড লাগবে না
        </p>
        {form.name.trim() && mode === "create" && (
          <p className="text-xs text-zinc-600 mt-2 break-all font-mono bg-zinc-50 rounded-lg p-2 border border-zinc-200">
            লিংক হবে: /c/{slugifyName(form.name)}-
            <span className="text-rose-500">র্যান্ডম১০</span>
            {form.accessCode.trim()
              ? `/${encodeURIComponent(form.accessCode.trim())}`
              : "/[গোপন-কোড]"}
          </p>
        )}
        {mode === "edit" && initial?.accessPath && (
          <p className="text-xs text-rose-600 mt-2 break-all font-mono bg-rose-50 rounded-lg p-2">
            ব্যক্তিগত লিংক: /c/{initial.accessPath}
            {form.accessCode.trim()
              ? `/${encodeURIComponent(form.accessCode.trim())}`
              : "/[গোপন-কোড]"}
          </p>
        )}
        {form.accessCode && mode === "create" && (
          <p className="text-xs text-zinc-500 mt-2">
            সেভ করলে নাম + র্যান্ডম কোড দিয়ে পূর্ণ লিংক তৈরি হবে
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

      <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4 space-y-2">
        <p className="text-sm font-medium text-rose-800">বার্তা সম্পর্কে জানো</p>
        <ul className="text-xs text-rose-700/80 space-y-1.5 list-disc list-inside leading-relaxed">
          <li>
            <strong>স্বাগত বার্তা</strong> — কোড দিয়ে প্রথমবার ঢুকলে সুন্দর
            অ্যানিমেশনসহ দেখাবে
          </li>
          <li>
            <strong>নিজের বাণি</strong> — পেজে প্রতিদিন নিচে দেখায়
          </li>
          <li>
            <strong>বিশেষ দিন পপআপ</strong> — টার্গেট তারিখে ছবি + মেসেজ সহ
            ফোনে উড়ে আসে
          </li>
        </ul>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          স্বাগত বার্তা (ঐচ্ছিক)
        </label>
        <textarea
          value={form.welcomeMessage}
          onChange={(e) =>
            setForm({ ...form, welcomeMessage: e.target.value })
          }
          rows={3}
          placeholder="খালি রাখলে অটো সুন্দর স্বাগত বার্তা তৈরি হবে..."
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
        />
        <p className="text-xs text-zinc-400 mt-1">
          প্রথমবার পোর্টালে ঢুকলে নামসহ এই বার্তা দেখাবে — মোবাইলেও সুন্দর
          দেখায়
        </p>
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
        <p className="text-xs text-zinc-400 mt-1 mb-3">
          টার্গেট ডেটে সুন্দর অ্যানিমেশনসহ পপআপ হবে
        </p>

        <label className="block text-sm font-medium text-zinc-700 mb-1">
          বিশেষ দিনের পপআপ ছবি (ঐচ্ছিক)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePopupImageUpload}
          disabled={uploadingPopup}
          className="w-full text-sm text-zinc-600"
        />
        {uploadingPopup && (
          <p className="text-sm text-zinc-500 mt-1">ছবি আপলোড হচ্ছে...</p>
        )}
        {form.celebrationPopupImageUrl && (
          <div className="mt-2 space-y-2">
            <p className="text-sm text-green-600">পপআপ ছবি আপলোড হয়েছে ✓</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.celebrationPopupImageUrl}
              alt="Popup preview"
              className="h-28 w-full max-w-xs object-cover rounded-xl border border-zinc-200"
            />
            <button
              type="button"
              onClick={() =>
                setForm({ ...form, celebrationPopupImageUrl: "" })
              }
              className="text-xs text-red-500 hover:underline"
            >
              ছবি সরান
            </button>
          </div>
        )}
        <p className="text-xs text-zinc-400 mt-1">
          খালি রাখলে কভার ছবি থাকলে সেটা পপআপে দেখাবে
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
