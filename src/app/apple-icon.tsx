import { ImageResponse } from "next/og";

/** iOS「加入主畫面」用的圖示。尺寸固定 180×180，且不吃圓角（系統會自己裁）。 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 112,
          fontWeight: 700,
        }}
      >
        A
      </div>
    ),
    { ...size },
  );
}
