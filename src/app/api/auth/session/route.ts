import { NextResponse } from "next/server";
import {
  createSessionCookie,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/auth";

/**
 * 登入 / 登出的 session cookie 端點。
 * - POST：登入頁送來 ID token，換成 httpOnly session cookie
 * - DELETE：登出，清除 cookie
 */

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "缺少 idToken" }, { status: 400 });
    }

    const sessionCookie = await createSessionCookie(idToken);

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("[auth/session] 建立 session 失敗", err);
    return NextResponse.json({ error: "登入失敗，請再試一次" }, { status: 401 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
