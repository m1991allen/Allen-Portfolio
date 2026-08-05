/**
 * Vercel Blob 的憑證選項。
 *
 * 這個專案在 Vercel 上是走 OIDC（平台自動注入 VERCEL_OIDC_TOKEN），
 * 但 OIDC 只對 production / preview 開啟；而 `vercel env pull` 又會把
 * VERCEL_OIDC_TOKEN 一起寫進 .env.local，@vercel/blob 看到它就優先走 OIDC，
 * 於是本機寫入一律被擋：
 *
 *   Vercel Blob: OIDC is enabled for this project, but not for the "development" environment.
 *
 * 明確帶上 token 可以蓋過 OIDC，所以本機只要 .env.local 有 BLOB_READ_WRITE_TOKEN
 * 就走 token；Vercel 上沒有這個變數，就回到平台的 OIDC。
 *
 * 這支刻意不相依伺服器模組，App 與 scripts/ 兩邊都能 import。
 */

export function blobAuth(): { token?: string } {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  return token ? { token } : {};
}
