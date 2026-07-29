import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site, siteUrl } from "@/data/site";

/**
 * 首頁分享卡片（Facebook / LINE / Slack / X 共用）。
 *
 * 注意：ImageResponse 底層的 satori 不會讀系統字型，中文字必須自己帶。
 * assets/noto-sans-tc-og-subset.ttf 是用 Google Fonts 的 text= 參數
 * 只切出本圖用到的字元（14KB），不要塞完整 CJK 字重（數 MB）。
 * → 若改了下方文案並新增中文字，請重新產生字型子集，否則新字會變空白。
 */

export const alt = `${site.name}｜前端工程師作品集`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#14121c";
const PAPER = "#faf9fc";
const ACCENT = "#a78bfa";
const MUTED = "#857e99";

export default async function Image() {
  const notoSansTC = await readFile(
    join(process.cwd(), "assets/noto-sans-tc-og-subset.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: "72px 80px",
          fontFamily: "Noto Sans TC",
          position: "relative",
        }}
      >
        {/* 右上角的紫色光暈，呼應站上 Hero 的視覺 */}
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -180,
            width: 620,
            height: 620,
            borderRadius: 620,
            background: "#7c3aed",
            opacity: 0.28,
            filter: "blur(120px)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 14,
              background: ACCENT,
            }}
          />
          <div
            style={{
              fontSize: 24,
              letterSpacing: 6,
              color: ACCENT,
            }}
          >
            FRONT-END ENGINEER
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.28,
              color: PAPER,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>把複雜的資料，</span>
            <span>變成看得懂的介面。</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: `1px solid #2a2635`,
            paddingTop: 32,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 44, color: PAPER }}>{site.name}</div>
            <div style={{ fontSize: 24, color: MUTED }}>
              React · 互動網頁 · 資料視覺化 · AI 應用
            </div>
          </div>
          <div style={{ fontSize: 24, color: MUTED }}>
            {siteUrl.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Noto Sans TC",
          data: notoSansTC,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
