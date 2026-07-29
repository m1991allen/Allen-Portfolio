"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav, site } from "@/data/site";
import ThemeToggle from "@/components/theme-toggle";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 選單開啟時鎖住背景捲動
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-line bg-paper/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="shell flex h-20 items-center justify-between gap-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label={`${site.name} 前端工程師作品集 — 回首頁`}
        >
          <span
            aria-hidden
            className="h-2 w-2 rounded-full bg-accent transition-transform duration-500 group-hover:scale-125"
          />
          <span className="display text-xl text-ink">{site.name}</span>
          <span className="mono hidden text-[0.625rem] tracking-[0.22em] text-muted sm:inline">
            {site.nameEn}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="主選單">
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className="group flex items-baseline gap-1.5 text-sm text-muted transition-colors hover:text-ink"
            >
              <span className="mono text-[0.625rem] text-accent/70 transition-colors group-hover:text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="link-underline">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <a
            href="#tip"
            className="hidden rounded-full bg-ink px-5 py-2.5 text-sm text-paper transition-colors hover:bg-accent hover:text-paper md:inline-block"
          >
            請我喝咖啡
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink md:hidden"
            aria-label={open ? "關閉選單" : "開啟選單"}
            aria-expanded={open}
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 block h-px w-5 bg-ink transition-transform duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-5 bg-ink transition-transform duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* 手機選單 */}
      <div
        className={`fixed inset-0 top-20 z-40 bg-paper transition-all duration-400 md:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="shell flex flex-col gap-1 py-8" aria-label="行動版選單">
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-4 border-b border-line py-5"
            >
              <span className="mono text-sm text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="display text-3xl text-ink">{item.label}</span>
            </a>
          ))}
          <a
            href="#tip"
            onClick={() => setOpen(false)}
            className="mt-8 rounded-full bg-ink px-6 py-4 text-center text-paper"
          >
            請我喝咖啡
          </a>
        </nav>
      </div>
    </header>
  );
}
