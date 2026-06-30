"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteLogo } from "@/components/SiteLogo";

export function AdminRegisterForm() {
  const [masterCode, setMasterCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("পাসওয়ার্ড মিলছে না");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ masterCode, username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "তৈরি ব্যর্থ");

      setSuccess("অ্যাডমিন তৈরি হয়েছে! এখন লগইন করুন।");
      setMasterCode("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "তৈরি ব্যর্থ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12 bg-gradient-to-b from-rose-50 to-zinc-50 min-h-[100dvh]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <SiteLogo href="/" size={72} />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">নতুন অ্যাডমিন</h1>
          <p className="text-zinc-500 text-sm mt-1">
            মাস্টার কোড দিয়ে অ্যাডমিন তৈরি করুন
          </p>
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
          {success && (
            <div className="rounded-lg bg-green-50 text-green-700 px-3 py-2.5 text-sm border border-green-100">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              মাস্টার কোড
            </label>
            <input
              type="password"
              required
              autoFocus
              value={masterCode}
              onChange={(e) => setMasterCode(e.target.value)}
              placeholder="শুধু অ্যাডমিন তৈরির সময়"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              ইউজারনেম
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="নতুন অ্যাডমিন"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400"
              >
                {showPassword ? "লুকান" : "দেখুন"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              পাসওয়ার্ড আবার
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-rose-500 py-3 text-white font-semibold hover:bg-rose-600 disabled:opacity-60"
          >
            {loading ? "তৈরি হচ্ছে..." : "অ্যাডমিন তৈরি করুন"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-4">
          <Link href="/admin/login" className="text-rose-500 hover:underline">
            লগইনে ফিরে যান
          </Link>
        </p>
      </div>
    </div>
  );
}
