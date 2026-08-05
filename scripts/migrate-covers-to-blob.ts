/**
 * 一次性搬遷腳本：把所有作品封面統一成「Vercel Blob + /api/cover 出口」。
 *
 * 搬完之後每一筆的 cover 都長 /api/cover/works/{uuid}.jpg，
 * 不再有本機 public/works 檔案，blob 的公開網址也不會再出現在頁面上。
 *
 * 三種來源：
 *   1. /works/{slug}.jpg                  → 讀本機 public/works 的檔案後上傳
 *   2. https://…blob.vercel-storage.com/… → 已經在自家 store，只改寫 cover 路徑
 *   3. 其他外部網址                        → 抓回來重新上傳
 * 已經是 /api/cover/ 開頭的直接略過，重跑不會重複搬。
 *
 * 執行：
 *   node --env-file=.env.local --import tsx scripts/migrate-covers-to-blob.ts --dry
 *   node --env-file=.env.local --import tsx scripts/migrate-covers-to-blob.ts
 */

import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { blobAuth } from "../src/lib/blob-auth";
import { COVER_ROUTE, coverSrcFor } from "../src/lib/cover-path";
import { connectFirestore } from "./firestore-admin";

const BLOB_PREFIX = "works";
const DRY = process.argv.includes("--dry");

/** 已經在自家 store 的圖：從公開網址取出 blob pathname，不必重新上傳 */
function existingBlobPath(cover: string): string | null {
  if (!cover.includes(".blob.vercel-storage.com")) return null;
  try {
    return new URL(cover).pathname.replace(/^\//, "");
  } catch {
    return null;
  }
}

/** 取得要上傳的位元組：本機檔案或外部網址 */
async function loadSource(cover: string): Promise<Buffer> {
  if (cover.startsWith("/")) {
    return readFile(path.join(process.cwd(), "public", cover.slice(1)));
  }
  const res = await fetch(cover);
  if (!res.ok) throw new Error(`下載失敗 HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const db = connectFirestore();
  const snap = await db.collection("works").orderBy("order", "asc").get();

  const migrated: string[] = [];
  const skipped: string[] = [];
  const failed: string[] = [];

  for (const doc of snap.docs) {
    const slug = doc.id;
    const cover: string = doc.data().cover ?? "";

    if (!cover || cover.startsWith(COVER_ROUTE)) {
      skipped.push(slug);
      continue;
    }

    try {
      // 已在自家 store：只改 cover 指向，圖不動
      const reuse = existingBlobPath(cover);
      if (reuse) {
        if (!DRY) {
          await doc.ref.update({
            cover: coverSrcFor(reuse),
            updatedAt: new Date().toISOString(),
          });
        }
        console.log(`  ${DRY ? "·" : "✓"} ${slug.padEnd(20)} 沿用既有 blob → ${coverSrcFor(reuse)}`);
        migrated.push(slug);
        continue;
      }

      const buffer = await loadSource(cover);
      const blobPath = `${BLOB_PREFIX}/${randomUUID()}.jpg`;

      if (DRY) {
        console.log(
          `  · ${slug.padEnd(20)} ${cover} → ${coverSrcFor(blobPath)} (${Math.round(buffer.length / 1024)}KB)`,
        );
        migrated.push(slug);
        continue;
      }

      await put(blobPath, buffer, {
        access: "public",
        addRandomSuffix: false,
        cacheControlMaxAge: 60 * 60 * 24 * 365,
        ...blobAuth(),
      });
      await doc.ref.update({
        cover: coverSrcFor(blobPath),
        updatedAt: new Date().toISOString(),
      });

      console.log(`  ✓ ${slug.padEnd(20)} → ${coverSrcFor(blobPath)}`);
      migrated.push(slug);
    } catch (err) {
      console.error(`  ✗ ${slug.padEnd(20)} ${(err as Error).message}`);
      failed.push(slug);
    }
  }

  console.log("\n──────── 完成 ────────");
  console.log(`${DRY ? "將搬遷" : "已搬遷"} ${migrated.length} 筆`);
  console.log(`略過（已是新制）${skipped.length} 筆：${skipped.join(", ") || "（無）"}`);
  if (failed.length) console.log(`❌ 失敗 ${failed.length} 筆：${failed.join(", ")}`);
  if (DRY) console.log("\n這是 dry run，沒有實際寫入。拿掉 --dry 才會真的搬。");
  else console.log("\n接著跑 npm run backup 把 cover 同步回 src/data/works.ts。");

  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
