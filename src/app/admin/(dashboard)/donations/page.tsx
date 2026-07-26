import { getRecentDonations, getDonationStats } from "@/lib/donations";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, { text: string; cls: string }> = {
  paid: { text: "已付款", cls: "bg-ink text-paper" },
  pending: { text: "待付款", cls: "border border-line text-muted" },
  failed: { text: "失敗", cls: "bg-accent-soft text-accent" },
};

export default async function AdminDonationsPage() {
  const [donations, stats] = await Promise.all([
    getRecentDonations(50),
    getDonationStats(),
  ]);

  return (
    <div>
      <h1 className="display text-3xl text-ink">抖內紀錄</h1>
      <p className="mt-2 text-sm text-muted">
        累積收到 {stats.count} 筆贊助，共 NT$ {stats.total.toLocaleString()}。
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line">
        <div className="hidden bg-paper-2 px-4 py-3 text-xs text-muted sm:grid sm:grid-cols-[1fr_6rem_1fr_8rem]">
          <span>暱稱 / 留言</span>
          <span className="text-right">金額</span>
          <span className="pl-4">狀態</span>
          <span className="text-right">時間</span>
        </div>
        <div className="divide-y divide-line">
          {donations.map((d) => {
            const st = statusLabel[d.status] ?? statusLabel.pending;
            return (
              <div
                key={d.orderId}
                className="grid gap-2 px-4 py-4 sm:grid-cols-[1fr_6rem_1fr_8rem] sm:items-center"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink">
                    {d.name || "匿名"}
                  </p>
                  {d.message && (
                    <p className="truncate text-xs text-muted">{d.message}</p>
                  )}
                </div>
                <p className="text-sm text-ink tabular-nums sm:text-right">
                  NT$ {d.amount.toLocaleString()}
                </p>
                <div className="sm:pl-4">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-[0.625rem] ${st!.cls}`}
                  >
                    {st!.text}
                  </span>
                </div>
                <p className="text-xs text-muted sm:text-right">
                  {new Date(d.createdAt).toLocaleString("zh-TW", {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            );
          })}

          {donations.length === 0 && (
            <p className="p-8 text-center text-sm text-muted">
              目前還沒有任何抖內紀錄。
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
