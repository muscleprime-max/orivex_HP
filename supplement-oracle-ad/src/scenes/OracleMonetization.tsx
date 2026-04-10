import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from "remotion";

// ══════════════════════════════════════════════════════════
// タイムライン定数 (60fps)
// ══════════════════════════════════════════════════════════
const S2 = 240;  // 4秒 - ソリューション登場（+1秒ホールド）
const S3 = 480;  // 8秒 - 機能デモ（+1秒ホールド）
const S4 = 840;  // 14秒 - CTA（+1秒ホールド）

// Scene 3 サブフェーズ
const BTN_GLOW   = S3 + 20;   // 380f: ボタン発光開始
const BTN_CLICK  = S3 + 70;   // 430f: ボタンクリック
const SCR_SWITCH = S3 + 100;  // 460f: 画面切り替え
const PURCHASE   = S3 + 150;  // 510f: 購入完了
const REVENUE    = S3 + 180;  // 540f: 収益発生

// ══════════════════════════════════════════════════════════
// ユーティリティ
// ══════════════════════════════════════════════════════════

/** clamp付きinterpolate */
const fi = (
  f: number,
  input: number[],
  output: number[]
): number =>
  interpolate(f, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** ディレイ付きspringのY変位ヘルパー */
const springY = (
  frame: number,
  fps: number,
  delay: number,
  from: number,
  cfg?: { damping?: number; stiffness?: number; mass?: number }
) => {
  const sp = spring({
    frame: Math.max(0, frame - delay),
    fps,
    from: 0,
    to: 1,
    config: { damping: 14, stiffness: 110, mass: 0.9, ...cfg },
  });
  return interpolate(sp, [0, 1], [from, 0]);
};

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
// 共通背景
// ══════════════════════════════════════════════════════════
const Background: React.FC = () => (
  <>
    <div style={{ position: "absolute", inset: 0, background: "#060b18" }} />
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage:
        "linear-gradient(rgba(59,130,246,0.04) 1px,transparent 1px)," +
        "linear-gradient(90deg,rgba(59,130,246,0.04) 1px,transparent 1px)",
      backgroundSize: "80px 80px",
    }} />
  </>
);

