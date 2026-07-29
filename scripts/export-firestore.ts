/**
 * 反向備份腳本：把 Firestore 的 works 集合寫回 src/data/works.ts。
 *
 * 這是 seed-firestore.ts 的相反方向。後台改過的作品資料只存在 Firestore，
 * 跑這支可以把最新狀態同步回原始碼，讓 works.ts 重新成為有效的備份
 * （也是未接 Firebase 時的 fallback 資料）。
 *
 * 執行方式：
 *   npm run backup          # 實際寫檔
 *   npm run backup -- --dry # 只印出會寫入什麼，不動檔案
 *
 * 只替換檔案中 `export const works: Work[] = [ ... ];` 這一段，
 * 上方的型別定義與下方的輔助函式都會原封不動保留。
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { connectFirestore } from "./firestore-admin";

const TARGET = path.join(process.cwd(), "src", "data", "works.ts");
const ARRAY_START = "export const works: Work[] = [";
const ARRAY_END = "\n];";

/**
 * 依 Work 型別的宣告順序輸出欄位。
 * 固定順序才能讓每次產生的檔案穩定，git diff 只會顯示真正改動的內容。
 */
const FIELD_ORDER = [
  "slug",
  "title",
  "description",
  "category",
  "url",
  "cover",
  "tags",
  "year",
  "role",
  "highlight",
  "featured",
  "published",
  "order",
] as const;

/** 把值轉成 TypeScript 字面量（字串會正確跳脫，中文維持原樣） */
function literal(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(literal).join(", ")}]`;
  return JSON.stringify(value);
}

function toObjectLiteral(work: Record<string, unknown>): string {
  const lines = FIELD_ORDER.filter(
    (key) => work[key] !== undefined && work[key] !== null,
  ).map((key) => `    ${key}: ${literal(work[key])},`);
  return `  {\n${lines.join("\n")}\n  },`;
}

async function main() {
  const dryRun = process.argv.includes("--dry");
  const db = connectFirestore();

  const snap = await db.collection("works").orderBy("order", "asc").get();

  // 保險：集合是空的（設定錯了、連到別的專案）就中止，
  // 否則會把現有備份清成空陣列。
  if (snap.empty) {
    console.error(
      "\n❌ Firestore 的 works 集合是空的。為避免清空現有備份，已中止。\n",
    );
    process.exit(1);
  }

  const works = snap.docs.map((doc) => {
    const data = { ...doc.data() };
    delete data.createdAt;
    delete data.updatedAt;
    return data;
  });

  // 若 Firestore 有 Work 型別沒涵蓋的欄位，先警告，避免無聲遺失資料
  const unknownFields = new Set<string>();
  for (const work of works) {
    for (const key of Object.keys(work)) {
      if (!FIELD_ORDER.includes(key as (typeof FIELD_ORDER)[number])) {
        unknownFields.add(key);
      }
    }
  }
  if (unknownFields.size > 0) {
    console.warn(
      `\n⚠️  下列欄位不在 Work 型別中，不會寫進備份：${[...unknownFields].join("、")}`,
    );
    console.warn("   若是新增的欄位，請先把它加進 src/data/works.ts 的 Work 型別與本腳本的 FIELD_ORDER。\n");
  }

  const source = await readFile(TARGET, "utf8");
  const start = source.indexOf(ARRAY_START);
  const end = start === -1 ? -1 : source.indexOf(ARRAY_END, start);
  if (start === -1 || end === -1) {
    console.error(
      `\n❌ 在 ${path.relative(process.cwd(), TARGET)} 找不到 "${ARRAY_START}" 區塊，可能檔案結構被改過。\n`,
    );
    process.exit(1);
  }

  const body = works.map(toObjectLiteral).join("\n");
  const next = `${source.slice(0, start + ARRAY_START.length)}\n${body}${source.slice(end)}`;

  works.forEach((w) => {
    const flag = w.published ? "上架" : "下架";
    console.log(`  ✓ ${w.title}（${w.slug}）— ${flag}`);
  });

  if (dryRun) {
    console.log(
      `\n🔍 dry run：共 ${works.length} 筆，未寫入檔案。拿掉 --dry 才會實際更新。\n`,
    );
    process.exit(0);
  }

  await writeFile(TARGET, next);
  console.log(
    `\n✅ 已把 ${works.length} 筆作品寫回 ${path.relative(process.cwd(), TARGET)}`,
  );
  console.log("   接著用 git diff 檢查改了什麼，確認沒問題再 commit。\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ 備份失敗：", err);
  process.exit(1);
});
