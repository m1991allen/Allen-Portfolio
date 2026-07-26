import "server-only";

import {
  getApps,
  initializeApp,
  cert,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

/**
 * Firebase Admin SDK（伺服器端）。
 *
 * 只在伺服器上執行，用來讀寫 Firestore、上傳 Storage。
 * 使用 base64 編碼的服務帳戶金鑰（見 .env.local.example）。
 *
 * 若尚未設定環境變數，isFirebaseConfigured() 會回傳 false，
 * 呼叫端可據此 fallback 到預設資料，避免整站壞掉。
 */

let cachedApp: App | null = null;

function readServiceAccount(): ServiceAccount | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;

  try {
    // 支援兩種格式：直接貼 JSON，或 base64 編碼後的 JSON
    const json = raw.trim().startsWith("{")
      ? raw
      : Buffer.from(raw, "base64").toString("utf8");
    const parsed = JSON.parse(json);
    return {
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: parsed.private_key,
    };
  } catch (err) {
    console.error(
      "[firebase-admin] 無法解析 FIREBASE_SERVICE_ACCOUNT_KEY，請確認格式正確",
      err,
    );
    return null;
  }
}

/** 是否已完成 Firebase 後端設定 */
export function isFirebaseConfigured(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
}

function getAdminApp(): App | null {
  if (cachedApp) return cachedApp;
  if (getApps().length > 0) {
    cachedApp = getApps()[0]!;
    return cachedApp;
  }

  const serviceAccount = readServiceAccount();
  if (!serviceAccount) return null;

  cachedApp = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
  return cachedApp;
}

/** 取得 Firestore 實例，未設定時回傳 null */
export function getDb(): Firestore | null {
  const app = getAdminApp();
  return app ? getFirestore(app) : null;
}

/** 取得 Storage bucket，未設定時回傳 null */
export function getBucket() {
  const app = getAdminApp();
  if (!app) return null;
  return getStorage(app).bucket();
}

/** 取得 Admin App（給 Auth 用），未設定時回傳 null */
export function getAdminAppOrNull(): App | null {
  return getAdminApp();
}
