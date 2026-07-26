"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getClientAuth, isClientConfigured } from "@/lib/firebase-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const configured = isClientConfigured();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // 1. 用 Firebase 前端 SDK 登入，取得 ID token
      const cred = await signInWithEmailAndPassword(
        getClientAuth(),
        email,
        password,
      );
      const idToken = await cred.user.getIdToken();

      // 2. 交給伺服器換成 session cookie
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) throw new Error("session");

      // 3. 進入後台
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("登入失敗，請確認 Email 與密碼是否正確");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <p className="eyebrow">作品集後台</p>
        <h1 className="display mt-4 text-3xl text-ink">登入</h1>

        {!configured && (
          <p className="mt-6 rounded-xl border border-dashed border-line bg-paper-2 px-4 py-3 text-sm leading-relaxed text-muted">
            尚未設定 Firebase 前端環境變數，請先完成 SETUP.md 的步驟。
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink transition-colors focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-ink"
            >
              密碼
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink transition-colors focus:border-ink focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-accent">{error}</p>}

          <button
            type="submit"
            disabled={loading || !configured}
            className="w-full rounded-full bg-ink px-8 py-3.5 text-sm text-paper transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "登入中…" : "登入"}
          </button>
        </form>
      </div>
    </main>
  );
}
