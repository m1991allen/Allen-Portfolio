import { ImageResponse } from "next/og";

/**
 * 瀏覽器分頁與 Google 搜尋結果左側的網站圖示。
 * 沿用站上的深墨紫底 + 紫礦重點色。
 *
 * 註：favicon.ico 無法用程式產生（Next.js 限制），
 * 這支 icon 會輸出 <link rel="icon" href="/icon?..." type="image/png">，
 * 現代瀏覽器與 Google 都吃這個。
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14121c",
          color: "#a78bfa",
          fontSize: 22,
          fontWeight: 700,
          borderRadius: 7,
        }}
      >
        A
      </div>
    ),
    { ...size },
  );
}
