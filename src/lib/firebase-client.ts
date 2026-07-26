import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

/**
 * Firebase 前端 SDK。
 *
 * 只用在後台登入頁：讓管理者用 email / 密碼登入，
 * 取得 ID token 後交換成伺服器端的 session cookie。
 * 其餘的資料讀寫全部在伺服器端用 Admin SDK 完成。
 */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

/** 前端是否已完成 Firebase 設定 */
export function isClientConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain);
}

let app: FirebaseApp | undefined;

export function getClientAuth(): Auth {
  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return getAuth(app);
}
