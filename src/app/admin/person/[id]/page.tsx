import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

type PageProps = { params: Promise<{ id: string }> };

export default async function PersonRedirectPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  redirect(`/admin/person/${id}/edit`);
}
