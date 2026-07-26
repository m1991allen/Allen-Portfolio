import WorkForm from "../work-form";

export const dynamic = "force-dynamic";

export default function NewWorkPage() {
  return (
    <div>
      <h1 className="display text-3xl text-ink">新增作品</h1>
      <p className="mt-2 mb-8 text-sm text-muted">
        填寫作品資訊，儲存後即可在網站上顯示。
      </p>
      <WorkForm originalSlug={null} />
    </div>
  );
}
