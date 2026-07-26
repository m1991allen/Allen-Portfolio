import "server-only";

import { cookies } from "next/headers";
import { getAuth } from "firebase-admin/auth";
import { getAdminAppOrNull } from "@/lib/firebase-admin";

/**
 * 後台登入狀態（伺服器端）。
 *
 * 流程：登入頁用 Firebase 前端 SDK 取得 ID token
 *   → 交給 /api/auth/session 換成 session cookie（httpOnly）
 *   → 之後每次請求由伺服器驗證這個 cookie。
 */

export const SESSION_COOKIE = "session";
/** session 有效期：14 天 */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

export type AdminUser = {
  uid: string;
  email: string | undefined;
};

/** 用 ID token 建立 session cookie 字串（存進 cookie 前呼叫） */
export async function createSessionCookie(idToken: string): Promise<string> {
  const app = getAdminAppOrNull();
  if (!app) throw new Error("Firebase 尚未設定");
  return getAuth(app).createSessionCookie(idToken, {
    expiresIn: SESSION_MAX_AGE * 1000,
  });
}

/** 讀取並驗證目前登入者，未登入或驗證失敗回傳 null */
export async function getCurrentUser(): Promise<AdminUser | null> {
  const app = getAdminAppOrNull();
  if (!app) return null;

  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;
  if (!session) return null;

  try {
    const decoded = await getAuth(app).verifySessionCookie(session, true);
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    return null;
  }
}

/** 要求必須登入，否則丟出錯誤（給 Server Action 用） */
export async function requireUser(): Promise<AdminUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("未授權，請重新登入");
  return user;
}
