/**
 * Scene 3 — ソリューション：スマホ一つで完結
 * Sequence duration: 330f（5.5秒）
 */
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const fi = (f: number, input: number[], output: number[]) =>
  interpolate(f, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const ITEMS = [
  {
    icon: "🥛",
    name: "WPIプロテイン（バニラ）",
    brand: "Optimum Nutrition",
    price: "¥5,800",
    tag: "優先度 HIGH",
    tagColor: "#10b981",
  },
  {
    icon: "⚡",
    name: "クレアチン モノハイドレート",
    brand: "MuscleTech",
    price: "¥2,400",
    tag: "推奨",
    tagColor: "#06b6d4",
  },
  {
    icon: "🌿",
    name: "BCAA（グレープフルーツ）",
    brand: "Scivation",
    price: "¥3,200",
    tag: "補助",
    tagColor: "#8b5cf6",
  },
];

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── シーンフェード ──
  const sceneOp = fi(frame, [0, 20, 300, 330], [0, 1, 1, 0]);

  // ── ヘッドライン ──
  const hlSp = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 14, stiffness: 120 },
  });
  const hlOp = fi(frame, [0, 22], [0, 1]);
  const hlY  = interpolate(hlSp, [0, 1], [40, 0]);

  // ── アプリカード ──
  const cardSp = spring({
    frame: Math.max(0, frame - 20),
    fps,
    from: 0,
    to: 1,
    config: { damping: 13, stiffness: 80, mass: 1.2 },
  });
  const cardOp = fi(frame, [20, 55], [0, 1]);
  const cardY  = interpolate(cardSp, [0, 1], [600, 0]);

  // ── キャッチコピー1 ──
  const c1Sp = spring({
    frame: Math.max(0, frame - 180),
    fps,
    from: 0,
    to: 1,
    config: { damping: 14, stiffness: 100 },
  });
  const c1Op = fi(frame, [180, 205], [0, 1]);
  const c1Y  = interpolate(c1Sp, [0, 1], [36, 0]);

  // ── キャッチコピー2 ──
  const c2Sp = spring({
    frame: Math.max(0, frame - 215),
    fps,
    from: 0,
    to: 1,
    config: { damping: 14, stiffness: 95 },
  });
  const c2Op = fi(frame, [215, 240], [0, 1]);
  const c2Y  = interpolate(c2Sp, [0, 1], [36, 0]);

  // ── 収益ポップアップ ──
  const revSp = spring({
    frame: Math.max(0, frame - 245),
    fps,
    from: 0,
    to: 1,
    config: { damping: 10, stiffness: 130, mass: 0.9 },
  });
  const revOp    = fi(frame, [245, 268], [0, 1]);
  const revScale = interpolate(revSp, [0, 0.6, 0.8, 1], [0.4, 1.08, 0.96, 1]);

  // ── 波紋エフェクト ──
  const ripples = [0, 20, 40].map((delay) => {
    const rStart = 245 + delay;
    const rP     = fi(frame, [rStart, rStart + 80], [0, 1]);
    return {
      scale:   interpolate(rP, [0, 1], [0.3, 5]),
      opacity: interpolate(rP, [0, 0.15, 1], [0, 0.5, 0]),
    };
  });

  // ── ボタンのパルス発光 ──
  const btnGlow = Math.sin((frame / 20) * Math.PI) * 0.3 + 0.7;

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
        padding: "0 48px",
      }}
    >
      {/* ── ヘッドライン ── */}
      <div
        style={{
          opacity: hlOp,
          transform: `translateY(${hlY}px)`,
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        <p
          style={{
            color: "#64748b",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.12em",
            marginBottom: 8,
          }}
        >
          SOLUTION
        </p>
        <p
          style={{
            fontFamily:
              '"Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif',
            color: "#f1f5f9",
            fontSize: 42,
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: "0.02em",
          }}
        >
          在庫も機器も不要。
          <br />
          <span
            style={{
              color: "#10b981",
              textShadow: "0 0 16px rgba(16,185,129,0.4)",
            }}
          >
            スマホ一つで完結。
          </span>
        </p>
      </div>

      {/* ── アプリUIカード ── */}
      <div
        style={{
          opacity: cardOp,
          transform: `translateY(${cardY}px)`,
          width: "100%",
          background: "rgba(8,12,24,0.98)",
          border: "1.5px solid rgba(16,185,129,0.2)",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow:
            "0 0 80px rgba(16,185,129,0.08), 0 24px 80px rgba(0,0,0,0.75)",
          position: "relative",
        }}
      >
        {/* カードヘッダー */}
        <div
          style={{
            background:
              "linear-gradient(135deg,rgba(16,185,129,0.12) 0%,rgba(6,182,212,0.06) 100%)",
            borderBottom: "1px solid rgba(16,185,129,0.15)",
            padding: "26px 32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <div>
              <p
                style={{
                  color: "#10b981",
                  fontSize: 19,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                }}
              >
                SUPPLEMENT ORACLE
              </p>
              <p
                style={{
                  color: "#f1f5f9",
                  fontSize: 28,
                  fontWeight: 900,
                  marginTop: 3,
                }}
              >
                📊 デジタル処方箋
              </p>
            </div>
            <div
              style={{
                background: "rgba(16,185,129,0.12)",
                border: "1px solid rgba(16,185,129,0.4)",
                borderRadius: 20,
                padding: "8px 16px",
              }}
            >
              <p
                style={{
                  color: "#10b981",
                  fontSize: 19,
                  fontWeight: 800,
                }}
              >
                ✓ 完成
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(71,85,105,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              👤
            </div>
            <div>
              <p
                style={{
                  color: "#f1f5f9",
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                田中 健太 様
              </p>
              <p style={{ color: "#475569", fontSize: 18 }}>
                目標：筋力アップ ／ 予算：¥15,000/月
              </p>
            </div>
          </div>
        </div>

        {/* アイテムリスト */}
        <div style={{ padding: "8px 0" }}>
          {ITEMS.map((item, i) => {
            const iOp = fi(frame, [55 + i * 30, 55 + i * 30 + 22], [0, 1]);
            return (
              <div
                key={i}
                style={{
                  opacity: iOp,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "15px 32px",
                  borderBottom:
                    i < ITEMS.length - 1
                      ? "1px solid rgba(255,255,255,0.05)"
                      : "none",
                }}
              >
                <span
                  style={{
                    fontSize: 28,
                    width: 36,
                    textAlign: "center" as const,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      color: "#f1f5f9",
                      fontSize: 22,
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    {item.name}
                  </p>
                  <p style={{ color: "#64748b", fontSize: 18 }}>{item.brand}</p>
                </div>
                <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                  <p
                    style={{
                      color: "#f8fafc",
                      fontSize: 22,
                      fontWeight: 800,
                    }}
                  >
                    {item.price}
                  </p>
                  <div
                    style={{
                      background: `${item.tagColor}18`,
                      border: `1px solid ${item.tagColor}44`,
                      borderRadius: 8,
                      padding: "3px 10px",
                      marginTop: 4,
                    }}
                  >
                    <p
                      style={{
                        color: item.tagColor,
                        fontSize: 16,
                        fontWeight: 700,
                      }}
                    >
                      {item.tag}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* アフィリエイトボタン */}
        <div style={{ padding: "6px 32px 28px" }}>
          <div
            style={{
              background: `linear-gradient(135deg, #10b981 0%, #059669 100%)`,
              borderRadius: 18,
              padding: "22px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: `0 0 ${30 + btnGlow * 20}px rgba(16,185,129,${0.3 + btnGlow * 0.2}), 0 8px 24px rgba(16,185,129,0.2)`,
              opacity: fi(frame, [150, 175], [0, 1]),
            }}
          >
            <div>
              <p
                style={{
                  color: "white",
                  fontSize: 26,
                  fontWeight: 900,
                }}
              >
                🛒 推奨ショップへ行く
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 19,
                  marginTop: 3,
                }}
              >
                アフィリエイトリンク • 特別割引あり
              </p>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 22,
              }}
            >
              →
            </div>
          </div>
        </div>
      </div>

      {/* ── キャッチコピー群 ── */}
      <div
        style={{
          width: "100%",
          marginTop: 32,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <p
          style={{
            opacity: c1Op,
            transform: `translateY(${c1Y}px)`,
            fontFamily:
              '"Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif',
            color: "#10b981",
            fontSize: 34,
            fontWeight: 700,
            textAlign: "center",
            textShadow: "0 0 20px rgba(16,185,129,0.3)",
          }}
        >
          在庫リスクゼロ。
        </p>
        <p
          style={{
            opacity: c2Op,
            transform: `translateY(${c2Y}px)`,
            fontFamily:
              '"Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif',
            color: "#10b981",
            fontSize: 34,
            fontWeight: 700,
            textAlign: "center",
            textShadow: "0 0 20px rgba(16,185,129,0.3)",
          }}
        >
          メンテナンスゼロ。
        </p>
      </div>

      {/* ── 収益発生ポップアップ ── */}
      {frame >= 245 && (
        <div
          style={{
            position: "absolute",
            bottom: 120,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* 波紋 */}
          {ripples.map((r, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 100,
                height: 100,
                transform: `translate(-50%, -50%) scale(${r.scale})`,
                opacity: r.opacity,
                borderRadius: "50%",
                border: "2.5px solid #10b981",
                pointerEvents: "none",
              }}
            />
          ))}
          {/* 通知カード */}
          <div
            style={{
              opacity: revOp,
              transform: `scale(${revScale})`,
              background:
                "linear-gradient(135deg,rgba(16,185,129,0.14),rgba(5,150,105,0.08))",
              border: "1.5px solid rgba(16,185,129,0.45)",
              borderRadius: 22,
              padding: "24px 44px",
              textAlign: "center",
              boxShadow:
                "0 0 60px rgba(16,185,129,0.25), 0 16px 40px rgba(0,0,0,0.5)",
              backdropFilter: "blur(12px)",
              position: "relative",
              zIndex: 10,
            }}
          >
            <p
              style={{
                color: "#10b981",
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "0.06em",
                marginBottom: 6,
              }}
            >
              💰 収益発生！
            </p>
            <p
              style={{
                fontSize: 76,
                fontWeight: 900,
                lineHeight: 0.95,
                background:
                  "linear-gradient(135deg,#10b981,#34d399,#6ee7b7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              +¥1,500
            </p>
            <p
              style={{
                color: "#64748b",
                fontSize: 20,
                marginTop: 10,
              }}
            >
              田中 健太 様 の購入が確定しました
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
