"use client";

import { useMemo, useState } from "react";
import WorkCard from "@/components/work-card";
import Reveal from "@/components/reveal";
import type { Work } from "@/data/works";

type Props = {
  works: Work[];
  categories: string[];
};

/** 作品列表 + 分類篩選 */
export default function WorkGrid({ works, categories }: Props) {
  const [active, setActive] = useState<string>("全部");

  const filters = useMemo(() => ["全部", ...categories], [categories]);
  const visible = useMemo(
    () => (active === "全部" ? works : works.filter((w) => w.category === active)),
    [active, works],
  );

  return (
    <div>
      {/* 分類篩選 */}
      <div className="sticky top-20 z-30 -mx-6 mb-14 bg-paper/85 px-6 py-4 backdrop-blur-md lg:-mx-10 lg:px-10">
        <div
          className="flex flex-wrap gap-2 border-b border-line pb-4"
          role="tablist"
          aria-label="作品分類"
        >
          {filters.map((c) => {
            const on = c === active;
            return (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(c)}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  on
                    ? "bg-ink text-paper"
                    : "border border-line text-muted hover:border-ink hover:text-ink"
                }`}
              >
                {c}
                <span className="ml-1.5 text-[0.6875rem] tabular-nums opacity-60">
                  {c === "全部"
                    ? works.length
                    : works.filter((w) => w.category === c).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
        {visible.map((w, i) => (
          // key 帶上分類，切換時會重新播放進場動畫
          <Reveal key={`${active}-${w.slug}`} delay={(i % 2) * 90}>
            <WorkCard work={w} priority={i < 2} />
          </Reveal>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="py-20 text-center text-muted">這個分類目前還沒有作品。</p>
      )}
    </div>
  );
}
