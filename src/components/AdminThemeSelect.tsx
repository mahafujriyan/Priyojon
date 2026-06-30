"use client";

import Image from "next/image";

export type AdminThemeOption = {
  id: string;
  label: string;
  bgImageUrl: string | null;
  gradient: string;
};

type Props = {
  themes: AdminThemeOption[];
  value: string;
  onChange: (themeId: string) => void;
  loading?: boolean;
};

export function AdminThemeSelect({ themes, value, onChange, loading }: Props) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => onChange("")}
        className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
          !value
            ? "border-rose-400 bg-rose-50 text-rose-700"
            : "border-zinc-300 hover:border-zinc-400"
        }`}
      >
        ডিফল্ট (অটো রোটেশন)
      </button>

      {loading ? (
        <p className="text-sm text-zinc-500">থিম লোড হচ্ছে...</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {themes.map((theme) => {
            const selected = value === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onChange(theme.id)}
                className={`relative aspect-[4/5] rounded-xl overflow-hidden ring-2 transition-all ${
                  selected
                    ? "ring-rose-400 scale-[1.02]"
                    : "ring-zinc-200 hover:ring-zinc-400"
                }`}
                title={theme.label}
              >
                {theme.bgImageUrl ? (
                  <Image
                    src={theme.bgImageUrl}
                    alt=""
                    fill
                    sizes="96px"
                    loading="eager"
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ background: theme.gradient }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute bottom-1 left-1 right-1 text-[10px] leading-tight text-white font-medium truncate">
                  {theme.label}
                </span>
                {selected && (
                  <span className="absolute top-1 right-1 text-xs text-white drop-shadow">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
