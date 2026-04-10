/**
 * Scene 4 — CTA
 * Sequence duration: 240f（4秒）
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const fi = (f: number, input: number[], output: number[]) =>
  interpolate(f, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// ── モックQRコード ──────────────────────────────────────
const QR_DATA: number[][] = [
  [1,1,1,1,1,1,1,0,1,0,1,0,0,0,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,1,1,0,1,0,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,0,1,0,1,1,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,0,0,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,0,1,1,1,0,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0],
  [1,0,1,1,0,1,1,1,0,0,1,1,0,1,0,1,1,0,1,1,0],
  [0,1,1,0,0,1,0,1,1,0,0,1,0,1,1,0,0,1,0,0,1],
  [1,0,0,1,1,0,1,0,0,1,1,0,1,0,1,1,0,0,1,0,0],
  [0,1,0,0,1,0,0,0,1,0,0,0,0,1,0,1,0,0,0,1,0],
  [1,1,1,1,0,1,1,0,0,1,0,1,1,0,1,0,0,1,1,0,1],
  [0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0,0,1,0],
  [1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,0,0,1,0,0,1],
  [1,0,0,0,0,0,1,0,1,0,1,1,0,1,0,1,0,0,1,0,0],
  [1,0,1,1,1,0,1,0,0,1,0,0,0,0,1,0,1,0,0,1,0],
  [1,0,1,1,1,0,1,0,1,0,1,1,0,1,0,1,0,0,1,0,0],
  [1,0,1,1,1,0,1,0,0,0,0,0,1,0,1,0,0,1,0,0,1],
  [1,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,1,0,0,1,0],
  [1,1,1,1,1,1,1,0,0,1,0,1,0,0,1,1,0,1,0,0,1],
];

const MockQR: React.FC<{ size: number }> = ({ size }) => {
  const cols  = QR_DATA[0].length;
  const rows  = QR_DATA.length;
  const pad   = Math.round(size * 0.05);
  const inner = size - pad * 2;
  const cw    = inner / cols;
  const ch    = inner / rows;
  return (
    <div
      style={{
        width: size,
        height: size,
        background: "white",
        borderRadius: 16,
        padding: pad,
        boxSizing: "border-box",
        boxShadow: "0 0 24px rgba(16,185,129,0.25)",
      }}
    >
      <div style={{ position: "relative", width: inner, height: inner }}>
        {QR_DATA.flatMap((row, ri) =>
          row.map((cell, ci) =>
            cell ? (
              <div
                key={`${ri}-${ci}`}
                style={{
                  position: "absolute",
                  left: ci * cw,
                  top: ri * ch,
                  width: cw + 0.5,
                  height: ch + 0.5,
                  background: "#18181b",
                }}
              />
            ) : null
          )
        )}
      </div>
    </div>
  );
};

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── シーンフェードイン ──
  const sceneOp = fi(frame, [0, 20], [0, 1]);

  // ── 各要素のスタガー登場ヘルパー ──
  const stagger = (delay: number, damping = 14, stiffness = 100) => {
    const s = spring({
      frame: Math.max(0, frame - delay),
      fps,
      from: 0,
      to: 1,
      config: { damping, stiffness, mass: 0.95 },
    });
    return {
      opacity: fi(frame, [delay, delay + 30], [0, 1]),
      y:       interpolate(s, [0, 1], [50, 0]),
    };
  };

  const logoAnim  = stagger(5);
  const hlAnim    = stagger(40);
  const subAnim   = stagger(80);
  const qrAnim    = stagger(120);
  const ctaAnim   = stagger(165, 10, 110);  // バウンス感

  // ── CTAボタンのパルス ──
  const ctaPulse = Math.sin(((frame - 165) / 18) * Math.PI) * 0.12 + 0.88;
  const ctaReady = frame >= 195;

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
        padding: "80px 56px",
      }}
    >
      {/* ── 背景グロー ── */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 700,
          height: 700,
          background:
            "radial-gradient(circle,rgba(16,185,129,0.07) 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── ロゴバッジ ── */}
      <div
        style={{
          opacity: logoAnim.opacity,
          transform: `translateY(${logoAnim.y}px)`,
          marginBottom: 28,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.28)",
            borderRadius: 50,
            padding: "12px 30px",
          }}
        >
          <span style={{ fontSize: 34 }}>🔮</span>
          <p
            style={{
              fontSize: 30,
              fontWeight: 900,
              letterSpacing: "0.05em",
              background: "linear-gradient(135deg,#10b981,#34d399)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SUPPLEMENT ORACLE
          </p>
        </div>
      </div>

      {/* ── メインキャッチコピー ── */}
      <div
        style={{
          opacity: hlAnim.opacity,
          transform: `translateY(${hlAnim.y}px)`,
          textAlign: "center",
          marginBottom: 28,
        }}
      >
        <p
          style={{
            fontFamily:
              '"Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif',
            fontSize: 46,
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: "0.015em",
            color: "#f1f5f9",
          }}
        >
          物理的な制約をなくし、
          <br />
          <span
            style={{
              color: "#10b981",
              textShadow: "0 0 20px rgba(16,185,129,0.35)",
            }}
          >
            さらに儲かるジムへ。
          </span>
        </p>
      </div>

      {/* ── サブコピー ── */}
      <div
        style={{
          opacity: subAnim.opacity,
          transform: `translateY(${subAnim.y}px)`,
          textAlign: "center",
          marginBottom: 50,
        }}
      >
        <p style={{ color: "#94a3b8", fontSize: 27, lineHeight: 1.75 }}>
          まずは完全無料の
          <span style={{ color: "#f1f5f9", fontWeight: 800 }}>
            「梅プラン」
          </span>
          で。
          <br />
          クレカ不要・いつでも解約OK
        </p>
      </div>

      {/* ── QR ＋ 検索バー ── */}
      <div
        style={{
          opacity: qrAnim.opacity,
          transform: `translateY(${qrAnim.y}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          width: "100%",
          marginBottom: 40,
        }}
      >
        <MockQR size={196} />
        {/* 検索バー */}
        <div
          style={{
            width: "100%",
            background: "rgba(10,16,30,0.9)",
            border: "1px solid rgba(71,85,105,0.4)",
            borderRadius: 50,
            padding: "16px 30px",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span style={{ fontSize: 24 }}>🔍</span>
          <span style={{ color: "#94a3b8", fontSize: 25 }}>
            supplement-oracle.jp
          </span>
          <div
            style={{
              marginLeft: "auto",
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: 20,
              padding: "6px 16px",
            }}
          >
            <span style={{ color: "#10b981", fontSize: 19, fontWeight: 700 }}>
              無料登録
            </span>
          </div>
        </div>
      </div>

      {/* ── CTAボタン ── */}
      <div
        style={{
          opacity: ctaAnim.opacity,
          transform: `translateY(${ctaAnim.y}px) scale(${ctaReady ? ctaPulse : 1})`,
          width: "100%",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg,#10b981 0%,#059669 100%)",
            borderRadius: 50,
            padding: "28px 60px",
            textAlign: "center",
            boxShadow: `0 8px 44px rgba(16,185,129,${0.4 + (ctaReady ? ctaPulse * 0.15 : 0)}), 0 0 0 1px rgba(16,185,129,0.25)`,
          }}
        >
          <p style={{ color: "white", fontSize: 36, fontWeight: 900 }}>
            今すぐ無料で始める
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 22,
              marginTop: 6,
            }}
          >
            30秒で登録完了 · 完全無料プランあり
          </p>
        </div>
      </div>
    </div>
  );
};
