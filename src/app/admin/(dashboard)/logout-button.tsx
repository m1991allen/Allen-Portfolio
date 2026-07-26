"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/session", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="text-left text-muted transition-colors hover:text-accent"
    >
      登出
    </button>
  );
}
