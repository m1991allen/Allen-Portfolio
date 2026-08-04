import Link from "next/link";
import { getAllWorks } from "@/lib/works";
import WorksList from "./works-list";

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

      <WorksList works={works} />
    </div>
  );
}
