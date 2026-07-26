"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteWorkAction } from "./actions";

export default function DeleteWorkButton({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    if (!confirm(`確定要刪除「${title}」嗎？此動作無法復原。`)) return;
    setError(null);
    startTransition(async () => {
      const res = await deleteWorkAction(slug);
      if (res.ok) {
        router.refresh();
      } else {
        setError(res.error);
        alert(res.error);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="text-muted transition-colors hover:text-accent disabled:opacity-40"
      title={error ?? undefined}
    >
      {pending ? "刪除中…" : "刪除"}
    </button>
  );
}
