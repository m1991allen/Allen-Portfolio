import Link from "next/link";
import { getAllWorks } from "@/lib/works";
import PublishToggle from "./publish-toggle";
import DeleteWorkButton from "./delete-work-button";

export const dynamic = "force-dynamic";

export default async function AdminWorksPage() {
  const works = await getAllWorks();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="display text-3xl text-ink">作品管理</h1>
          <p className="mt-2 text-sm text-muted">
            共 {works.length} 件，已上架{" "}
            {works.filter((w) => w.published).length} 件。
          </p>
        </div>
        <Link
          href="/admin/works/new"
          className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-sm text-paper transition-colors hover:bg-accent"
        >
          + 新增作品
        </Link>
      </div>

      <div className="mt-8 divide-y divide-line rounded-2xl border border-line">
        {works.map((w) => (
          <div
            key={w.slug}
            className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium text-ink">{w.title}</span>
                {w.featured && (
                  <span className="shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-[0.625rem] text-accent">
                    精選
                  </span>
                )}
              </div>
              <p className="mt-1 truncate text-xs text-muted">
                {w.category}・{w.year}・{w.slug}
              </p>
            </div>

            <PublishToggle slug={w.slug} published={w.published} />

            <div className="flex shrink-0 items-center gap-4 text-sm">
              {w.url ? (
                <a
                  href={w.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-ink"
                >
                  預覽 ↗
                </a>
              ) : (
                <span className="text-muted/50">無連結</span>
              )}
              <Link
                href={`/admin/works/${w.slug}/edit`}
                className="text-ink-2 transition-colors hover:text-ink"
              >
                編輯
              </Link>
              <DeleteWorkButton slug={w.slug} title={w.title} />
            </div>
          </div>
        ))}

        {works.length === 0 && (
          <p className="p-8 text-center text-sm text-muted">
            還沒有任何作品，點右上角新增。
          </p>
        )}
      </div>
    </div>
  );
}
