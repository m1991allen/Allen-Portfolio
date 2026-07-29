/**
 * X / Twitter 的分享圖與 OG 圖共用同一張，直接轉出 opengraph-image 的實作。
 * （X 雖然會 fallback 到 og:image，但明確給 twitter:image 比較保險。）
 */
export { default, alt, size, contentType } from "./opengraph-image";
