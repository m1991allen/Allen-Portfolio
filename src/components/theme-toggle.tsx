"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * 深/淺色切換。初始狀態由 layout 的防閃爍腳本寫在 <html data-theme> 上，
 * 這裡於掛載後讀回同步，避免 hydration 不一致。
 */
export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    const el = document.documentElement;
    if (next === "dark") el.setAttribute("data-theme", "dark");
    else el.removeAttribute("data-theme");
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* localStorage 不可用時略過，不影響切換 */
    }
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink ${className}`}
      aria-label={isDark ? "切換為淺色模式" : "切換為深色模式"}
      title={isDark ? "淺色模式" : "深色模式"}
    >
      {/* 太陽（淺色時顯示） */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className={`absolute h-[1.15rem] w-[1.15rem] transition-all duration-300 ${
          theme === null
            ? "opacity-0"
            : isDark
              ? "scale-50 opacity-0"
              : "scale-100 opacity-100"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8l1.8-1.8M18 6l1.8-1.8" />
      </svg>
      {/* 月亮（深色時顯示） */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className={`absolute h-[1.15rem] w-[1.15rem] transition-all duration-300 ${
          isDark ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
      </svg>
    </button>
  );
}
