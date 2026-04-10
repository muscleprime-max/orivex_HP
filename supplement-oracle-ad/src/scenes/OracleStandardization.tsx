import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from "remotion";

// ══════════════════════════════════════════════════════════
// タイムライン定数
// ══════════════════════════════════════════════════════════
const S2 = 300;   // 5秒 — ソリューション（+1秒ホールド）
const S3 = 660;   // 11秒 — 標準化ベネフィット（+1秒ホールド）
const S4 = 900;   // 15秒 — CTA（+1秒ホールド）

// Scene1 サブ
const CLIENT_IN   = 0;
const INNER1_IN   = 48;
const INNER2_IN   = 100;
const INNER3_IN   = 152;
const SHAKE_START = 162;
const STAMP_IN    = 196;
const CAPTION1_IN = 218;

// Scene2 サブ
const UI_SLIDE    = S2 + 18;
const FILL_1      = S2 + 62;   // 性別
const FILL_2      = S2 + 118;  // 体重
const FILL_3      = S2 + 174;  // 目的
const RESULT_IN   = S2 + 220;  // 結果リスト
const CAPTION2_IN = S2 + 265;

// Scene3 サブ
const REPORT_IN   = S3 + 18;
const GYM_BADGE   = S3 + 75;
const CAPTION3_IN = S3 + 130;

// Scene4 サブ
const BADGE4_IN   = S4 + 18;
const LOGO4_IN    = S4 + 60;
const QR4_IN      = S4 + 102;
const CTA4_IN     = S4 + 115;

