"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import {
  createWork,
  updateWork,
  deleteWork,
  setWorkPublished,
} from "@/lib/works";
import type { Work } from "@/data/works";

export type ActionResult = { ok: true } | { ok: false; error: string };

/** 更新首頁快取，讓改動立即反映在網站上 */
function revalidatePublic() {
  revalidatePath("/");
}

function validate(w: Work): string | null {
  if (!w.slug || !/^[a-z0-9-]+$/.test(w.slug)) {
    return "網址代稱（slug）只能用小寫英文、數字與連字號，且不可空白";
  }
  if (!w.title.trim()) return "請填寫作品標題";
  if (!w.category.trim()) return "請填寫分類";
  // 封面為必填：next/image 收到空字串的 src 會讓前台整頁報錯
  if (!w.cover.trim()) return "請上傳封面圖片";
  if (!/^\d{4}$/.test(w.year)) return "年份請填 4 位數字，例如 2024";
  if (w.url && !/^https?:\/\//.test(w.url)) {
    return "作品網址請以 http:// 或 https:// 開頭";
  }
  return null;
}

/**
 * 新增或更新作品。
 * originalSlug 為 null 代表新增；否則為編輯（可能改了 slug）。
 */
export async function saveWorkAction(
  originalSlug: string | null,
  workJson: string,
): Promise<ActionResult> {
  try {
    await requireUser();
    const work = JSON.parse(workJson) as Work;

    const err = validate(work);
    if (err) return { ok: false, error: err };

    if (originalSlug) {
      await updateWork(originalSlug, work);
    } else {
      await createWork(work);
    }

    revalidatePublic();
    return { ok: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : "儲存失敗";
    return { ok: false, error };
  }
}

/** 上下架切換 */
export async function togglePublishedAction(
  slug: string,
  published: boolean,
): Promise<ActionResult> {
  try {
    await requireUser();
    await setWorkPublished(slug, published);
    revalidatePublic();
    return { ok: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : "更新失敗";
    return { ok: false, error };
  }
}

/** 刪除作品 */
export async function deleteWorkAction(slug: string): Promise<ActionResult> {
  try {
    await requireUser();
    await deleteWork(slug);
    revalidatePublic();
    return { ok: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : "刪除失敗";
    return { ok: false, error };
  }
}
