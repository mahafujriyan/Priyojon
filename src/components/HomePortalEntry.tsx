"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SiteLogo } from "@/components/SiteLogo";

export function HomePortalEntry() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/access/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "ভেরিফাই ব্যর্থ");

      router.push(`/c/${data.accessPath}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "কিছু ভুল হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[100dvh] px-4 py-12 bg-gradient-to-br from-rose-950 via-purple-950 to-zinc-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <div className="flex justify-center mb-6">
          <SiteLogo href={null} size={80} showName={false} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          প্রিয়জন কাউন্টডাউন
        </h1>
        <p className="text-white/60 text-sm leading-relaxed mb-8">
          তোমার জন্য পাঠানো গোপন কোড দিয়ে প্রবেশ করো
        </p>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 p-6 sm:p-8 shadow-2xl space-y-4 text-left"
        >
          {error && (
            <div className="rounded-xl bg-red-500/20 border border-red-400/30 text-red-100 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="home-secret-code"
              className="block text-sm font-medium text-white/80 mb-2"
            >
              গোপন কোড
            </label>
            <div className="relative">
              <input
                id="home-secret-code"
                type={showCode ? "text" : "password"}
                required
                autoFocus
                autoComplete="off"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="অ্যাডমিন যে কোড দিয়েছে..."
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
            disabled={loading || !code.trim()}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 py-3.5 text-white font-semibold shadow-lg shadow-rose-500/30 hover:from-rose-600 hover:to-pink-700 disabled:opacity-60 transition-all"
          >
            {loading ? "যাচাই হচ্ছে..." : "পোর্টাল খুলুন ✨"}
          </motion.button>

          <p className="text-center text-xs text-white/40 leading-relaxed pt-1">
            🔒 একবার কোড দিলে পরের বার আর লাগবে না
          </p>
        </form>
      </motion.div>
    </div>
  );
}
