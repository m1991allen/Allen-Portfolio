"use client";

import { useState } from "react";
import { tipPresets } from "@/data/site";

/**
 * 抖內表單。
 *
 * 流程：輸入金額/留言 → POST /api/tip/create → 後端建立訂單並回傳
 * 綠界結帳所需的表單參數 → 前端動態組一個 hidden form，auto-submit 到
 * 綠界付款頁（付完會導回 /tip/result）。
 */
export default function TipJar() {
  const [amount, setAmount] = useState<number>(tipPresets[1]);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
