import JsonLd from "@/components/json-ld";
import Reveal from "@/components/reveal";
import WorkGrid from "@/components/work-grid";
import TipJar from "@/components/tip-jar";
import { getPublishedWorks, getWorkCategories } from "@/lib/works";
import { site, skills, stack, experience, education } from "@/data/site";

// 首頁每 5 分鐘重新產生一次（ISR），讓後台改動會反映上來
export const revalidate = 300;

/** 區塊小標：等寬編號 + 中文標籤，統一的科技感標頭 */
function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <p className="flex items-center gap-3">
      <span className="section-index">{index}</span>
      <span aria-hidden className="h-px w-8 bg-line" />
      <span className="eyebrow">{label}</span>
    </p>
  );
}

export default async function HomePage() {
  const [works, categories] = await Promise.all([
    getPublishedWorks(),
    getWorkCategories(),
  ]);

  return (
    <>
      <JsonLd />

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative overflow-x-clip">
        {/* 細格線背景紋理 */}
        <div
          aria-hidden
          className="tech-grid pointer-events-none absolute inset-0 -z-10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 right-0 -z-10 h-[34rem] w-[34rem] translate-x-1/4 -translate-y-1/4 rounded-full bg-accent-soft/55 blur-[110px]"
        />

        <div className="shell pt-16 pb-20 sm:pt-24 lg:pt-32">
          <Reveal>
            <p className="eyebrow eyebrow--dot">
              Front-End Engineer / Interactive Developer
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="display mt-6 max-w-4xl text-[2.75rem] leading-[1.08] sm:text-6xl lg:text-7xl">
              把複雜的資料，
              <br />
              變成
              <span className="text-accent"> 看得懂的介面</span>。
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-2">
              我是 Allen——具備多年企業級開發經驗的前端工程師。
              在媒體業主導媒資管理系統開發，也做過百萬流量的新聞互動專題；
              近期把重心放在 AI 應用實作。
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#works"
                className="rounded-full bg-ink px-7 py-3.5 text-sm text-paper transition-colors hover:bg-accent hover:text-paper"
              >
                看我的作品
              </a>
              <a
                href="#tip"
                className="rounded-full border border-line px-7 py-3.5 text-sm text-ink transition-colors hover:border-ink"
              >
                請我喝咖啡 ☕
              </a>
            </div>
          </Reveal>

          {/* 技能雲（等寬字，科技感） */}
          <Reveal delay={320}>
            <div className="mt-16 flex flex-wrap gap-2 border-t border-line pt-10">
              {stack.map((s) => (
                <span
                  key={s}
                  className="mono rounded-full border border-line px-3.5 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── About ──────────────────────────────────────── */}
      <section id="about" className="shell scroll-mt-24 py-24 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <SectionLabel index="01" label="關於我" />
              <h2 className="display mt-5 text-3xl sm:text-4xl">
                從企業級系統，
                <br />
                到百萬流量的專題。
              </h2>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <div className="space-y-6 text-lg leading-relaxed text-ink-2">
                <p>
                  世新大學資管系網路科技組畢業。第一次接觸網頁程式就被吸引——
                  邏輯結構與視覺表現能在同一件事情上成立，這條路一走就是多年。
                  退伍後到澳洲打工度假，替當地房東做了背包客棧網站，
                  也在那時看見了東西方網頁設計在審美與功能上的差異。
                </p>
                <p>
                  在媒體業，我一邊主導企業級媒資管理系統的開發，
                  把複雜的影音資料結構視覺化、重新設計內部人員的操作流程；
                  一邊用原生 JS 搭配 CSS 動畫產製新聞互動專題，
                  其中 COVID-19 系列創下百萬流量。
                </p>
                <p>
                  近期把重心放在 AI 應用實作，透過 Side Project 探索 LLM API 整合、
                  瀏覽器擴充功能與生產力工具開發，
                  也持續研究微前端架構在多團隊協作下的拆分策略。
                </p>
                <p className="border-l-2 border-accent pl-5 text-ink">
                  {site.motto}
                  <span className="mt-1 block text-sm text-muted">
                    —— 這是我一直相信的事。
                  </span>
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-12 border-t border-line pt-8">
                <p className="eyebrow">學歷</p>
                <ul className="mt-5 space-y-3">
                  {education.map((e) => (
                    <li key={e.school} className="flex items-baseline gap-3">
                      <span className="text-ink">{e.school}</span>
                      {e.major && (
                        <span className="text-sm text-muted">{e.major}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Skills ─────────────────────────────────────── */}
      <section id="skills" className="scroll-mt-24 bg-paper-2 py-24 lg:py-32">
        <div className="shell">
          <Reveal>
            <SectionLabel index="02" label="核心競爭力" />
            <h2 className="display mt-5 max-w-2xl text-3xl sm:text-4xl">
              從模糊的需求，到穩定交付的介面。
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {skills.map((s, i) => (
              <Reveal key={s.no} delay={(i % 2) * 90}>
                <div className="group relative h-full bg-paper p-8 lg:p-10">
                  {/* hover 時浮現的頂部強調線 */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100"
                  />
                  <span className="section-index text-lg">{s.no}</span>
                  <h3 className="display mt-4 text-xl text-ink">{s.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{s.desc}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {s.items.map((it) => (
                      <span
                        key={it}
                        className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-2"
                      >
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Experience ─────────────────────────────────── */}
      <section id="experience" className="shell scroll-mt-24 py-24 lg:py-32">
        <Reveal>
          <SectionLabel index="03" label="工作經歷" />
          <h2 className="display mt-5 text-3xl sm:text-4xl">走過的路。</h2>
        </Reveal>

        <div className="mt-14">
          {experience.map((e, i) => (
            <Reveal key={e.id} delay={i * 80}>
              <div className="group grid gap-4 border-b border-line py-8 transition-colors hover:bg-paper-2/60 sm:grid-cols-[9rem_1fr] lg:gap-10">
                <div className="flex items-baseline gap-3">
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-line transition-colors group-hover:bg-accent"
                  />
                  <p className="mono text-xs tracking-wider text-accent">
                    {e.period}
                  </p>
                </div>
                <div>
                  <h3 className="display text-xl text-ink">
                    {e.company}
                    <span className="ml-3 font-sans text-sm font-normal text-muted">
                      {e.role}
                    </span>
                  </h3>
                  <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                    {e.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Works ──────────────────────────────────────── */}
      <section id="works" className="shell scroll-mt-24 py-24 lg:py-32">
        <Reveal>
          <div className="flex items-end justify-between gap-6 border-b border-line pb-8">
            <div>
              <SectionLabel index="04" label="作品集" />
              <h2 className="display mt-5 text-3xl sm:text-4xl">
                做過、而且還在線上的作品。
              </h2>
            </div>
            <p className="mono hidden shrink-0 text-xs text-muted sm:block">
              點擊卡片前往實際網站 ↗
            </p>
          </div>
        </Reveal>

        <div className="mt-12">
          <WorkGrid works={works} categories={categories} />
        </div>
      </section>

      {/* ── Tip Jar（抖內）──────────────────────────────── */}
      <section id="tip" className="shell scroll-mt-24 pb-8">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 right-0 h-80 w-80 translate-x-1/4 -translate-y-1/4 rounded-full bg-accent/25 blur-[100px]"
          />
          <div className="relative grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow eyebrow--dot text-paper/50">支持一下</p>
              <h2 className="display mt-5 text-3xl text-paper sm:text-4xl">
                覺得有幫助？
                <br />
                請我喝杯咖啡吧 ☕
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-paper/60">
                如果我的作品或分享對你有一點點幫助，歡迎小額抖內。
                你的每一杯咖啡，都是我持續做東西的動力。
              </p>
            </div>

            <TipJar />
          </div>
        </div>
      </section>
    </>
  );
}