// ══════════════════════════════════════════════════════════
// Scene 1 — 課題提示（0〜180f）
// ══════════════════════════════════════════════════════════
const Scene1: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // アドバイスカード
  const cardOp  = fi(frame, [0, 25], [0, 1]);
  const cardY   = springY(frame, fps, 0, 80, { stiffness: 120 });

  // ¥0 登場
  const zeroOp    = fi(frame, [45, 60], [0, 1]);
  const zeroSp    = spring({ frame: Math.max(0, frame - 45), fps, from: 0, to: 1, config: { damping: 8, stiffness: 220, mass: 0.5 } });
  const zeroScale = interpolate(zeroSp, [0, 0.7, 1], [0.2, 1.12, 1]);

  // 粉砕（frame 90〜）
  const SHATTER    = 90;
  const sp         = fi(frame, [SHATTER, SHATTER + 40], [0, 1]);
  const isShatter  = frame >= SHATTER;
  const zeroFinalOp = isShatter
    ? fi(frame, [SHATTER, SHATTER + 28], [1, 0])
    : zeroOp;
  const zeroFinalScale = isShatter
    ? interpolate(sp, [0, 0.25, 1], [1, 1.18, 0.7])
    : zeroScale;

  // 飛散シャード
  const SHARDS = [
    { ch: "¥", dx: -320, dy: -440, rot: -55, s: 0.9 },
    { ch: "0", dx:  310, dy: -400, rot:  42, s: 0.85 },
    { ch: "利", dx: -400, dy:  -80, rot: -28, s: 0.75 },
    { ch: "益", dx:  380, dy: -110, rot:  58, s: 0.8 },
    { ch: "な", dx: -220, dy:  380, rot: -72, s: 0.7 },
    { ch: "し", dx:  260, dy:  350, rot:  68, s: 0.78 },
    { ch: "¥", dx:   40, dy: -520, rot:  18, s: 0.65 },
    { ch: "0", dx:  -50, dy:  530, rot: -40, s: 0.62 },
  ];
  const shardOp = isShatter ? fi(frame, [SHATTER, SHATTER + 50], [0.85, 0]) : 0;

  // 下部メッセージ
  const msgOp = fi(frame, [120, 148], [0, 1]);
  const msgY  = springY(frame, fps, 118, 44, { stiffness: 100 });

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "0 60px",
    }}>
      {/* アドバイス吹き出し */}
      <div style={{ opacity: cardOp, transform: `translateY(${cardY}px)`, width: "100%", marginBottom: 52 }}>
        <div style={{
          background: "rgba(10,20,40,0.98)",
          border: "1px solid rgba(71,85,105,0.45)",
          borderRadius: 28, padding: "36px 44px",
          boxShadow: "0 0 60px rgba(59,130,246,0.1), 0 20px 60px rgba(0,0,0,0.65)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{
              width: 54, height: 54, borderRadius: "50%",
              background: "linear-gradient(135deg,#3b82f6,#06b6d4)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0,
            }}>💪</div>
            <div>
              <p style={{ color: "#93c5fd", fontSize: 22, fontWeight: 700 }}>トレーナーのアドバイス</p>
              <p style={{ color: "#475569", fontSize: 19 }}>今日 13:45</p>
            </div>
          </div>
          <div style={{
            background: "linear-gradient(135deg,#1e40af,#0369a1)",
            borderRadius: "4px 22px 22px 22px", padding: "22px 30px",
            boxShadow: "0 4px 20px rgba(30,64,175,0.4)",
          }}>
            <p style={{ color: "white", fontSize: 30, lineHeight: 1.65, fontWeight: 600 }}>
              筋力アップが目標なら、まずプロテインとクレアチンをベースに！<br />
              Amazonで探してみてください💊
            </p>
          </div>
          {/* Amazon誘導を強調する小さなアイコン行 */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, opacity: 0.7 }}>
            <span style={{ fontSize: 22 }}>🛒</span>
            <span style={{ color: "#64748b", fontSize: 21 }}>amazon.co.jp で検索…</span>
            <span style={{ color: "#ef4444", fontSize: 21, fontWeight: 700, marginLeft: "auto" }}>ジムには0円</span>
          </div>
        </div>
      </div>

      {/* ¥0 表示エリア */}
      <div style={{ position: "relative", height: 220, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* シャード */}
        {isShatter && SHARDS.map((sh, i) => (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%",
            transform: `translate(calc(-50% + ${sh.dx * sp}px), calc(-50% + ${sh.dy * sp}px)) rotate(${sh.rot * sp}deg) scale(${sh.s})`,
            opacity: shardOp,
            color: "#ef4444", fontSize: 62, fontWeight: 900,
            pointerEvents: "none",
          }}>{sh.ch}</div>
        ))}
        {/* メイン ¥0 */}
        <div style={{ opacity: zeroFinalOp, transform: `scale(${zeroFinalScale})`, textAlign: "center", position: "relative" }}>
          <div style={{
            position: "absolute", inset: -30,
            background: "radial-gradient(circle, rgba(239,68,68,0.28) 0%, transparent 70%)",
          }} />
          <p style={{ color: "#ef4444", fontSize: 148, fontWeight: 900, lineHeight: 0.85, letterSpacing: "-0.05em", position: "relative" }}>
            ¥0
          </p>
          <p style={{ color: "#fca5a5", fontSize: 30, fontWeight: 700, letterSpacing: "0.06em", marginTop: 10 }}>
            利益なし
          </p>
        </div>
      </div>

      {/* メッセージ */}
      <div style={{ opacity: msgOp, transform: `translateY(${msgY}px)`, textAlign: "center", marginTop: 48 }}>
        <p style={{ color: "#64748b", fontSize: 30, lineHeight: 1.85, fontWeight: 500 }}>
          熱心なサプリ指導、<br />
          <span style={{ color: "#ef4444", fontWeight: 900, fontSize: 38 }}>
            1円も利益になっていませんか？
          </span>
        </p>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// 共通パーツ：提案レポートカード
// ══════════════════════════════════════════════════════════
interface ReportCardProps {
  btnGlow?: number;   // 0〜1 ボタン発光強度
  btnScale?: number;  // ボタンのスケール値
}

