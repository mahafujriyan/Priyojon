import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminRootPage() {
  const session = await getSession();
  redirect(session ? "/admin/dashboard" : "/admin/login");
}
