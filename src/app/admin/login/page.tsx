import { AdminLoginForm } from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  const defaultUsername =
    process.env.ADMIN_EMAIL?.split("@")[0] ?? "admin";
  const showHint = process.env.NODE_ENV === "development";

  return (
    <AdminLoginForm
      defaultUsername={defaultUsername}
      devHint={
        showHint
          ? {
              username: defaultUsername,
              password: process.env.ADMIN_PASSWORD ?? "priyojon2026",
            }
          : null
      }
    />
  );
}
