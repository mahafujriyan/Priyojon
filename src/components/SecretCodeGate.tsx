"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { EventType } from "@/generated/prisma/client";
import { EVENT_LABELS } from "@/lib/events";
import { SiteLogo } from "@/components/SiteLogo";

type Props = {
  accessPath: string;
  personName: string;
  eventType: EventType;
};

export function SecretCodeGate({ accessPath, personName, eventType }: Props) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/access/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessPath, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "ভেরিফাই ব্যর্থ");

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "কিছু ভুল হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-rose-950 via-purple-950 to-zinc-950">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <SiteLogo href={null} size={64} showName={false} />
          </div>
          <p className="text-rose-300/80 text-sm uppercase tracking-[0.25em] mb-2">
            {EVENT_LABELS[eventType]}
          </p>
          <h1 className="text-3xl font-bold text-white mb-2">{personName}</h1>
          <p className="text-white/60 text-sm leading-relaxed">
            এটি একটি ব্যক্তিগত পোর্টাল। শুধুমাত্র তোমার জন্য — গোপন কোড দিয়ে
            প্রবেশ করো।
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 p-6 sm:p-8 shadow-2xl space-y-5"
        >
          {error && (
            <div className="rounded-xl bg-red-500/20 border border-red-400/30 text-red-100 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="secret-code"
              className="block text-sm font-medium text-white/80 mb-2"
            >
              গোপন কোড
            </label>
            <div className="relative">
              <input
                id="secret-code"
                type={showCode ? "text" : "password"}
                required
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="তোমার সিক্রেট ওয়ার্ড..."
                className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3.5 pr-16 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              <button
                type="button"
                onClick={() => setShowCode((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/45 hover:text-white/70"
              >
                {showCode ? "লুকান" : "দেখুন"}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 py-3.5 text-white font-semibold shadow-lg shadow-rose-500/30 hover:from-rose-600 hover:to-pink-700 disabled:opacity-60 transition-all"
          >
            {loading ? "যাচাই হচ্ছে..." : "পোর্টাল খুলুন ✨"}
          </motion.button>

          <p className="text-center text-xs text-white/40 leading-relaxed">
            🔒 লিংক ও কোড ছাড়া কেউ এই পেজ দেখতে পারবে না
          </p>
        </form>
      </motion.div>
    </div>
  );
}
