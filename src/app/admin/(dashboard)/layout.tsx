import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isFirebaseConfigured } from "@/lib/firebase-admin";
import LogoutButton from "./logout-button";

/**
 * 後台受保護區的共用版面。
 * 未登入者一律導回登入頁；登入後顯示側邊導覽。
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 尚未設定 Firebase 時，給出明確指引而不是壞掉
  if (!isFirebaseConfigured()) {
    return (
      <main className="mx-auto max-w-lg px-6 py-24">
        <p className="eyebrow">作品集後台</p>
        <h1 className="display mt-4 text-3xl text-ink">尚未完成設定</h1>
        <p className="mt-6 leading-relaxed text-muted">
          後台需要先設定 Firebase 才能使用。請依照專案根目錄的{" "}
          <code className="rounded bg-paper-2 px-1.5 py-0.5 text-sm text-ink">
            SETUP.md
          </code>{" "}
          完成設定後再回來。
        </p>
      </main>
    );
  }

  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const nav = [
    { href: "/admin", label: "總覽" },
    { href: "/admin/works", label: "作品管理" },
    { href: "/admin/donations", label: "抖內紀錄" },
  ];

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 lg:flex-row">
        {/* 側欄 */}
        <aside className="lg:w-52 lg:shrink-0">
          <Link href="/admin" className="display text-lg text-ink">
            作品集後台
          </Link>
          <nav className="mt-8 flex gap-2 lg:flex-col">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-lg px-3 py-2 text-sm text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 border-t border-line pt-6">
            <p className="truncate text-xs text-muted">{user.email}</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <Link
                href="/"
                target="_blank"
                className="text-ink-2 transition-colors hover:text-ink"
              >
                查看網站 ↗
              </Link>
              <LogoutButton />
            </div>
          </div>
        </aside>

        {/* 內容 */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
