import Link from "next/link";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="display mt-5 text-4xl text-ink sm:text-5xl">
        這個頁面不存在
      </h1>
      <p className="mt-5 max-w-md leading-relaxed text-muted">
        可能是網址輸入錯誤，或這個頁面已經被移除。不如回首頁看看我的作品？
      </p>
      <div className="mt-10">
        <Link
          href="/"
          className="rounded-full bg-ink px-7 py-3.5 text-sm text-paper transition-colors hover:bg-accent"
        >
          回首頁
        </Link>
      </div>
    </section>
  );
}
