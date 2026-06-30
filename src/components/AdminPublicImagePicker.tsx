"use client";

import Image from "next/image";

type Props = {
  images: string[];
  value: string;
  onChange: (url: string) => void;
  loading?: boolean;
};

export function AdminPublicImagePicker({
  images,
  value,
  onChange,
  loading,
}: Props) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => onChange("")}
        className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm ${
          !value
            ? "border-rose-400 bg-rose-50 text-rose-700"
            : "border-zinc-300 hover:border-zinc-400"
        }`}
      >
        ডিফল্ট থিম ছবি
      </button>

      {loading ? (
        <p className="text-sm text-zinc-500">ছবি লোড হচ্ছে...</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
          {images.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => onChange(src)}
              className={`relative aspect-video rounded-lg overflow-hidden ring-2 ${
                value === src
                  ? "ring-rose-400"
                  : "ring-zinc-200 hover:ring-zinc-400"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="120px"
                loading="lazy"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
