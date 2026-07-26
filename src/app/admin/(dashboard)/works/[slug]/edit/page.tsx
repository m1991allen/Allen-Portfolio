import { notFound } from "next/navigation";
import { getWorkBySlug } from "@/lib/works";
import WorkForm from "../../work-form";

export const dynamic = "force-dynamic";

export default async function EditWorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) notFound();

  return (
    <div>
      <h1 className="display text-3xl text-ink">編輯作品</h1>
      <p className="mt-2 mb-8 text-sm text-muted">{work.title}</p>
      <WorkForm initial={work} originalSlug={slug} />
    </div>
  );
}