// ══════════════════════════════════════════════════════════
// ユーティリティ
// ══════════════════════════════════════════════════════════
const fi = (f: number, input: number[], output: number[]): number =>
  interpolate(f, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const useSp = (
  frame: number, fps: number, delay: number,
  cfg?: { damping?: number; stiffness?: number; mass?: number }
) =>
  spring({
    frame: Math.max(0, frame - delay), fps, from: 0, to: 1,
    config: { damping: 14, stiffness: 110, mass: 0.9, ...cfg },
  });

// 震えの計算
const shakeMag = (f: number): number => {
  if (f < SHAKE_START || f > STAMP_IN + 30) return 0;
  const progress = (f - SHAKE_START) / Math.max(1, STAMP_IN - SHAKE_START);
  return 6.5 * Math.min(progress * 2.5, 1);
};
const shakeXY = (f: number) => ({
  x: Math.sin(f * 1.45) * shakeMag(f),
  y: Math.cos(f * 1.1)  * shakeMag(f) * 0.6,
});

// ══════════════════════════════════════════════════════════
// QRコード（実画像）
// ══════════════════════════════════════════════════════════
const MockQRCode: React.FC<{ size: number }> = ({ size }) => (
  <Img
    src={staticFile("assets/qrcode.png")}
    style={{ width: size, height: size, borderRadius: 16, display: "block" }}
  />
);

// ══════════════════════════════════════════════════════════
// 心の声吹き出し（震えアニメーション付き）
// ══════════════════════════════════════════════════════════
const InnerVoiceBubble: React.FC<{
  text: string; frame: number; fps: number; delay: number; align: "left" | "right";
}> = ({ text, frame, fps, delay, align }) => {
  const sp  = useSp(frame, fps, delay, { damping: 12, stiffness: 140, mass: 0.75 });
  const op  = fi(frame, [delay, delay + 18], [0, 1]);
  const entryY = interpolate(sp, [0, 1], [50, 0]);
  const { x, y } = shakeXY(frame);

  return (
    <div style={{
      display: "flex",
      justifyContent: align === "right" ? "flex-end" : "flex-start",
      opacity: op,
      transform: `translateX(${x}px) translateY(${entryY + y}px)`,
    }}>
      {align === "left" && (
        <div style={{
          width: 44, height: 44, borderRadius: "50%", flexShrink: 0, marginRight: 10, marginTop: 4,
          background: "rgba(71,85,105,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
        }}>😰</div>
      )}
      <div style={{
        maxWidth: "74%",
        background: "rgba(127,29,29,0.85)",
        border: "1.5px solid rgba(239,68,68,0.45)",
        borderRadius: align === "left" ? "4px 18px 18px 18px" : "18px 4px 18px 18px",
        padding: "14px 20px",
        boxShadow: "0 4px 18px rgba(239,68,68,0.22)",
      }}>
        <p style={{ color: "#fecaca", fontSize: 27, fontWeight: 700, lineHeight: 1.45 }}>{text}</p>
      </div>
      {align === "right" && (
        <div style={{
          width: 44, height: 44, borderRadius: "50%", flexShrink: 0, marginLeft: 10, marginTop: 4,
          background: "rgba(71,85,105,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
        }}>😰</div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// フォームフィールドアニメーション
// ══════════════════════════════════════════════════════════
const FormField: React.FC<{
  label: string; value: string; icon: string;
  frame: number; fps: number; delay: number;
}> = ({ label, value, icon, frame, fps, delay }) => {
  const sp = useSp(frame, fps, delay, { damping: 13, stiffness: 130 });
  const op = fi(frame, [delay, delay + 18], [0, 1]);
  const entryX = interpolate(sp, [0, 1], [-30, 0]);
  const typeLen = Math.min(value.length, Math.floor(fi(frame, [delay + 10, delay + 45], [0, value.length])));
  const typedVal = value.slice(0, typeLen);
  const isDone = typeLen >= value.length;

  return (
    <div style={{ opacity: op, transform: `translateX(${entryX}px)`, marginBottom: 16 }}>
      <p style={{ color: "#64748b", fontSize: 20, fontWeight: 600, marginBottom: 6 }}>{label}</p>
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        background: isDone ? "rgba(16,185,129,0.08)" : "rgba(15,23,42,0.8)",
        border: `1px solid ${isDone ? "rgba(16,185,129,0.4)" : "rgba(71,85,105,0.4)"}`,
        borderRadius: 14, padding: "14px 20px",
        transition: "border-color 0.2s, background 0.2s",
      }}>
        <span style={{ fontSize: 26, flexShrink: 0 }}>{icon}</span>
        <p style={{ flex: 1, color: isDone ? "#f1f5f9" : "#94a3b8", fontSize: 26, fontWeight: isDone ? 700 : 500 }}>
          {typedVal || "　"}
          {!isDone && frame >= delay + 10 && (
            <span style={{
              display: "inline-block", width: 2, height: "1em",
              background: "#3b82f6", marginLeft: 2, verticalAlign: "text-bottom",
              opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0,
            }} />
          )}
        </p>
        {isDone && (
          <div style={{ color: "#10b981", fontSize: 24, fontWeight: 900, flexShrink: 0 }}>✓</div>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// Scene 1 — 強烈なフック（0〜240f）
// ══════════════════════════════════════════════════════════
const Scene1: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // クライアント吹き出し（左）
  const clientSp = useSp(frame, fps, CLIENT_IN, { stiffness: 120 });
  const clientOp = fi(frame, [CLIENT_IN, CLIENT_IN + 20], [0, 1]);
  const clientY  = interpolate(clientSp, [0, 1], [60, 0]);

  // スタンプ
  const stampSp    = useSp(frame, fps, STAMP_IN, { damping: 6, stiffness: 280, mass: 2.2 });
  const stampOp    = fi(frame, [STAMP_IN, STAMP_IN + 4], [0, 1]);
  const stampScale = interpolate(stampSp, [0, 0.25, 0.6, 0.82, 1], [3.5, 0.85, 1.08, 0.97, 1]);
  const stampRot   = interpolate(stampSp, [0, 0.35, 1], [-12, 2.5, 0]);
  // 着地後の揺れ
  const afterShake = frame >= STAMP_IN && frame < STAMP_IN + 40
    ? Math.sin((frame - STAMP_IN) * 2.8) * 5 * Math.exp(-(frame - STAMP_IN) * 0.12)
    : 0;

  // キャプション
  const capSp = useSp(frame, fps, CAPTION1_IN, { stiffness: 100 });
  const capOp = fi(frame, [CAPTION1_IN, CAPTION1_IN + 25], [0, 1]);
  const capY  = interpolate(capSp, [0, 1], [28, 0]);

  // 赤オーバーレイ
  const redOp = fi(frame, [STAMP_IN, STAMP_IN + 20], [0, 0.15]);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* 赤みオーバーレイ */}
      <div style={{
        position: "absolute", inset: 0,
        background: `rgba(127,29,29,${redOp})`, pointerEvents: "none",
      }} />

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 56px", gap: 0,
      }}>
        {/* クライアント吹き出し */}
        <div style={{ opacity: clientOp, transform: `translateY(${clientY}px)`, width: "100%", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "flex-start", paddingRight: 80 }}>
            <div style={{
              width: 46, height: 46, borderRadius: "50%", flexShrink: 0,
              marginRight: 10, marginTop: 30,
              background: "rgba(71,85,105,0.7)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            }}>👤</div>
            <div style={{ maxWidth: "78%" }}>
              <p style={{ color: "#94a3b8", fontSize: 21, fontWeight: 600, marginBottom: 6 }}>田中 健太</p>
              <div style={{
                background: "rgba(30,41,59,0.95)", border: "1px solid rgba(71,85,105,0.4)",
                borderRadius: "4px 20px 20px 20px", padding: "20px 26px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}>
                <p style={{ color: "#f1f5f9", fontSize: 28, lineHeight: 1.65, fontWeight: 600 }}>
                  私に最適なサプリの組み合わせを教えてください！💊
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 心の声バブル × 3 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", marginBottom: 36 }}>
          <InnerVoiceBubble text="（どうしよう…）" frame={frame} fps={fps} delay={INNER1_IN} align="right" />
          <InnerVoiceBubble text="（プロテインしか分からない…）" frame={frame} fps={fps} delay={INNER2_IN} align="right" />
          <InnerVoiceBubble text="（とりあえずBCAAって言っておくか…）" frame={frame} fps={fps} delay={INNER3_IN} align="right" />
        </div>

        {/* スタンプ */}
        {frame >= STAMP_IN && (
          <div style={{
            opacity: stampOp,
            transform: `scale(${stampScale}) rotate(${stampRot + afterShake * 0.3}deg) translateX(${afterShake}px)`,
            marginBottom: 28,
            width: "100%",
          }}>
            <div style={{
              background: "rgba(100,0,0,0.92)",
              border: "4px solid rgba(239,68,68,0.8)",
              borderRadius: 20, padding: "22px 36px",
              textAlign: "center",
              boxShadow: "0 0 60px rgba(239,68,68,0.5), 0 12px 40px rgba(0,0,0,0.7)",
              transform: "rotate(-2.5deg)",
            }}>
              <p style={{ color: "#fef2f2", fontSize: 50, fontWeight: 900, lineHeight: 1.1, letterSpacing: "0.02em" }}>
                ⚠️ 指導の属人化
              </p>
              <div style={{ height: 3, background: "rgba(239,68,68,0.6)", borderRadius: 2, margin: "10px 0" }} />
              <p style={{ color: "#fca5a5", fontSize: 22, fontWeight: 700 }}>
                PERSONALIZATION PROBLEM
              </p>
            </div>
          </div>
        )}

        {/* キャプション */}
        <div style={{ opacity: capOp, transform: `translateY(${capY}px)`, textAlign: "center" }}>
          <p style={{ color: "#94a3b8", fontSize: 28, lineHeight: 1.75 }}>
            サプリ指導の質、スタッフ間で<br />
            <span style={{ color: "#fca5a5", fontWeight: 800, fontSize: 32 }}>バラついていませんか？</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// Scene 2 — ソリューション（240〜540f）
// ══════════════════════════════════════════════════════════
const SUPP_RESULTS = [
  { icon: "💊", name: "WPIプロテイン（ストロベリー）", effect: "筋肉合成サポート",   color: "#3b82f6" },
  { icon: "🔥", name: "L-カルニチン（1,000mg）",       effect: "脂肪燃焼補助",       color: "#f97316" },
  { icon: "🌿", name: "緑茶エキス（カフェインフリー）", effect: "抗酸化・代謝促進",   color: "#10b981" },
];

const Scene2: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const hlOp = fi(frame, [S2, S2 + 25], [0, 1]);
  const hlY  = interpolate(useSp(frame, fps, S2, { stiffness: 120 }), [0, 1], [-40, 0]);

  const cardSp = useSp(frame, fps, UI_SLIDE, { damping: 14, stiffness: 88, mass: 1.1 });
  const cardOp = fi(frame, [UI_SLIDE, UI_SLIDE + 28], [0, 1]);
  const cardY  = interpolate(cardSp, [0, 1], [750, 0]);

  const resultOp = fi(frame, [RESULT_IN, RESULT_IN + 25], [0, 1]);
  const resultY  = interpolate(useSp(frame, fps, RESULT_IN, { stiffness: 100 }), [0, 1], [40, 0]);

  const capOp = fi(frame, [CAPTION2_IN, CAPTION2_IN + 25], [0, 1]);
  const capY  = interpolate(useSp(frame, fps, CAPTION2_IN, { stiffness: 100 }), [0, 1], [28, 0]);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* ヘッドライン */}
      <div style={{
        position: "absolute", top: 100, left: 0, right: 0,
        textAlign: "center", padding: "0 60px",
        opacity: hlOp, transform: `translateY(${hlY}px)`,
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6" }} />
          <p style={{ color: "#93c5fd", fontSize: 23, fontWeight: 700, letterSpacing: "0.1em" }}>
            DIGITAL PRESCRIPTION
          </p>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6" }} />
        </div>
        <p style={{
          fontSize: 48, fontWeight: 900, lineHeight: 1.22, letterSpacing: "-0.02em",
          background: "linear-gradient(135deg,#f8fafc 0%,#93c5fd 50%,#22d3ee 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          経験ゼロでも、<br />入力だけで完成。
        </p>
      </div>

      {/* フォームUI */}
      <div style={{
        position: "absolute", top: 330, left: 48, right: 48,
        opacity: cardOp, transform: `translateY(${cardY}px)`,
      }}>
        <div style={{
          background: "rgba(8,14,28,0.98)",
          border: "1px solid rgba(59,130,246,0.22)",
          borderRadius: 28, overflow: "hidden",
          boxShadow: "0 0 80px rgba(59,130,246,0.12), 0 24px 60px rgba(0,0,0,0.7)",
        }}>
          {/* カードヘッダー */}
          <div style={{
            background: "linear-gradient(135deg,#0c1f4a,#071430)",
            padding: "22px 32px", borderBottom: "1px solid rgba(59,130,246,0.18)",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <span style={{ fontSize: 30 }}>🔮</span>
            <div>
              <p style={{ color: "#93c5fd", fontSize: 19, fontWeight: 700, letterSpacing: "0.06em" }}>
                SUPPLEMENT ORACLE
              </p>
              <p style={{ color: "#f1f5f9", fontSize: 26, fontWeight: 900, marginTop: 2 }}>
                クライアント情報の入力
              </p>
            </div>
          </div>

          {/* フォーム */}
          <div style={{ padding: "20px 32px" }}>
            <FormField label="性別" value="女性" icon="👤" frame={frame} fps={fps} delay={FILL_1} />
            <FormField label="体重" value="54 kg" icon="⚖️" frame={frame} fps={fps} delay={FILL_2} />
            <FormField label="目的" value="体脂肪燃焼・体型維持" icon="🎯" frame={frame} fps={fps} delay={FILL_3} />
          </div>

          {/* 生成ボタン → 結果に切り替わる */}
          {frame < RESULT_IN ? (
            <div style={{ padding: "4px 32px 28px" }}>
              <div style={{
                background: frame >= FILL_3 + 40
                  ? "linear-gradient(135deg,#3b82f6,#06b6d4)"
                  : "rgba(30,41,59,0.8)",
                borderRadius: 16, padding: "18px 28px",
                textAlign: "center",
                border: frame >= FILL_3 + 40 ? "none" : "1px solid rgba(71,85,105,0.3)",
                opacity: frame >= FILL_3 + 20 ? 1 : 0.4,
              }}>
                <p style={{ color: "white", fontSize: 26, fontWeight: 800 }}>
                  {frame >= FILL_3 + 40 ? "⚡ 提案レポートを生成中…" : "　　　　　　　"}
                </p>
              </div>
            </div>
          ) : (
            <div style={{
              opacity: resultOp, transform: `translateY(${resultY}px)`,
              padding: "0 32px 28px",
            }}>
              <div style={{
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.3)",
                borderRadius: 16, padding: "14px 20px", marginBottom: 16,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <span style={{ fontSize: 24 }}>✅</span>
                <p style={{ color: "#10b981", fontSize: 22, fontWeight: 800 }}>
                  3件の最適サプリを自動選定しました
                </p>
              </div>
              {SUPP_RESULTS.map((s, i) => {
                const itemDelay = RESULT_IN + 15 + i * 28;
                const itemSp = useSp(frame, fps, itemDelay, { damping: 12, stiffness: 150, mass: 0.7 });
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "12px 0",
                    borderBottom: i < SUPP_RESULTS.length - 1 ? "1px solid rgba(71,85,105,0.15)" : "none",
                    opacity: fi(frame, [itemDelay, itemDelay + 18], [0, 1]),
                    transform: `translateX(${interpolate(itemSp, [0, 1], [-20, 0])}px)`,
                  }}>
                    <span style={{ fontSize: 26, flexShrink: 0 }}>{s.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: "#f1f5f9", fontSize: 22, fontWeight: 700 }}>{s.name}</p>
                      <p style={{ color: "#64748b", fontSize: 18 }}>{s.effect}</p>
                    </div>
                    <div style={{
                      background: `${s.color}1a`, border: `1px solid ${s.color}44`,
                      borderRadius: 10, padding: "4px 12px", flexShrink: 0,
                    }}>
                      <p style={{ color: s.color, fontSize: 17, fontWeight: 700 }}>推奨</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* キャプション */}
        <div style={{ opacity: capOp, transform: `translateY(${capY}px)`, textAlign: "center", marginTop: 24 }}>
          <p style={{ color: "#94a3b8", fontSize: 26, lineHeight: 1.7 }}>
            経験がなくても、入力するだけで<br />
            <span style={{ color: "#93c5fd", fontWeight: 800 }}>デジタル処方箋が完成。</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// Scene 3 — 標準化ベネフィット（540〜720f）
// ══════════════════════════════════════════════════════════
const Scene3: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const hlOp = fi(frame, [S3, S3 + 25], [0, 1]);
  const hlY  = interpolate(useSp(frame, fps, S3, { stiffness: 120 }), [0, 1], [-40, 0]);

  const cardOp = fi(frame, [REPORT_IN, REPORT_IN + 25], [0, 1]);
  const cardSp = useSp(frame, fps, REPORT_IN, { damping: 14, stiffness: 90, mass: 1.05 });
  const cardY  = interpolate(cardSp, [0, 1], [300, 0]);

  // ジムバッジ — シャイン
  const badgeSp    = useSp(frame, fps, GYM_BADGE, { damping: 10, stiffness: 160, mass: 1.1 });
  const badgeOp    = fi(frame, [GYM_BADGE, GYM_BADGE + 22], [0, 1]);
  const badgeScale = interpolate(badgeSp, [0, 0.5, 0.78, 1], [0, 1.2, 0.94, 1]);
  const shimmerX   = fi(frame, [GYM_BADGE + 25, GYM_BADGE + 75], [-200, 350]);

  const capOp = fi(frame, [CAPTION3_IN, CAPTION3_IN + 25], [0, 1]);
  const capY  = interpolate(useSp(frame, fps, CAPTION3_IN, { stiffness: 100 }), [0, 1], [28, 0]);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* ヘッドライン */}
      <div style={{
        position: "absolute", top: 100, left: 0, right: 0,
        textAlign: "center", padding: "0 60px",
        opacity: hlOp, transform: `translateY(${hlY}px)`,
      }}>
        <p style={{ color: "#fbbf24", fontSize: 24, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
          STANDARDIZATION
        </p>
        <p style={{
          fontSize: 48, fontWeight: 900, lineHeight: 1.22, letterSpacing: "-0.025em",
          background: "linear-gradient(135deg,#f8fafc 0%,#fcd34d 50%,#fbbf24 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          導入初日から、<br />全員がベテラン級。
        </p>
      </div>

      {/* レポートカード */}
      <div style={{
        position: "absolute", top: 340, left: 48, right: 48,
        opacity: cardOp, transform: `translateY(${cardY}px)`,
      }}>
        {/* ジム監修バッジ */}
        {frame >= GYM_BADGE && (
          <div style={{
            opacity: badgeOp, transform: `scale(${badgeScale})`,
            marginBottom: 16, position: "relative", overflow: "hidden",
          }}>
            <div style={{
              background: "linear-gradient(135deg,#1a1206 0%,#2d1f06 100%)",
              border: "1.5px solid rgba(251,191,36,0.55)",
              borderRadius: 20, padding: "18px 28px",
              display: "flex", alignItems: "center", gap: 18,
              boxShadow: "0 0 40px rgba(251,191,36,0.2), 0 8px 30px rgba(0,0,0,0.6)",
              overflow: "hidden", position: "relative",
            }}>
              {/* シャインライン */}
              <div style={{
                position: "absolute", top: 0, bottom: 0,
                left: shimmerX, width: 60,
                background: "linear-gradient(90deg,transparent,rgba(251,191,36,0.3),transparent)",
                pointerEvents: "none",
              }} />
              <div style={{
                width: 60, height: 60, borderRadius: 16, flexShrink: 0,
                background: "linear-gradient(135deg,#d97706,#fbbf24)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 30, boxShadow: "0 4px 16px rgba(251,191,36,0.4)",
              }}>🏆</div>
              <div>
                <p style={{ color: "#fbbf24", fontSize: 19, fontWeight: 700, letterSpacing: "0.06em" }}>
                  FITNESS GYM OFFICIAL
                </p>
                <p style={{ color: "#f8fafc", fontSize: 28, fontWeight: 900 }}>
                  〇〇ジム 監修済みレポート
                </p>
              </div>
            </div>
          </div>
        )}

        {/* レポート本体 */}
        <div style={{
          background: "rgba(8,14,28,0.98)",
          border: "1px solid rgba(59,130,246,0.22)",
          borderRadius: 24, overflow: "hidden",
          boxShadow: "0 0 60px rgba(59,130,246,0.1), 0 20px 50px rgba(0,0,0,0.7)",
        }}>
          <div style={{
            background: "linear-gradient(135deg,#0c1f4a,#071430)",
            padding: "20px 28px", borderBottom: "1px solid rgba(59,130,246,0.18)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <p style={{ color: "#93c5fd", fontSize: 18, fontWeight: 700 }}>SUPPLEMENT ORACLE</p>
              <p style={{ color: "#f1f5f9", fontSize: 25, fontWeight: 900, marginTop: 2 }}>
                📋 サプリ提案レポート
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "#64748b", fontSize: 17 }}>担当トレーナー</p>
              <p style={{ color: "#f1f5f9", fontSize: 22, fontWeight: 800 }}>新人 太郎</p>
              <div style={{
                background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.35)",
                borderRadius: 10, padding: "3px 12px", marginTop: 4,
              }}>
                <p style={{ color: "#10b981", fontSize: 16, fontWeight: 700 }}>標準化済み ✓</p>
              </div>
            </div>
          </div>
          <div style={{ padding: "18px 28px" }}>
            {SUPP_RESULTS.map((s, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
                borderBottom: i < SUPP_RESULTS.length - 1 ? "1px solid rgba(71,85,105,0.15)" : "none",
              }}>
                <span style={{ fontSize: 24 }}>{s.icon}</span>
                <p style={{ flex: 1, color: "#e2e8f0", fontSize: 22, fontWeight: 600 }}>{s.name}</p>
                <div style={{
                  background: `${s.color}18`, border: `1px solid ${s.color}44`,
                  borderRadius: 8, padding: "3px 10px",
                }}>
                  <p style={{ color: s.color, fontSize: 16, fontWeight: 700 }}>{s.effect}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* キャプション */}
        <div style={{ opacity: capOp, transform: `translateY(${capY}px)`, textAlign: "center", marginTop: 22 }}>
          <p style={{ color: "#94a3b8", fontSize: 26, lineHeight: 1.75 }}>
            組織を底上げする
            <span style={{ color: "#fbbf24", fontWeight: 800 }}>「標準化」</span>。<br />
            スタッフ全員が即戦力に。
          </p>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// Scene 4 — CTA（720〜900f）
// ══════════════════════════════════════════════════════════
const Scene4: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const a = (delay: number, cfg?: { damping?: number; stiffness?: number; mass?: number }) => {
    const sp = useSp(frame, fps, delay, cfg);
    return {
      opacity: fi(frame, [delay, delay + 30], [0, 1]),
      y: interpolate(sp, [0, 1], [52, 0]),
    };
  };

  const badge4 = a(BADGE4_IN, { damping: 9, stiffness: 180, mass: 0.85 });
  const badge4Sp = useSp(frame, fps, BADGE4_IN, { damping: 9, stiffness: 180, mass: 0.85 });
  const badge4Scale = interpolate(badge4Sp, [0, 0.5, 0.8, 1], [0, 1.18, 0.95, 1]);

  const logo4  = a(LOGO4_IN,   { stiffness: 95 });
  const sub4   = a(LOGO4_IN + 35);
  const qr4    = a(QR4_IN,     { stiffness: 90 });
  const cta4   = a(CTA4_IN,    { damping: 11, stiffness: 82, mass: 1.2 });

  // 個人向けバッジの pulse
  const pulse4 = 1 + Math.sin(((frame - BADGE4_IN) / 40) * Math.PI) * 0.025;

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "80px 60px",
    }}>
      {/* 背景グロー */}
      <div style={{
        position: "absolute", top: "20%", left: "50%",
        transform: "translateX(-50%)",
        width: 800, height: 800,
        background: "radial-gradient(circle,rgba(59,130,246,0.08) 0%,transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* ★ 目玉バッジ：店舗も個人も */}
      <div style={{
        opacity: badge4.opacity,
        transform: `translateY(${badge4.y}px) scale(${badge4Scale * pulse4})`,
        marginBottom: 28, width: "100%",
      }}>
        <div style={{
          background: "linear-gradient(135deg,rgba(59,130,246,0.18) 0%,rgba(168,85,247,0.15) 50%,rgba(6,182,212,0.18) 100%)",
          border: "2px solid rgba(168,85,247,0.6)",
          borderRadius: 22, padding: "22px 36px",
          display: "flex", alignItems: "center", gap: 20,
          boxShadow: "0 0 50px rgba(168,85,247,0.25), 0 12px 40px rgba(0,0,0,0.55)",
        }}>
          <span style={{ fontSize: 44, flexShrink: 0 }}>✨</span>
          <div>
            <p style={{ color: "#e9d5ff", fontSize: 26, fontWeight: 900, lineHeight: 1.3 }}>
              店舗経営者も、個人（フリーランス）も
            </p>
            <p style={{
              fontSize: 34, fontWeight: 900, letterSpacing: "-0.01em",
              background: "linear-gradient(135deg,#c084fc,#60a5fa,#22d3ee)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>導入可能！</p>
          </div>
        </div>
        {/* 個人向け追加バッジ */}
        <div style={{
          display: "flex", gap: 12, marginTop: 12, justifyContent: "center",
        }}>
          {[
            { icon: "🏢", label: "ジム・スタジオ" },
            { icon: "🧑‍💻", label: "フリーランスPT" },
            { icon: "🏠", label: "出張トレーナー" },
          ].map((b, i) => (
            <div key={i} style={{
              flex: 1,
              background: "rgba(15,23,42,0.9)",
              border: "1px solid rgba(71,85,105,0.4)",
              borderRadius: 14, padding: "10px 14px",
              textAlign: "center",
              opacity: fi(frame, [BADGE4_IN + 20 + i * 18, BADGE4_IN + 40 + i * 18], [0, 1]),
              transform: `translateY(${interpolate(useSp(frame, fps, BADGE4_IN + 20 + i * 18, { stiffness: 150 }), [0, 1], [20, 0])}px)`,
            }}>
              <p style={{ fontSize: 26 }}>{b.icon}</p>
              <p style={{ color: "#94a3b8", fontSize: 18, fontWeight: 600, marginTop: 4 }}>{b.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ロゴ */}
      <div style={{ opacity: logo4.opacity, transform: `translateY(${logo4.y}px)`, marginBottom: 14 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 14,
          background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.28)",
          borderRadius: 50, padding: "12px 30px",
        }}>
          <span style={{ fontSize: 34 }}>🔮</span>
          <p style={{
            fontSize: 31, fontWeight: 900, letterSpacing: "0.05em",
            background: "linear-gradient(135deg,#3b82f6,#22d3ee)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>SUPPLEMENT ORACLE</p>
        </div>
      </div>

      {/* サブコピー */}
      <div style={{ opacity: sub4.opacity, transform: `translateY(${sub4.y}px)`, textAlign: "center", marginBottom: 36 }}>
        <p style={{ color: "#94a3b8", fontSize: 26, lineHeight: 1.75 }}>
          組織の標準化にも、個人の武器にも。<br />
          まずは完全無料の
          <span style={{ color: "#f1f5f9", fontWeight: 800 }}>「梅プラン」</span>
          で。
        </p>
      </div>

      {/* QR + 検索バー */}
      <div style={{
        opacity: qr4.opacity, transform: `translateY(${qr4.y}px)`,
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 22, marginBottom: 38, width: "100%",
      }}>
        <MockQRCode size={190} />
        <div style={{
          width: "100%", background: "rgba(10,18,36,0.9)",
          border: "1px solid rgba(71,85,105,0.4)",
          borderRadius: 50, padding: "15px 30px",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <span style={{ fontSize: 24 }}>🔍</span>
          <span style={{ color: "#94a3b8", fontSize: 25 }}>supplement-oracle.jp</span>
          <div style={{
            marginLeft: "auto",
            background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)",
            borderRadius: 20, padding: "5px 14px",
          }}>
            <span style={{ color: "#93c5fd", fontSize: 18, fontWeight: 700 }}>無料登録</span>
          </div>
        </div>
      </div>

      {/* CTAボタン */}
      <div style={{ opacity: cta4.opacity, transform: `translateY(${cta4.y}px)`, width: "100%" }}>
        <div style={{
          background: "linear-gradient(135deg,#3b82f6 0%,#7c3aed 50%,#06b6d4 100%)",
          borderRadius: 50, padding: "26px 56px", textAlign: "center",
          boxShadow: "0 8px 44px rgba(124,58,237,0.4), 0 0 0 1px rgba(124,58,237,0.25)",
        }}>
          <p style={{ color: "white", fontSize: 36, fontWeight: 900 }}>
            今すぐ無料で始める
          </p>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 21, marginTop: 6 }}>
            店舗もフリーランスも · 30秒で登録完了
          </p>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// 共通背景
// ══════════════════════════════════════════════════════════
const Background: React.FC<{ frame: number }> = ({ frame }) => {
  const isHook = frame < S2;
  const glowR  = isHook ? "rgba(127,29,29,0.08)" : "transparent";
  const glowB  = !isHook ? "rgba(59,130,246,0.05)" : "transparent";
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#060b18" }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(rgba(100,116,139,0.035) 1px,transparent 1px)," +
          "linear-gradient(90deg,rgba(100,116,139,0.035) 1px,transparent 1px)",
        backgroundSize: "72px 72px",
      }} />
      <div style={{
        position: "absolute", top: 0, left: "50%",
        transform: "translateX(-50%)",
        width: 900, height: 900,
        background: `radial-gradient(circle,${isHook ? glowR : glowB} 0%,transparent 70%)`,
        pointerEvents: "none",
      }} />
    </>
  );
};

// ══════════════════════════════════════════════════════════
// メインコンポーネント
// ══════════════════════════════════════════════════════════
export const OracleStandardization: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s1Op = fi(frame, [S2 - 22, S2], [1, 0]);
  const s2Op = fi(frame, [S2, S2 + 22, S3 - 20, S3], [0, 1, 1, 0]);
  const s3Op = fi(frame, [S3, S3 + 22, S4 - 20, S4], [0, 1, 1, 0]);
  const s4Op = fi(frame, [S4, S4 + 34], [0, 1]);

  return (
    <div style={{
      width: 1080, height: 1920,
      background: "#060b18",
      position: "relative", overflow: "hidden",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Noto Sans JP", sans-serif',
    }}>
      <Background frame={frame} />

      <div style={{ position: "absolute", inset: 0, opacity: s1Op }}>
        <Scene1 frame={frame} fps={fps} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: s2Op }}>
        <Scene2 frame={frame} fps={fps} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: s3Op }}>
        <Scene3 frame={frame} fps={fps} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: s4Op }}>
        <Scene4 frame={frame} fps={fps} />
      </div>
    </div>
  );
};

export default OracleStandardization;
