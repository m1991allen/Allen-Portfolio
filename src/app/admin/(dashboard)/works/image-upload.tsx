"use client";

import { useState } from "react";

/**
 * 圖片欄位：可上傳檔案（存到 Firebase Storage），也可直接貼網址。
 * value 是圖片網址，onChange 回傳新的網址。
 */
export default function ImageUpload({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "上傳失敗");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "上傳失敗");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-ink">{label}</label>
      )}
      <div className="mt-2 flex items-start gap-4">
        {/* 預覽 */}
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-line bg-paper-2">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="預覽"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[0.6875rem] text-muted">
              無圖片
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="圖片網址，或用下方按鈕上傳"
            className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-xs text-ink focus:border-ink focus:outline-none"
          />
          <div className="flex items-center gap-3">
            <label className="cursor-pointer rounded-full border border-line px-3 py-1.5 text-xs text-ink transition-colors hover:border-ink">
              {uploading ? "上傳中…" : "上傳圖片"}
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                disabled={uploading}
                className="sr-only"
              />
            </label>
            {error && <span className="text-xs text-accent">{error}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
