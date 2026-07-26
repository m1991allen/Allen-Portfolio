/**
 * 一次性匯入腳本：把 src/data/works.ts 的作品搬進 Firestore。
 *
 * 執行方式（先設定好 .env.local）：
 *   npm run seed
 *
 * 這會把每一筆作品寫進 Firestore 的 works 集合，
 * 文件 ID = 作品的 slug。重複執行會覆蓋既有資料（不會重複新增）。
 */

import { cert, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { works } from "../src/data/works";

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

async function main() {
  const app = initializeApp({ credential: cert(loadServiceAccount()) });
  const db = getFirestore(app);

  console.log(`\n開始匯入 ${works.length} 筆作品到 Firestore…\n`);

  const now = new Date().toISOString();
  const batch = db.batch();

  works.forEach((work, index) => {
    const ref = db.collection("works").doc(work.slug);
    batch.set(ref, {
      ...work,
      order: work.order ?? index,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`  ✓ ${work.title}（${work.slug}）`);
  });

  await batch.commit();
  console.log(`\n✅ 完成！已匯入 ${works.length} 筆作品。\n`);
  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ 匯入失敗：", err);
  process.exit(1);
});
