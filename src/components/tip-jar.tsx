"use client";

import { useState, useSyncExternalStore } from "react";
import { tipMethods, tipPresets, type TipMethod } from "@/data/site";

/**
 * 抖內表單。
 *
 * 流程：輸入金額/留言、選付款方式 → POST /api/tip/create → 後端建立訂單並
 * 回傳綠界結帳所需的表單參數 → 前端動態組一個 hidden form，auto-submit 到
 * 綠界付款頁（付完會導回 /tip/thanks）。
 *
 * 付款方式在這裡就選好、直接送固定的 ChoosePayment，所以綠界不會再出現
 * 一頁付款方式選擇頁，也不會冒出超商/條碼/綠界PAY 等我們沒開的方式。
 */

/** Apple Pay 能不能用是環境資訊、不會變動，所以訂閱函式什麼都不用做 */
function subscribeNever() {
  return () => {};
}

/**
 * 綠界的 Apple Pay 限制：iOS 16 以上任何瀏覽器可用；iOS 15 以下與 macOS
 * 只有 Safari 可用。在不支援的環境顯示這顆按鈕，使用者會跳到一個沒有
 * 付款鈕的空白綠界頁面，所以寧可直接隱藏。
 */
function canUseApplePay(): boolean {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  // iPadOS 13 之後的 Safari 會自稱 Macintosh，一併走 Safari 判斷
  const isMac = /Macintosh/.test(ua);
  if (!isIOS && !isMac) return false;

  const iosMajor = Number(/OS (\d+)[._]/.exec(ua)?.[1] ?? 0);
  if (isIOS && iosMajor >= 16) return true;

  return (
    /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|Chrome|Chromium|Edg\//.test(ua)
  );
}

/** 伺服器端無從得知裝置，先當成不支援；hydration 後才補上真值 */
function applePayServerSnapshot(): boolean {
  return false;
}

export default function TipJar() {
  const [amount, setAmount] = useState<number>(tipPresets[1]);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [method, setMethod] = useState<TipMethod>("Credit");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applePayReady = useSyncExternalStore(
    subscribeNever,
    canUseApplePay,
    applePayServerSnapshot,
  );
  const methods = tipMethods.filter((m) => !m.appleOnly || applePayReady);

  const finalAmount = custom ? Number(custom) : amount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!Number.isFinite(finalAmount) || finalAmount < 1) {
      setError("請輸入有效的金額（至少 1 元）");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/tip/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(finalAmount),
          name: name.trim(),
          message: message.trim(),
          method,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "建立訂單失敗，請稍後再試");
      }

      // 動態組一個表單送去綠界
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.action;
      Object.entries(data.params as Record<string, string>).forEach(
        ([k, v]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = k;
          input.value = v;
          form.appendChild(input);
        },
      );
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生錯誤，請稍後再試");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-paper p-6 sm:p-8"
    >
      <p className="text-sm font-medium text-ink">選擇金額</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {tipPresets.map((p) => {
          const on = !custom && amount === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => {
                setAmount(p);
                setCustom("");
              }}
              className={`mono rounded-xl border px-3 py-3 text-sm transition-colors ${
                on
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink hover:border-ink"
              }`}
            >
              NT$ {p}
            </button>
          );
        })}
      </div>

      <label className="mt-3 block">
        <span className="sr-only">自訂金額</span>
        <input
          type="number"
          min={1}
          inputMode="numeric"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="或輸入自訂金額"
          className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none"
        />
      </label>

      <div className="mt-4 space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="你的暱稱（選填）"
          maxLength={40}
          className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none"
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="想對我說的話（選填）"
          maxLength={100}
          className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none"
        />
      </div>

      <p className="mt-6 text-sm font-medium text-ink">付款方式</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {methods.map((m) => {
          const on = method === m.value;
          return (
            <button
              key={m.value}
              type="button"
              onClick={() => setMethod(m.value)}
              aria-pressed={on}
              className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                on
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink hover:border-ink"
              }`}
            >
              <span className="block text-sm">{m.label}</span>
              <span
                className={`mt-0.5 block text-xs ${on ? "opacity-70" : "text-muted"}`}
              >
                {m.hint}
              </span>
            </button>
          );
        })}
      </div>

      {error && <p className="mt-3 text-sm text-accent">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-full bg-ink py-3.5 text-sm text-paper transition-colors hover:bg-accent disabled:opacity-50"
      >
        {loading
          ? "前往結帳…"
          : `贊助 NT$ ${Number.isFinite(finalAmount) && finalAmount > 0 ? Math.round(finalAmount) : "—"}`}
      </button>
    </form>
  );
}
