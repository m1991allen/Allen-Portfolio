import Image from "next/image";
import type { Work } from "@/data/works";

type Props = {
  work: Work;
  /** 大卡片會佔滿寬度並放大字級 */
  size?: "default" | "large";
  priority?: boolean;
};

/** 各分類的標籤底色（與紫色主題協調的一組色相） */
const categoryColor: Record<string, string> = {
  媒體專題: "#7c3aed", // 紫（呼應主題重點色）
  互動專題: "#2563eb", // 藍
  企業形象: "#0d9488", // 青綠
  客戶系統: "#94790d", // 黃
};

export default function WorkCard({
  work,
  size = "default",
  priority = false,
}: Props) {
  const large = size === "large";
  const accent = categoryColor[work.category] ?? "#16150f";

  return (
    <a
      href={work.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      aria-label={`開啟作品：${work.title}（新分頁）`}
    >
      <div className="relative overflow-hidden rounded-2xl border border-line bg-paper-2 ring-0 ring-accent/60 transition-[box-shadow] duration-500 group-hover:ring-2">
        <div className={large ? "aspect-16/10" : "aspect-4/3"}>
          <Image
            src={work.cover}
            alt={work.title}
            fill
            priority={priority}
            sizes={
              large
                ? "(max-width: 1024px) 100vw, 1200px"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
            className="object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
        </div>

        {/* hover 時浮現的遮罩與提示（固定暗色遮罩，不受主題影響） */}
        <div className="pointer-events-none absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/55 via-black/0 to-black/0 p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="mono rounded-full bg-white px-4 py-2 text-xs text-black">
            前往網站 ↗
          </span>
        </div>

        <span
          className="absolute top-4 left-4 rounded-full px-3 py-1.5 text-[0.6875rem] font-medium text-paper backdrop-blur-sm"
          style={{ backgroundColor: `${accent}e6` }}
        >
          {work.category}
        </span>

        {work.highlight && (
          <span className="absolute top-4 right-4 rounded-full bg-paper/90 px-3 py-1.5 text-[0.6875rem] font-medium text-accent backdrop-blur-sm">
            {work.highlight}
          </span>
        )}
      </div>

      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h3
            className={`display text-ink transition-colors group-hover:text-accent ${
              large ? "text-2xl sm:text-3xl" : "text-xl"
            }`}
          >
            {work.title}
          </h3>
          <p
            className={`mt-2.5 leading-relaxed text-muted ${
              large ? "max-w-2xl text-base" : "text-sm"
            }`}
          >
            {work.description}
          </p>
          {work.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {work.tags.slice(0, large ? 5 : 3).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line px-2.5 py-1 text-[0.6875rem] text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        <span className="mono shrink-0 pt-1.5 text-xs text-muted tabular-nums">
          {work.year}
        </span>
      </div>
    </a>
  );
}
