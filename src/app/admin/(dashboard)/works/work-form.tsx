"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./image-upload";
import { saveWorkAction } from "./actions";
import { workCategories, type Work } from "@/data/works";

const emptyWork: Work = {
  slug: "",
  title: "",
  description: "",
  category: workCategories[0],
  url: "",
  cover: "",
  tags: [],
  year: new Date().getFullYear().toString(),
  role: "",
  highlight: "",
  featured: false,
  published: true,
  order: 0,
};

/** 年份下拉選單的範圍：今年往回推到 2010。 */
const FIRST_YEAR = 2010;

function yearOptions(current: string): string[] {
  const thisYear = new Date().getFullYear();
  const years: string[] = [];
  for (let y = thisYear; y >= FIRST_YEAR; y--) years.push(y.toString());
  // 舊資料若落在範圍外，補進選單，避免編輯時被靜默改掉
  if (current && !years.includes(current)) years.unshift(current);
  return years;
}

/** 把「用逗號分隔」的輸入字串轉成標籤陣列：去空白、去空值、去重複。 */
function parseTags(raw: string): string[] {
  const cleaned = raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  return Array.from(new Set(cleaned));
}

export default function WorkForm({
  initial,
  originalSlug,
}: {
  initial?: Work;
  originalSlug: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [w, setW] = useState<Work>(initial ?? emptyWork);
  // 標籤維持「使用者原始輸入字串」，只有送出時才切成陣列。
  // 若每次 keystroke 都 split + trim，就打不出「React Native」這種含空白的標籤。
  const [tagsInput, setTagsInput] = useState(() =>
    (initial?.tags ?? []).join(", "),
  );

  function set<K extends keyof Work>(key: K, val: Work[K]) {
    setW((prev) => ({ ...prev, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const tags = parseTags(tagsInput);
    // 讓輸入框反映實際存下去的內容（去掉多餘逗號、重複標籤）
    setTagsInput(tags.join(", "));

    const cleaned: Work = {
      ...w,
      slug: w.slug.trim(),
      title: w.title.trim(),
      description: w.description.trim(),
      url: w.url?.trim() || undefined,
      role: w.role?.trim() || undefined,
      highlight: w.highlight?.trim() || undefined,
      cover: w.cover.trim(),
      tags,
    };

    startTransition(async () => {
      const res = await saveWorkAction(originalSlug, JSON.stringify(cleaned));
      if (res.ok) {
        router.push("/admin/works");
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="作品標題" required>
          <input
            type="text"
            value={w.title}
            onChange={(e) => set("title", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="網址代稱 slug" required hint="英數與連字號，作為文件 ID">
          <input
            type="text"
            value={w.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="例如 covid-19"
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="一句話簡介">
        <textarea
          value={w.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className={inputCls}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="分類" required>
          <select
            value={w.category}
            onChange={(e) => set("category", e.target.value)}
            className={inputCls}
          >
            {workCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="年份" required>
          <select
            value={w.year}
            onChange={(e) => set("year", e.target.value)}
            className={inputCls}
          >
            {yearOptions(w.year).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="作品網址（外部連結）" hint="內部系統無公開網址可留空">
        <input
          type="url"
          value={w.url ?? ""}
          onChange={(e) => set("url", e.target.value)}
          placeholder="https://..."
          className={inputCls}
        />
      </Field>

      <ImageUpload
        label="封面圖片"
        required
        hint="JPG / PNG / WebP，最短邊 600px 以上；上傳後統一轉成長邊 1600px 的 JPG"
        value={w.cover}
        onChange={(url) => set("cover", url)}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="我的角色" hint="例如 設計・前端">
          <input
            type="text"
            value={w.role ?? ""}
            onChange={(e) => set("role", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="亮點徽章" hint="例如 百萬流量（選填）">
          <input
            type="text"
            value={w.highlight ?? ""}
            onChange={(e) => set("highlight", e.target.value)}
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="技術 / 角色標籤" hint="用逗號分隔，例如 RWD, React Native, UI">
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          onBlur={() => setTagsInput(parseTags(tagsInput).join(", "))}
          className={inputCls}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="排序" hint="數字越小越前面">
          <input
            type="number"
            value={w.order}
            onChange={(e) => set("order", Number(e.target.value))}
            className={inputCls}
          />
        </Field>
      </div>

      <div className="space-y-3 rounded-xl border border-line bg-paper-2 p-4">
        <label className="flex items-center gap-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={w.published}
            onChange={(e) => set("published", e.target.checked)}
            className="h-4 w-4 accent-[var(--color-accent)]"
          />
          上架（顯示在網站上）
        </label>
        <label className="flex items-center gap-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={w.featured ?? false}
            onChange={(e) => set("featured", e.target.checked)}
            className="h-4 w-4 accent-[var(--color-accent)]"
          />
          設為精選作品
        </label>
      </div>

      {error && (
        <p className="rounded-lg bg-accent-soft px-4 py-3 text-sm text-accent">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink px-7 py-3 text-sm text-paper transition-colors hover:bg-accent disabled:opacity-50"
        >
          {pending ? "儲存中…" : "儲存"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/works")}
          className="rounded-full border border-line px-7 py-3 text-sm text-ink transition-colors hover:border-ink"
        >
          取消
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none";

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
        {hint && <span className="ml-2 text-xs font-normal text-muted">{hint}</span>}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
