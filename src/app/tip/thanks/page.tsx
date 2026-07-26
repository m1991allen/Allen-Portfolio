import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "抖內結果",
  robots: { index: false },
};

export default async function TipThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; amount?: string }>;
}) {
  const { status, amount } = await searchParams;
  const ok = status === "ok";

  return (
    <section className="shell flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <div className="text-6xl">{ok ? "☕" : "😢"}</div>
      <h1 className="display mt-8 text-4xl text-ink sm:text-5xl">
        {ok ? "謝謝你的咖啡！" : "付款沒有完成"}
      </h1>
      <p className="mt-5 max-w-md leading-relaxed text-muted">
        {ok ? (
          <>
            收到你
            {amount ? ` NT$ ${amount} ` : "的"}
            贊助了，這對我是很大的鼓勵。
            我會繼續把好東西做出來，也歡迎再回來看看新作品。
          </>
        ) : (
          <>這筆付款沒有成功完成，沒有任何款項被扣除。如果是誤觸，隨時可以再試一次。</>
        )}
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="rounded-full bg-ink px-7 py-3.5 text-sm text-paper transition-colors hover:bg-accent"
        >
          回首頁
        </Link>
        {!ok && (
          <Link
            href="/#tip"
            className="rounded-full border border-line px-7 py-3.5 text-sm text-ink transition-colors hover:border-ink"
          >
            再試一次
          </Link>
        )}
      </div>
    </section>
  );
}
