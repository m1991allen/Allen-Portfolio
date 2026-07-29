/**
 * 腳本共用的 Firestore 連線。
 *
 * 注意：不能直接用 src/lib/firebase-admin.ts，因為那支有 `import "server-only"`，
 * 只能在 Next.js 伺服器環境裡跑；這裡是純 Node 腳本。
 *
 * 憑證來自 .env.local 的 FIREBASE_SERVICE_ACCOUNT_KEY，
 * 支援直接貼 JSON 或 base64 編碼兩種格式。
 */

import {
  cert,
  getApps,
  initializeApp,
  type ServiceAccount,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function loadServiceAccount(): ServiceAccount {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    console.error(
      "\n❌ 找不到 FIREBASE_SERVICE_ACCOUNT_KEY，請確認 .env.local 已設定。\n",
    );
    process.exit(1);
  }
  const json = raw.trim().startsWith("{")
    ? raw
    : Buffer.from(raw, "base64").toString("utf8");
  const parsed = JSON.parse(json);
  return {
    projectId: parsed.project_id,
    clientEmail: parsed.client_email,
    privateKey: parsed.private_key,
  };
}

/** 連上 Firestore（重複呼叫會沿用同一個 app） */
export function connectFirestore(): Firestore {
  const app = getApps()[0] ?? initializeApp({ credential: cert(loadServiceAccount()) });
  return getFirestore(app);
}
