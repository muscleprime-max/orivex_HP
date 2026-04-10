/**
 * Scene 1 — 物理サーバーの課題提示
 * Sequence duration: 360f（6秒）
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

// ── ユーティリティ ────────────────────────────────────────
const fi = (f: number, input: number[], output: number[]) =>
  interpolate(f, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const sp = (frame: number, fps: number, delay: number, cfg?: object) =>
  spring({
    frame: Math.max(0, frame - delay),
    fps,
    from: 0,
    to: 1,
    config: { damping: 14, stiffness: 110, mass: 0.9, ...cfg },
  });

// ── 課題データ ────────────────────────────────────────────
const ISSUES = [
  {
    icon: "🔄",
    text: "粉末の補充",
    sub: "定期補充・計量の手間と時間",
    color: "#f59e0b",
  },
  {
    icon: "🧹",
    text: "日々の清掃",
    sub: "機器衛生管理に毎日のコスト",
    color: "#f59e0b",
  },
  {
    icon: "📅",
    text: "賞味期限の管理",
    sub: "期限切れ廃棄による損失リスク",
    color: "#f97316",
  },
  {
    icon: "📦",
    text: "在庫リスク",
    sub: "売れ残り・機会損失・キャッシュロック",
    color: "#ef4444",
  },
];

const ISSUE_START = 135;
const ISSUE_GAP   = 48;

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── フェードイン／アウト ──
  const sceneOp = fi(frame, [0, 20, 330, 360], [0, 1, 1, 0]);

  // ── ヘッドライン 1 ──
  const h1Sp = sp(frame, fps, 0, { stiffness: 120 });
  const h1Op = fi(frame, [0, 22], [0, 1]);
  const h1Y  = interpolate(h1Sp, [0, 1], [44, 0]);

  // ── ヘッドライン 2 ──
  const h2Sp = sp(frame, fps, 32, { stiffness: 110 });
  const h2Op = fi(frame, [32, 56], [0, 1]);
  const h2Y  = interpolate(h2Sp, [0, 1], [44, 0]);

  // ── アラートカード ──
  const cardSp = sp(frame, fps, 78, { damping: 13, stiffness: 80, mass: 1.15 });
  const cardOp = fi(frame, [78, 110], [0, 1]);
  const cardY  = interpolate(cardSp, [0, 1], [320, 0]);

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
        padding: "0 52px",
      }}
    >
      {/* ── ヘッドラインブロック ── */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 56,
          width: "100%",
        }}
      >
        {/* サブラベル */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.3)",
            borderRadius: 50,
            padding: "8px 22px",
            marginBottom: 24,
            opacity: h1Op,
          }}
        >
          <span style={{ fontSize: 18 }}>⚠️</span>
          <span
            style={{
              color: "#f59e0b",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            MANAGEMENT COST ALERT
          </span>
        </div>

        <p
          style={{
            opacity: h1Op,
            transform: `translateY(${h1Y}px)`,
            fontFamily:
              '"Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif',
            color: "#f1f5f9",
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "0.025em",
            marginBottom: 16,
          }}
        >
          サプリの物販、
        </p>
        <p
          style={{
            opacity: h2Op,
            transform: `translateY(${h2Y}px)`,
            fontFamily:
              '"Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif',
            color: "#94a3b8",
            fontSize: 34,
            fontWeight: 500,
            lineHeight: 1.6,
            letterSpacing: "0.015em",
          }}
        >
          在庫と管理に
          <br />
          追われていませんか？
        </p>
      </div>

      {/* ── アラートカード ── */}
      <div
        style={{
          opacity: cardOp,
          transform: `translateY(${cardY}px)`,
          width: "100%",
          background: "rgba(15,15,18,0.97)",
          border: "1.5px solid rgba(245,158,11,0.35)",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow:
            "0 0 80px rgba(245,158,11,0.08), 0 24px 64px rgba(0,0,0,0.7)",
        }}
      >
        {/* カードヘッダー */}
        <div
          style={{
            background:
              "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(239,68,68,0.06))",
            borderBottom: "1px solid rgba(245,158,11,0.2)",
            padding: "22px 32px",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "rgba(245,158,11,0.12)",
              border: "1px solid rgba(245,158,11,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              flexShrink: 0,
            }}
          >
            ⚠️
          </div>
          <div>
            <p
              style={{
                color: "#f59e0b",
                fontSize: 21,
                fontWeight: 800,
                letterSpacing: "0.07em",
              }}
            >
              COST ISSUES DETECTED
            </p>
            <p style={{ color: "#78716c", fontSize: 18 }}>
              物理的サプリ管理の隠れたコスト
            </p>
          </div>
          <div
            style={{
              marginLeft: "auto",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 20,
              padding: "6px 16px",
              flexShrink: 0,
            }}
          >
            <p
              style={{
                color: "#ef4444",
                fontSize: 17,
                fontWeight: 700,
              }}
            >
              検出: {ISSUES.length}件
            </p>
          </div>
        </div>

        {/* 課題リスト */}
        <div style={{ padding: "8px 0" }}>
          {ISSUES.map((issue, i) => {
            const start = ISSUE_START + i * ISSUE_GAP;
            const iSp   = sp(frame, fps, start, { stiffness: 130, damping: 16 });
            const iOp   = fi(frame, [start, start + 20], [0, 1]);
            const iX    = interpolate(iSp, [0, 1], [-50, 0]);

            return (
              <div
                key={i}
                style={{
                  opacity: iOp,
                  transform: `translateX(${iX}px)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "18px 32px",
                  borderBottom:
                    i < ISSUES.length - 1
                      ? "1px solid rgba(255,255,255,0.05)"
                      : "none",
                }}
              >
                {/* アイコン */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: `${issue.color}15`,
                    border: `1px solid ${issue.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {issue.icon}
                </div>
                {/* テキスト */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      color: "#f1f5f9",
                      fontSize: 28,
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    {issue.text}
                  </p>
                  <p style={{ color: "#64748b", fontSize: 20, marginTop: 3 }}>
                    {issue.sub}
                  </p>
                </div>
                {/* 警告ドット */}
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: issue.color,
                    flexShrink: 0,
                    boxShadow: `0 0 10px ${issue.color}`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* カードフッター */}
        <div
          style={{
            background: "rgba(239,68,68,0.06)",
            borderTop: "1px solid rgba(239,68,68,0.15)",
            padding: "14px 32px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            opacity: fi(frame, [ISSUE_START + ISSUES.length * ISSUE_GAP, ISSUE_START + ISSUES.length * ISSUE_GAP + 25], [0, 1]),
          }}
        >
          <span style={{ fontSize: 18 }}>💸</span>
          <p style={{ color: "#ef4444", fontSize: 20, fontWeight: 700 }}>
            これらのコスト、すべてゼロにできます。
          </p>
        </div>
      </div>
    </div>
  );
};
