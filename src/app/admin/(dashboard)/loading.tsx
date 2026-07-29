/**
 * 後台切換頁面時的骨架畫面。
 *
 * 放在 (dashboard) 這一層，總覽／作品管理／抖內紀錄／作品表單都吃得到，
 * 所以刻意用中性的「標題 + 面板列」形狀，不對特定頁面的版型做假設。
 *
 * 這些頁都是 force-dynamic 且要打 Firestore，沒有 loading.tsx 的話點下去
 * 會整個卡在原畫面直到伺服器回應；有了它，側欄維持可互動、右側立刻換骨架。
 */
export default function AdminLoading() {
  return (
    <div className="animate-pulse" aria-busy="true">
      <span className="sr-only">載入中…</span>

      {/* 標題與說明 */}
      <div className="h-9 w-40 rounded-lg bg-line" />
      <div className="mt-3 h-4 w-64 rounded bg-line" />

      {/* 內容面板 */}
      <div className="mt-8 divide-y divide-line rounded-2xl border border-line">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <div className="h-4 w-1/3 rounded bg-line" />
              <div className="mt-2.5 h-3 w-1/2 rounded bg-line" />
            </div>
            <div className="h-7 w-16 shrink-0 rounded-full bg-line" />
          </div>
        ))}
      </div>
    </div>
  );
}
