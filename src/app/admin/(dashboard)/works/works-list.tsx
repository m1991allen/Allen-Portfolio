"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Work } from "@/data/works";
import { reorderWorksAction } from "./actions";
import PublishToggle from "./publish-toggle";
import DeleteWorkButton from "./delete-work-button";

/**
 * 作品清單，可拖曳左側握把調整順序。
 * 放開就樂觀更新畫面並寫回 Firestore，失敗則還原順序。
 */

function SortableRow({ work: w }: { work: Work }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: w.slug });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={`flex flex-wrap items-center gap-4 bg-paper p-4 sm:flex-nowrap ${
        isDragging ? "relative z-10 rounded-2xl shadow-lg" : ""
      }`}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`拖曳調整「${w.title}」的順序`}
        title="拖曳調整順序"
        className="shrink-0 cursor-grab touch-none px-1 text-muted transition-colors hover:text-ink active:cursor-grabbing"
      >
        ⠿
      </button>

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
  );
}

export default function WorksList({ works }: { works: Work[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [items, setItems] = useState(works);

  // 伺服器資料變動時（例如刪除後 router.refresh()）同步本地順序
  const signature = works.map((w) => w.slug).join(",");
  const [prevSignature, setPrevSignature] = useState(signature);
  if (prevSignature !== signature) {
    setPrevSignature(signature);
    setItems(works);
  }

  const sensors = useSensors(
    // 給 4px 的緩衝，避免點編輯／刪除時被誤判成拖曳
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;

    const from = items.findIndex((w) => w.slug === active.id);
    const to = items.findIndex((w) => w.slug === over.id);
    if (from === -1 || to === -1) return;

    const before = items;
    const next = arrayMove(items, from, to);
    setItems(next); // 樂觀更新

    startTransition(async () => {
      const res = await reorderWorksAction(next.map((w) => w.slug));
      if (!res.ok) {
        setItems(before); // 失敗還原
        alert(res.error);
      }
      router.refresh();
    });
  }

  return (
    <>
      <p className="mt-6 text-xs text-muted">
        拖曳左側 ⠿ 可調整前台顯示順序{pending && "・儲存中…"}
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((w) => w.slug)}
          strategy={verticalListSortingStrategy}
        >
          <div className="mt-2 divide-y divide-line rounded-2xl border border-line">
            {items.map((w) => (
              <SortableRow key={w.slug} work={w} />
            ))}

            {items.length === 0 && (
              <p className="p-8 text-center text-sm text-muted">
                還沒有任何作品，點右上角新增。
              </p>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
}
