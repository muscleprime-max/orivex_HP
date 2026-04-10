/**
 * DigitalDetox — 第5弾 PR動画
 * テーマ：在庫・管理コストの削減と完全デジタル化
 * 総尺: 1140f（19秒）@ 60fps / 1080 × 1920
 *
 * ┌────────────────────────────────────────────┐
 * │  Sequence  │  from  │ duration │  尺      │
 * ├────────────────────────────────────────────┤
 * │  Scene 1   │    0   │   360    │  6.0 秒  │
 * │  Scene 2   │   360  │   210    │  3.5 秒  │
 * │  Scene 3   │   570  │   330    │  5.5 秒  │
 * │  Scene 4   │   900  │   240    │  4.0 秒  │
 * └────────────────────────────────────────────┘
 */
import React from "react";
import { Sequence } from "remotion";
import { Scene1 } from "./Scene1";
import { Scene2 } from "./Scene2";
import { Scene3 } from "./Scene3";
import { Scene4 } from "./Scene4";

// ── タイムライン定数 ──────────────────────────────────────
const S1_FROM = 0;
const S1_DUR  = 360;

const S2_FROM = S1_FROM + S1_DUR;   // 360
const S2_DUR  = 210;

const S3_FROM = S2_FROM + S2_DUR;   // 570
const S3_DUR  = 330;

const S4_FROM = S3_FROM + S3_DUR;   // 900
const S4_DUR  = 240;

export const DigitalDetox: React.FC = () => (
  <div
    style={{
      width: 1080,
      height: 1920,
      background: "#18181b",
      position: "relative",
      overflow: "hidden",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Noto Sans JP", sans-serif',
    }}
  >
    {/* ── グローバル背景グリッド ── */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "linear-gradient(rgba(16,185,129,0.025) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(16,185,129,0.025) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        pointerEvents: "none",
      }}
    />

    {/* ── シーン 1: 課題提示 ── */}
    <Sequence from={S1_FROM} durationInFrames={S1_DUR} name="Scene1-課題提示">
      <Scene1 />
    </Sequence>

    {/* ── シーン 2: DXパラダイムシフト ── */}
    <Sequence from={S2_FROM} durationInFrames={S2_DUR} name="Scene2-DX転換">
      <Scene2 />
    </Sequence>

    {/* ── シーン 3: ソリューション ── */}
    <Sequence from={S3_FROM} durationInFrames={S3_DUR} name="Scene3-ソリューション">
      <Scene3 />
    </Sequence>

    {/* ── シーン 4: CTA ── */}
    <Sequence from={S4_FROM} durationInFrames={S4_DUR} name="Scene4-CTA">
      <Scene4 />
    </Sequence>
  </div>
);