const ReportCard: React.FC<ReportCardProps> = ({ btnGlow = 0, btnScale = 1 }) => {
  const items = [
    { icon: "💊", name: "WPIプロテイン（バニラ）",     brand: "Optimum Nutrition", price: "¥5,800", tag: "優先度 HIGH",  tagColor: "#3b82f6" },
    { icon: "⚡", name: "クレアチン モノハイドレート",  brand: "MuscleTech",        price: "¥2,400", tag: "推奨",         tagColor: "#06b6d4" },
    { icon: "🌿", name: "BCAA（グレープフルーツ）",     brand: "Scivation",         price: "¥3,200", tag: "補助",         tagColor: "#8b5cf6" },
  ];
  return (
    <div style={{
      background: "rgba(8,14,28,0.98)",
      border: "1px solid rgba(59,130,246,0.22)",
      borderRadius: 28, overflow: "hidden",
      boxShadow: "0 0 80px rgba(59,130,246,0.12), 0 24px 80px rgba(0,0,0,0.75)",
    }}>
      {/* カードヘッダー */}
      <div style={{
        background: "linear-gradient(135deg,#0c1f4a 0%,#071430 100%)",
        padding: "28px 36px", borderBottom: "1px solid rgba(59,130,246,0.18)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <p style={{ color: "#93c5fd", fontSize: 20, fontWeight: 700, letterSpacing: "0.06em" }}>
              SUPPLEMENT ORACLE
            </p>
            <p style={{ color: "#f1f5f9", fontSize: 30, fontWeight: 900, marginTop: 4 }}>
              📊 サプリ提案レポート
            </p>
          </div>
          <div style={{
            background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.4)",
            borderRadius: 20, padding: "8px 18px",
          }}>
            <p style={{ color: "#10b981", fontSize: 20, fontWeight: 800 }}>完成</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "rgba(71,85,105,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
          }}>👤</div>
          <div>
            <p style={{ color: "#f1f5f9", fontSize: 24, fontWeight: 700 }}>田中 健太 様</p>
            <p style={{ color: "#475569", fontSize: 19 }}>目標：筋力アップ ／ 予算：¥15,000/月</p>
          </div>
        </div>
      </div>

      {/* アイテムリスト */}
      <div style={{ padding: "10px 36px" }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 16,
            padding: "16px 0",
            borderBottom: i < items.length - 1 ? "1px solid rgba(71,85,105,0.18)" : "none",
          }}>
            <span style={{ fontSize: 30, width: 38, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: "#f1f5f9", fontSize: 23, fontWeight: 700, lineHeight: 1.25 }}>{item.name}</p>
              <p style={{ color: "#64748b", fontSize: 19 }}>{item.brand}</p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ color: "#f8fafc", fontSize: 23, fontWeight: 800 }}>{item.price}</p>
              <div style={{
                background: `${item.tagColor}1a`, border: `1px solid ${item.tagColor}55`,
                borderRadius: 8, padding: "3px 10px", marginTop: 4,
              }}>
                <p style={{ color: item.tagColor, fontSize: 17, fontWeight: 700 }}>{item.tag}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* アフィリエイトボタン */}
      <div style={{ padding: "6px 36px 32px" }}>
        <div style={{
          transform: `scale(${btnScale})`,
          borderRadius: 20,
          boxShadow: btnGlow > 0
            ? `0 0 ${30 + btnGlow * 50}px rgba(251,191,36,${0.3 + btnGlow * 0.4}), 0 0 ${60 + btnGlow * 80}px rgba(251,191,36,${0.1 + btnGlow * 0.15})`
            : "0 4px 20px rgba(59,130,246,0.25)",
          transition: "box-shadow 0.1s",
        }}>
          <div style={{
            background: btnGlow > 0
              ? `linear-gradient(135deg, #3b82f6 0%, #06b6d4 60%, rgba(251,191,36,${btnGlow * 0.6}) 100%)`
              : "linear-gradient(135deg,#3b82f6 0%,#06b6d4 100%)",
            borderRadius: 18, padding: "24px 32px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            border: btnGlow > 0 ? `1px solid rgba(251,191,36,${btnGlow * 0.6})` : "1px solid transparent",
          }}>
            <div>
              <p style={{ color: "white", fontSize: 28, fontWeight: 900 }}>🛒 推奨ショップへ行く</p>
              <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 20 }}>
                アフィリエイトリンク • 特別割引あり
              </p>
            </div>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(255,255,255,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, color: "white",
            }}>→</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// Scene 2 — ソリューション登場（180〜360f）
