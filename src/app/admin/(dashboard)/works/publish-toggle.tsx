"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { togglePublishedAction } from "./actions";

/**
 * 上下架切換鈕。點一下就切換 published，並即時反映到前台。
 */
export default function PublishToggle({
  slug,
  published,
}: {
  slug: string;
  published: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [on, setOn] = useState(published);

  function toggle() {
    const next = !on;
    setOn(next); // 樂觀更新
    startTransition(async () => {
      const res = await togglePublishedAction(slug, next);
      if (!res.ok) {
        setOn(!next); // 失敗還原
        alert(res.error);
      }
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={on}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition-colors disabled:opacity-50 ${
        on
          ? "bg-ink text-paper hover:bg-accent"
          : "border border-line text-muted hover:border-ink hover:text-ink"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${on ? "bg-paper" : "bg-muted"}`}
      />
      {on ? "已上架" : "草稿"}
    </button>
  );
}
