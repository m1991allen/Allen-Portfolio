import Link from "next/link";
import { getAllWorks } from "@/lib/works";
import { getDonationStats } from "@/lib/donations";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [works, donation] = await Promise.all([
    getAllWorks(),
    getDonationStats(),
  ]);

  const published = works.filter((w) => w.published).length;

  const cards = [
    {
      href: "/admin/works",
      label: "作品",
      value: `${works.length} 件`,
      hint: `已上架 ${published} 件・草稿 ${works.length - published} 件`,
    },
    {
      href: "/admin/donations",
      label: "抖內",
      value:
        donation.count > 0
          ? `NT$ ${donation.total.toLocaleString()}`
          : "尚無紀錄",
      hint: `${donation.count} 筆成功付款`,
    },
  ];

  return (
    <div>
      <h1 className="display text-3xl text-ink">總覽</h1>
      <p className="mt-3 text-sm text-muted">歡迎回來，這裡可以管理作品與查看抖內。</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl border border-line bg-paper-2 p-6 transition-colors hover:border-ink"
          >
            <p className="eyebrow">{c.label}</p>
            <p className="display mt-3 text-2xl text-ink">{c.value}</p>
            <p className="mt-2 text-sm text-muted">{c.hint}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Link
          href="/admin/works/new"
          className="inline-block rounded-full bg-ink px-6 py-3 text-sm text-paper transition-colors hover:bg-accent"
        >
          + 新增作品
        </Link>
      </div>
    </div>
  );
}