// ══════════════════════════════════════════════════════════
const Scene2: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const hlOp  = fi(frame, [S2, S2 + 30], [0, 1]);
  const hlY   = springY(frame, fps, S2, -50, { stiffness: 110 });

  const cardOp = fi(frame, [S2 + 20, S2 + 55], [0, 1]);
  const cardSp = spring({
    frame: Math.max(0, frame - (S2 + 20)), fps, from: 0, to: 1,
    config: { damping: 14, stiffness: 85, mass: 1.1 },
  });
  const cardY  = interpolate(cardSp, [0, 1], [700, 0]);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "0 52px",
    }}>
      {/* ヘッドライン */}
      <div style={{ opacity: hlOp, transform: `translateY(${hlY}px)`, textAlign: "center", marginBottom: 52 }}>
        <p style={{ color: "#475569", fontSize: 24, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 12 }}>
          SOLUTION
        </p>
        <p style={{
          fontSize: 56, fontWeight: 900, lineHeight: 1.2, letterSpacing: "-0.025em",
          background: "linear-gradient(135deg,#f8fafc 0%,#93c5fd 45%,#22d3ee 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          アドバイスを、<br />利益に変えよう。
        </p>
      </div>
      {/* レポートカード */}
      <div style={{ opacity: cardOp, transform: `translateY(${cardY}px)`, width: "100%" }}>
        <ReportCard />
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// 購入完了モック画面
// ══════════════════════════════════════════════════════════
const PurchaseScreen: React.FC<{ checkProgress: number }> = ({ checkProgress }) => {
  const checkScale = interpolate(checkProgress, [0, 0.55, 0.78, 1], [0, 1.22, 0.92, 1]);
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{
        width: 440, background: "rgba(10,18,36,0.98)",
        border: "2px solid rgba(71,85,105,0.4)",
        borderRadius: 44, padding: "22px 20px 32px",
        boxShadow: "0 0 40px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.04)",
      }}>
        {/* ノッチ */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <div style={{ width: 90, height: 6, background: "#1e293b", borderRadius: 3 }} />
        </div>
        {/* 画面コンテンツ */}
        <div style={{
          background: "#0a1020", borderRadius: 28, padding: "44px 28px 36px",
          textAlign: "center",
        }}>
          {/* チェックサークル */}
          <div style={{
            position: "relative", display: "inline-flex",
            alignItems: "center", justifyContent: "center",
            width: 130, height: 130, marginBottom: 28,
          }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: "rgba(16,185,129,0.12)",
              border: "2.5px solid rgba(16,185,129,0.35)",
            }} />
            <div style={{
              opacity: checkProgress, transform: `scale(${checkScale})`,
              color: "#10b981", fontSize: 64, lineHeight: 1,
            }}>✓</div>
          </div>
          <p style={{ color: "#10b981", fontSize: 34, fontWeight: 900, marginBottom: 10 }}>
            購入完了！
          </p>
          <p style={{ color: "#94a3b8", fontSize: 23, lineHeight: 1.6 }}>
            WPIプロテイン（バニラ）<br />
            <span style={{ color: "#f1f5f9", fontWeight: 800, fontSize: 26 }}>¥5,800</span>
          </p>
          <div style={{
            marginTop: 18,
            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
            borderRadius: 14, padding: "12px 20px",
          }}>
            <p style={{ color: "#6ee7b7", fontSize: 21 }}>🎁 トレーナー特別価格で購入</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// Scene 3 — 機能デモ（360〜660f）
// ══════════════════════════════════════════════════════════
const Scene3: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // ── ヘッドライン ──
  const hlOp = fi(frame, [S3, S3 + 28], [0, 1]);
  const hlY  = springY(frame, fps, S3, -44, { stiffness: 120 });

  // ── ボタン発光 ──
  const glowPulse = Math.sin(((frame - BTN_GLOW) / 18) * Math.PI) * 0.45 + 0.55;
  const btnGlow   = frame >= BTN_GLOW && frame < BTN_CLICK ? glowPulse : 0;

  // ── ボタンクリックスケール ──
  const btnScale = interpolate(
    frame,
    [BTN_CLICK, BTN_CLICK + 9, BTN_CLICK + 22, BTN_CLICK + 34],
    [1, 0.93, 1.05, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── レポートカードフェードアウト ──
  const reportOp = fi(frame, [SCR_SWITCH, SCR_SWITCH + 22], [1, 0]);
  const reportYOut = fi(frame, [SCR_SWITCH, SCR_SWITCH + 35], [0, -180]);

  // ── 購入画面 ──
  const purchaseOp  = fi(frame, [SCR_SWITCH + 8, SCR_SWITCH + 42], [0, 1]);
  const purchaseSp  = spring({
    frame: Math.max(0, frame - SCR_SWITCH), fps, from: 0, to: 1,
    config: { damping: 14, stiffness: 100, mass: 0.9 },
  });
  const purchaseY   = interpolate(purchaseSp, [0, 1], [300, 0]);
  const checkProgress = fi(frame, [PURCHASE, PURCHASE + 32], [0, 1]);

  // ── 収益通知 ──
  const revOp  = fi(frame, [REVENUE, REVENUE + 30], [0, 1]);
  const revSp  = spring({
    frame: Math.max(0, frame - REVENUE), fps, from: 0, to: 1,
    config: { damping: 12, stiffness: 95, mass: 1.15 },
  });
  const revY   = interpolate(revSp, [0, 1], [130, 0]);

  // ── 波紋 (3本、20f間隔) ──
  const ripples = [0, 22, 44].map((delay) => {
    const rS = REVENUE + delay;
    const rP = fi(frame, [rS, rS + 100], [0, 1]);
    return {
      scale:   interpolate(rP, [0, 1], [0.15, 5.5]),
      opacity: interpolate(rP, [0, 0.18, 1], [0, 0.55, 0]),
    };
  });

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* ヘッドライン */}
      <div style={{
        position: "absolute", top: 100, left: 0, right: 0,
        textAlign: "center", padding: "0 60px",
        opacity: hlOp, transform: `translateY(${hlY}px)`,
      }}>
        <p style={{ fontSize: 42, fontWeight: 900, color: "#f8fafc", lineHeight: 1.3 }}>
          クライアントが購入したら<br />
          <span style={{
            background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>自動で収益が発生</span>
        </p>
      </div>

      {/* レポートカード（SCR_SWITCH前） */}
      <div style={{
        position: "absolute", top: 310, left: 48, right: 48,
        opacity: reportOp,
        transform: `translateY(${reportYOut}px)`,
      }}>
        <ReportCard btnGlow={btnGlow} btnScale={btnScale} />
      </div>

      {/* 購入完了画面 */}
      {frame >= SCR_SWITCH && (
        <div style={{
          position: "absolute", top: 360, left: 0, right: 0,
          opacity: purchaseOp,
          transform: `translateY(${purchaseY}px)`,
        }}>
          <PurchaseScreen checkProgress={checkProgress} />
        </div>
      )}

      {/* 収益発生通知 */}
      {frame >= REVENUE && (
        <div style={{
          position: "absolute", bottom: 160, left: 0, right: 0,
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          {/* 波紋 */}
          {ripples.map((r, i) => (
            <div key={i} style={{
              position: "absolute", top: "50%", left: "50%",
              width: 100, height: 100,
              transform: `translate(-50%, -50%) scale(${r.scale})`,
              opacity: r.opacity,
              borderRadius: "50%",
              border: "2.5px solid #fbbf24",
              pointerEvents: "none",
            }} />
          ))}
          {/* 通知カード */}
          <div style={{
            opacity: revOp, transform: `translateY(${revY}px)`,
            background: "linear-gradient(135deg,rgba(251,191,36,0.13) 0%,rgba(245,158,11,0.08) 100%)",
            border: "1.5px solid rgba(251,191,36,0.45)",
            borderRadius: 26, padding: "30px 52px",
            textAlign: "center",
            boxShadow: "0 0 70px rgba(251,191,36,0.22), 0 16px 48px rgba(0,0,0,0.55)",
            backdropFilter: "blur(14px)",
            position: "relative", zIndex: 10,
          }}>
            <p style={{ color: "#fbbf24", fontSize: 26, fontWeight: 800, letterSpacing: "0.06em", marginBottom: 6 }}>
              💰 収益発生！
            </p>
            <p style={{
              fontSize: 86, fontWeight: 900, lineHeight: 0.95,
              background: "linear-gradient(135deg,#fcd34d,#fbbf24,#f59e0b)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>+¥1,500</p>
            <p style={{ color: "#64748b", fontSize: 22, marginTop: 12 }}>
              田中 健太 様 の購入が確定しました
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// Scene 4 — CTA（660〜900f）
// ══════════════════════════════════════════════════════════
const Scene4: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const stagger = (delay: number) => {
    const sp = spring({
      frame: Math.max(0, frame - (S4 + delay)), fps, from: 0, to: 1,
      config: { damping: 14, stiffness: 90, mass: 0.95 },
    });
    return {
      opacity: fi(frame, [S4 + delay, S4 + delay + 32], [0, 1]),
      y: interpolate(sp, [0, 1], [55, 0]),
    };
  };

  const logo    = stagger(0);
  const tagline = stagger(45);
  const sub     = stagger(90);
  const qrRow   = stagger(140);
  const cta     = stagger(195);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "80px 60px",
    }}>
      {/* 背景グロー */}
      <div style={{
        position: "absolute", top: "28%", left: "50%",
        transform: "translateX(-50%)",
        width: 750, height: 750,
        background: "radial-gradient(circle,rgba(59,130,246,0.09) 0%,transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* ロゴ */}
      <div style={{ opacity: logo.opacity, transform: `translateY(${logo.y}px)`, marginBottom: 24 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 16,
          background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.28)",
          borderRadius: 50, padding: "13px 34px",
        }}>
          <span style={{ fontSize: 38 }}>🔮</span>
          <p style={{
            fontSize: 34, fontWeight: 900, letterSpacing: "0.05em",
            background: "linear-gradient(135deg,#3b82f6,#22d3ee)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>SUPPLEMENT ORACLE</p>
        </div>
      </div>

      {/* メインコピー */}
      <div style={{ opacity: tagline.opacity, transform: `translateY(${tagline.y}px)`, textAlign: "center", marginBottom: 28 }}>
        <p style={{ fontSize: 54, fontWeight: 900, lineHeight: 1.22, color: "#f8fafc", letterSpacing: "-0.025em" }}>
          浮いた時間で、<br />
          <span style={{
            background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>さらに儲かる</span>
          ジムへ。
        </p>
      </div>

      {/* サブコピー */}
      <div style={{ opacity: sub.opacity, transform: `translateY(${sub.y}px)`, textAlign: "center", marginBottom: 52 }}>
        <p style={{ color: "#94a3b8", fontSize: 28, lineHeight: 1.75 }}>
          まずは完全無料の
          <span style={{ color: "#f1f5f9", fontWeight: 800 }}>「梅プラン」</span>
          で。<br />
          クレカ不要・いつでも解約OK
        </p>
      </div>

      {/* QRコード + 検索バー */}
      <div style={{
        opacity: qrRow.opacity, transform: `translateY(${qrRow.y}px)`,
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 24, marginBottom: 44, width: "100%",
      }}>
        <MockQRCode size={200} />
        <div style={{
          width: "100%", background: "rgba(10,18,36,0.9)",
          border: "1px solid rgba(71,85,105,0.4)",
          borderRadius: 50, padding: "16px 32px",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <span style={{ fontSize: 26 }}>🔍</span>
          <span style={{ color: "#94a3b8", fontSize: 26 }}>supplement-oracle.jp</span>
          <div style={{
            marginLeft: "auto", background: "rgba(59,130,246,0.15)",
            borderRadius: 20, padding: "6px 16px",
          }}>
            <span style={{ color: "#93c5fd", fontSize: 20, fontWeight: 700 }}>無料登録</span>
          </div>
        </div>
      </div>

      {/* CTAボタン */}
      <div style={{ opacity: cta.opacity, transform: `translateY(${cta.y}px)`, width: "100%" }}>
        <div style={{
          background: "linear-gradient(135deg,#3b82f6 0%,#0891b2 100%)",
          borderRadius: 50, padding: "28px 60px", textAlign: "center",
          boxShadow: "0 8px 44px rgba(59,130,246,0.48), 0 0 0 1px rgba(59,130,246,0.28)",
        }}>
          <p style={{ color: "white", fontSize: 38, fontWeight: 900 }}>
            今すぐ無料で始める
          </p>
          <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 23, marginTop: 7 }}>
            30秒で登録完了 · 永久無料プランあり
          </p>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// メインコンポーネント
// ══════════════════════════════════════════════════════════
export const OracleMonetization: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s1Op = fi(frame, [S2 - 22, S2], [1, 0]);
  const s2Op = fi(frame, [S2, S2 + 22, S3 - 20, S3], [0, 1, 1, 0]);
  const s3Op = fi(frame, [S3, S3 + 22, S4 - 22, S4], [0, 1, 1, 0]);
  const s4Op = fi(frame, [S4, S4 + 36], [0, 1]);

  return (
    <div style={{
      width: 1080, height: 1920,
      background: "#060b18",
      position: "relative", overflow: "hidden",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Noto Sans JP", sans-serif',
    }}>
      <Background />

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

export default OracleMonetization;
