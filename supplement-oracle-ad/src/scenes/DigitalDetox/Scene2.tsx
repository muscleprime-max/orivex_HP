/**
 * Scene 2 — デジタルへのパラダイムシフト
 * Sequence duration: 210f（3.5秒）
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const fi = (f: number, input: number[], output: number[]) =>
  interpolate(f, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const LABEL   = "DIGITAL TRANSFORMATION";
const LETTERS = LABEL.split("");

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── シーンフェード ──
  const sceneOp = fi(frame, [0, 18, 185, 210], [0, 1, 1, 0]);

  // ── グロー発光強度（サイン波でパルス） ──
  const glowBase  = fi(frame, [0, 50], [0, 1]);
  const glowPulse = Math.sin(((frame - 40) / 30) * Math.PI) * 0.25 + 0.75;
  const glow      = glowBase * glowPulse;

  // ── 文字ごとのスプリング登場（2fずつずれ） ──
  const letterStart = 5;
  const letterGap   = 2.2;

  // ── セパレーターライン ──
  const lineWidth = fi(frame, [55, 90], [0, 100]);
  const lineOp    = fi(frame, [55, 75], [0, 1]);

  // ── サブタイトル ──
  const subSp = spring({
    frame: Math.max(0, frame - 80),
    fps,
    from: 0,
    to: 1,
    config: { damping: 14, stiffness: 100, mass: 1 },
  });
  const subOp = fi(frame, [80, 105], [0, 1]);
  const subY  = interpolate(subSp, [0, 1], [40, 0]);

  // ── キャッチコピー ──
  const catchSp = spring({
    frame: Math.max(0, frame - 120),
    fps,
    from: 0,
    to: 1,
    config: { damping: 13, stiffness: 90, mass: 1.1 },
  });
  const catchOp = fi(frame, [120, 148], [0, 1]);
  const catchY  = interpolate(catchSp, [0, 1], [36, 0]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: sceneOp,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 56px",
      }}
    >
      {/* ── 背景グロー ── */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(16,185,129,${glow * 0.08}) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* ── "DIGITAL TRANSFORMATION" 文字群 ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 0,
          marginBottom: 10,
          lineHeight: 1,
        }}
      >
        {LETTERS.map((char, i) => {
          const start  = letterStart + i * letterGap;
          const lSp    = spring({
            frame: Math.max(0, frame - start),
            fps,
            from: 0,
            to: 1,
            config: { damping: 10, stiffness: 200, mass: 0.6 },
          });
          const lOp    = fi(frame, [start, start + 12], [0, 1]);
          const lY     = interpolate(lSp, [0, 0.6, 0.8, 1], [28, -5, 2, 0]);
          const lScale = interpolate(lSp, [0, 0.5, 1], [0.7, 1.08, 1]);

          return (
            <span
              key={i}
              style={{
                opacity: lOp,
                transform: `translateY(${lY}px) scale(${lScale})`,
                display: "inline-block",
                color: "#10b981",
                fontSize: char === " " ? 0 : 60,
                width: char === " " ? 18 : "auto",
                fontWeight: 900,
                letterSpacing: "0.04em",
                fontFamily:
                  '"SF Pro Display","Helvetica Neue","Arial",sans-serif',
                textShadow: `
                  0 0 20px rgba(16,185,129,${glow * 0.9}),
                  0 0 40px rgba(16,185,129,${glow * 0.5}),
                  0 0 80px rgba(16,185,129,${glow * 0.25})
                `,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </div>

      {/* ── セパレーターライン ── */}
      <div
        style={{
          opacity: lineOp,
          width: `${lineWidth}%`,
          height: 2,
          background:
            "linear-gradient(90deg, transparent, #10b981, #34d399, #10b981, transparent)",
          boxShadow: "0 0 16px rgba(16,185,129,0.6)",
          marginBottom: 40,
          borderRadius: 1,
        }}
      />

      {/* ── サブタイトル ── */}
      <p
        style={{
          opacity: subOp,
          transform: `translateY(${subY}px)`,
          fontFamily:
            '"Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif',
          color: "#e2e8f0",
          fontSize: 40,
          fontWeight: 700,
          lineHeight: 1.4,
          letterSpacing: "0.02em",
          textAlign: "center",
          marginBottom: 36,
        }}
      >
        管理不要の
        <br />
        <span
          style={{
            color: "#10b981",
            textShadow: "0 0 20px rgba(16,185,129,0.4)",
          }}
        >
          「デジタル処方箋」
        </span>
        へ。
      </p>

      {/* ── キャッチコピーバッジ ── */}
      <div
        style={{
          opacity: catchOp,
          transform: `translateY(${catchY}px)`,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          width: "100%",
        }}
      >
        {[
          { icon: "✅", label: "在庫ゼロ", desc: "物理的な在庫を一切持たない" },
          { icon: "✅", label: "メンテゼロ", desc: "清掃・補充・期限管理が不要" },
          { icon: "✅", label: "コストゼロ", desc: "初期導入コスト0円・梅プラン無料" },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              opacity: fi(frame, [120 + i * 18, 120 + i * 18 + 22], [0, 1]),
              transform: `translateX(${interpolate(
                spring({
                  frame: Math.max(0, frame - (120 + i * 18)),
                  fps,
                  from: 0,
                  to: 1,
                  config: { damping: 16, stiffness: 130 },
                }),
                [0, 1],
                [-30, 0]
              )}px)`,
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: "rgba(16,185,129,0.06)",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: 16,
              padding: "16px 24px",
            }}
          >
            <span style={{ fontSize: 26 }}>{item.icon}</span>
            <div>
              <span
                style={{
                  color: "#10b981",
                  fontSize: 26,
                  fontWeight: 800,
                  marginRight: 12,
                }}
              >
                {item.label}
              </span>
              <span style={{ color: "#64748b", fontSize: 22 }}>{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
