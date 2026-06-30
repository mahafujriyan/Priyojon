"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteLogo } from "@/components/SiteLogo";

type Props = {
  defaultUsername: string;
  devHint: { username: string; password: string } | null;
};

export function AdminLoginForm({ defaultUsername, devHint }: Props) {
  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "লগইন ব্যর্থ");

      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "লগইন ব্যর্থ");
      setLoading(false);
    }
  }

  function fillDevCredentials() {
    if (!devHint) return;
    setUsername(devHint.username);
    setPassword(devHint.password);
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12 bg-gradient-to-b from-rose-50 to-zinc-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <SiteLogo href="/" size={72} />
          </div>
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-rose-500 transition-colors"
          >
            ← সাইটে ফিরে যান
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 mt-4">লগইন</h1>
          <p className="text-zinc-500 text-sm mt-1">অ্যাডমিন প্যানেল</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-4"
        >
          {error && (
            <div className="rounded-lg bg-red-50 text-red-600 px-3 py-2.5 text-sm border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-zinc-700 mb-1.5"
            >
              ইউজারনেম
            </label>
            <input
              id="username"
              type="text"
              required
              autoFocus
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-700 mb-1.5"
            >
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 px-1"
                tabIndex={-1}
              >
                {showPassword ? "লুকান" : "দেখুন"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-rose-500 py-3 text-white font-semibold text-base hover:bg-rose-600 active:bg-rose-700 disabled:opacity-60 transition-colors"
          >
            {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
          </button>

          <p className="text-center text-xs text-zinc-400 pt-2">
            <Link href="/admin/register" className="hover:text-rose-500">
              মাস্টার কোড দিয়ে নতুন অ্যাডমিন তৈরি
            </Link>
          </p>

          {devHint && (
            <button
              type="button"
              onClick={fillDevCredentials}
              className="w-full text-center text-xs text-zinc-400 hover:text-rose-500 transition-colors pt-1"
            >
              ডিফল্ট লগইন বোঝাপড়া করুন
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
