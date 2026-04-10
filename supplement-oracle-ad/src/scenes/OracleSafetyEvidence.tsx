import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from "remotion";

// ══════════════════════════════════════════════════════════
// タイムライン定数
// ══════════════════════════════════════════════════════════
const S2 = 240;   // 4秒 — 安全性スクリーニング（+1秒ホールド）
const S3 = 600;   // 10秒 — PubMedエビデンス（+1秒ホールド）
const S4 = 840;   // 14秒 — CTA（+1秒ホールド）

// Scene1 サブ
const TRAINER_IN  = 0;
const CLIENT_IN   = 55;
const RED_IN      = 90;
const WARN_IN     = 110;

// Scene2 サブ
const UI_IN       = S2 + 10;
const CHECK_START = S2 + 70;
const SCAN_START  = S2 + 160;
const SCAN_END    = S2 + 240;
const GREEN_POP   = S2 + 260;

// Scene3 サブ
const LIST_IN     = S3 + 25;
const PMID_START  = S3 + 60;
const CAPTION_IN  = S3 + 130;

// Scene4 サブ
const CATCH_IN    = S4 + 20;
const LOGO_IN     = S4 + 60;
const QR_IN       = S4 + 105;
const CTA_BTN_IN  = S4 + 155;

// ══════════════════════════════════════════════════════════
// ユーティリティ
// ══════════════════════════════════════════════════════════
const fi = (f: number, input: number[], output: number[]): number =>
  interpolate(f, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const useSp = (frame: number, fps: number, delay: number, cfg?: { damping?: number; stiffness?: number; mass?: number }) =>
  spring({
    frame: Math.max(0, frame - delay),
    fps,
    from: 0,
    to: 1,
    config: { damping: 14, stiffness: 110, mass: 0.9, ...cfg },
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
// チェックボックス（アニメーション付き）
// ══════════════════════════════════════════════════════════
const AnimatedCheck: React.FC<{
  label: string;
  sublabel?: string;
  frame: number;
  fps: number;
  delay: number;
  color?: string;
}> = ({ label, sublabel, frame, fps, delay, color = "#ef4444" }) => {
  const sp = useSp(frame, fps, delay, { damping: 10, stiffness: 180, mass: 0.6 });
  const op = fi(frame, [delay, delay + 20], [0, 1]);
  const checkScale = interpolate(sp, [0, 0.6, 0.85, 1], [0, 1.3, 0.9, 1]);
  const rowY = interpolate(sp, [0, 1], [30, 0]);
  const checked = frame >= delay + 5;

  return (
    <div style={{ opacity: op, transform: `translateY(${rowY}px)`, display: "flex", alignItems: "center", gap: 18, padding: "14px 0" }}>
      {/* チェックボックス */}
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        border: `2px solid ${checked ? color : "rgba(100,116,139,0.6)"}`,
        background: checked ? `${color}22` : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "border-color 0.1s",
      }}>
        {checked && (
          <div style={{
            transform: `scale(${checkScale})`,
            color: color, fontSize: 24, fontWeight: 900, lineHeight: 1,
          }}>✓</div>
        )}
      </div>
      <div>
        <p style={{ color: "#f1f5f9", fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>{label}</p>
        {sublabel && <p style={{ color: "#64748b", fontSize: 20, marginTop: 3 }}>{sublabel}</p>}
      </div>
      {checked && (
        <div style={{
          marginLeft: "auto", transform: `scale(${checkScale})`,
          background: `${color}1a`, border: `1px solid ${color}55`,
          borderRadius: 20, padding: "5px 14px", flexShrink: 0,
        }}>
          <p style={{ color: color, fontSize: 18, fontWeight: 800 }}>検出</p>
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// PMIDバッジ
// ══════════════════════════════════════════════════════════
const PmidBadge: React.FC<{ pmid: string; frame: number; fps: number; delay: number }> = ({ pmid, frame, fps, delay }) => {
  const sp = useSp(frame, fps, delay, { damping: 11, stiffness: 200, mass: 0.55 });
  const scale = interpolate(sp, [0, 0.55, 0.82, 1], [0, 1.18, 0.94, 1]);
  const op = fi(frame, [delay, delay + 18], [0, 1]);
  return (
    <div style={{
      opacity: op, transform: `scale(${scale})`,
      display: "inline-flex", alignItems: "center", gap: 6,
      background: "rgba(30,64,175,0.18)", border: "1px solid rgba(59,130,246,0.45)",
      borderRadius: 20, padding: "5px 14px",
      boxShadow: "0 0 12px rgba(59,130,246,0.2)",
    }}>
      <span style={{ fontSize: 17 }}>📑</span>
      <span style={{ color: "#93c5fd", fontSize: 18, fontWeight: 700 }}>PMID: {pmid}</span>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// Scene 1 — 課題・リスク提示（0〜180f）
// ══════════════════════════════════════════════════════════
const Scene1: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // トレーナー吹き出し（右）
  const trainerSp = useSp(frame, fps, TRAINER_IN, { stiffness: 120 });
  const trainerOp = fi(frame, [TRAINER_IN, TRAINER_IN + 22], [0, 1]);
  const trainerY  = interpolate(trainerSp, [0, 1], [60, 0]);

  // クライアント吹き出し（左）
  const clientSp = useSp(frame, fps, CLIENT_IN, { stiffness: 120 });
  const clientOp = fi(frame, [CLIENT_IN, CLIENT_IN + 22], [0, 1]);
  const clientY  = interpolate(clientSp, [0, 1], [60, 0]);

  // 赤オーバーレイ
  const redOp   = fi(frame, [RED_IN, RED_IN + 28], [0, 0.22]);
  const pulse   = Math.sin(((frame - RED_IN) / 30) * Math.PI) * 0.06;
  const redFinal = Math.max(0, redOp + pulse);

  // 警告テキスト
  const warnSp = useSp(frame, fps, WARN_IN, { damping: 11, stiffness: 150, mass: 0.7 });
  const warnOp = fi(frame, [WARN_IN, WARN_IN + 25], [0, 1]);
  const warnScale = interpolate(warnSp, [0, 0.55, 0.8, 1], [0.6, 1.08, 0.96, 1]);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* 赤オーバーレイ */}
      <div style={{
        position: "absolute", inset: 0,
        background: `rgba(239,68,68,${redFinal})`,
        pointerEvents: "none",
      }} />

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 56px", gap: 0,
      }}>
        {/* トレーナー吹き出し（右側・ブルー） */}
        <div style={{ opacity: trainerOp, transform: `translateY(${trainerY}px)`, width: "100%", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", paddingLeft: 80 }}>
            <div style={{ maxWidth: "80%" }}>
              <p style={{ color: "#94a3b8", fontSize: 21, fontWeight: 600, textAlign: "right", marginBottom: 6 }}>
                トレーナー（自分）
              </p>
              <div style={{
                background: "linear-gradient(135deg,#1e40af,#0369a1)",
                borderRadius: "20px 4px 20px 20px", padding: "20px 26px",
                boxShadow: "0 4px 20px rgba(30,64,175,0.35)",
              }}>
                <p style={{ color: "white", fontSize: 29, lineHeight: 1.65, fontWeight: 600 }}>
                  燃焼系なら、このサプリがおすすめですよ！💪
                </p>
              </div>
            </div>
            <div style={{
              width: 46, height: 46, borderRadius: "50%", flexShrink: 0, marginLeft: 10, marginTop: 28,
              background: "linear-gradient(135deg,#3b82f6,#06b6d4)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            }}>💪</div>
          </div>
        </div>

        {/* クライアント吹き出し（左側・グレー） */}
        <div style={{ opacity: clientOp, transform: `translateY(${clientY}px)`, width: "100%", marginBottom: 52 }}>
          <div style={{ display: "flex", justifyContent: "flex-start", paddingRight: 80 }}>
            <div style={{
              width: 46, height: 46, borderRadius: "50%", flexShrink: 0, marginRight: 10, marginTop: 28,
              background: "rgba(71,85,105,0.7)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            }}>👤</div>
            <div style={{ maxWidth: "80%" }}>
              <p style={{ color: "#94a3b8", fontSize: 21, fontWeight: 600, marginBottom: 6 }}>田中 健太</p>
              <div style={{
                background: "rgba(30,41,59,0.95)", border: "1px solid rgba(71,85,105,0.4)",
                borderRadius: "4px 20px 20px 20px", padding: "20px 26px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}>
                <p style={{ color: "#f1f5f9", fontSize: 29, lineHeight: 1.65, fontWeight: 600 }}>
                  私、高血圧の薬を飲んでるんですが、大丈夫ですか…？😰
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 警告バナー */}
        {frame >= WARN_IN && (
          <div style={{
            opacity: warnOp, transform: `scale(${warnScale})`,
            background: "rgba(127,29,29,0.95)", border: "2px solid rgba(239,68,68,0.7)",
            borderRadius: 22, padding: "28px 40px", textAlign: "center",
            boxShadow: "0 0 60px rgba(239,68,68,0.35), 0 16px 40px rgba(0,0,0,0.6)",
            width: "100%",
          }}>
            <p style={{ color: "#fca5a5", fontSize: 50, marginBottom: 10 }}>⚠️</p>
            <p style={{ color: "#fef2f2", fontSize: 36, fontWeight: 900, lineHeight: 1.3 }}>
              経験則だけの指導は<br />危険です
            </p>
            <p style={{ color: "#fca5a5", fontSize: 24, marginTop: 12, lineHeight: 1.6, fontWeight: 500 }}>
              薬との相互作用・禁忌成分の見落としが<br />
              重大な健康被害につながる可能性があります
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// Scene 2 — 安全性スクリーニング（180〜480f）
// ══════════════════════════════════════════════════════════
const Scene2: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // UIカード
  const cardSp = useSp(frame, fps, UI_IN, { damping: 14, stiffness: 90, mass: 1.05 });
  const cardY  = interpolate(cardSp, [0, 1], [800, 0]);
  const cardOp = fi(frame, [UI_IN, UI_IN + 30], [0, 1]);

  // ヘッドライン
  const hlOp = fi(frame, [S2, S2 + 30], [0, 1]);
  const hlY  = interpolate(useSp(frame, fps, S2, { stiffness: 120 }), [0, 1], [-44, 0]);

  // スキャンライン
  const scanProgress = fi(frame, [SCAN_START, SCAN_END], [0, 1]);
  const scanY = interpolate(scanProgress, [0, 1], [0, 100]); // % で動かす
  const scanOp = fi(frame, [SCAN_START, SCAN_START + 10, SCAN_END, SCAN_END + 15], [0, 1, 1, 0]);

  // プログレスバー
  const barWidth = fi(frame, [SCAN_START, SCAN_END + 20], [0, 100]);

  // 緑通知
  const greenSp  = useSp(frame, fps, GREEN_POP, { damping: 11, stiffness: 140, mass: 0.75 });
  const greenOp  = fi(frame, [GREEN_POP, GREEN_POP + 25], [0, 1]);
  const greenScale = interpolate(greenSp, [0, 0.55, 0.82, 1], [0.7, 1.1, 0.95, 1]);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* ヘッドライン */}
      <div style={{
        position: "absolute", top: 110, left: 0, right: 0,
        textAlign: "center", padding: "0 60px",
        opacity: hlOp, transform: `translateY(${hlY}px)`,
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
          <p style={{ color: "#10b981", fontSize: 24, fontWeight: 700, letterSpacing: "0.1em" }}>SAFETY SCREENING</p>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
        </div>
        <p style={{
          fontSize: 50, fontWeight: 900, lineHeight: 1.2, letterSpacing: "-0.02em",
          background: "linear-gradient(135deg,#f8fafc 0%,#86efac 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          リスクを自動検知、<br />安全な提案だけを。
        </p>
      </div>

      {/* UIカード */}
      <div style={{
        position: "absolute", top: 360, left: 48, right: 48,
        opacity: cardOp, transform: `translateY(${cardY}px)`,
      }}>
        <div style={{
          background: "rgba(8,14,28,0.98)", border: "1px solid rgba(71,85,105,0.3)",
          borderRadius: 28, overflow: "hidden",
          boxShadow: "0 0 80px rgba(16,185,129,0.08), 0 24px 80px rgba(0,0,0,0.75)",
        }}>
          {/* カードヘッダー */}
          <div style={{
            background: "linear-gradient(135deg,#0a2010 0%,#051a0c 100%)",
            padding: "24px 32px", borderBottom: "1px solid rgba(16,185,129,0.2)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <p style={{ color: "#6ee7b7", fontSize: 20, fontWeight: 700, letterSpacing: "0.06em" }}>
                SUPPLEMENT ORACLE
              </p>
              <p style={{ color: "#f1f5f9", fontSize: 28, fontWeight: 900, marginTop: 4 }}>
                🛡️ 安全性スクリーニング
              </p>
            </div>
            <div style={{
              background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)",
              borderRadius: 20, padding: "8px 18px",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%", background: "#10b981",
                opacity: Math.floor(frame / 20) % 2 === 0 ? 1 : 0.3,
              }} />
              <p style={{ color: "#10b981", fontSize: 19, fontWeight: 800 }}>スキャン中</p>
            </div>
          </div>

          {/* チェック項目 */}
          <div style={{ padding: "8px 32px 0" }}>
            <p style={{ color: "#475569", fontSize: 20, fontWeight: 600, marginBottom: 4, marginTop: 14, letterSpacing: "0.04em" }}>
              クライアント情報の自動照合
            </p>
            <div style={{ borderTop: "1px solid rgba(71,85,105,0.2)", paddingTop: 4 }}>
              <AnimatedCheck
                label="高血圧（高血圧症）"
                sublabel="禁忌成分フラグ：ON"
                frame={frame} fps={fps}
                delay={CHECK_START}
                color="#ef4444"
              />
              <AnimatedCheck
                label="服薬中（降圧剤）"
                sublabel="薬物相互作用チェック：要確認"
                frame={frame} fps={fps}
                delay={CHECK_START + 35}
                color="#f97316"
              />
              <AnimatedCheck
                label="心拍数への影響に注意"
                sublabel="カフェイン・シネフリン系成分を除外対象に設定"
                frame={frame} fps={fps}
                delay={CHECK_START + 70}
                color="#f97316"
              />
            </div>
          </div>

          {/* スキャンライン + プログレスバー */}
          {frame >= SCAN_START && (
            <div style={{ padding: "20px 32px 24px", position: "relative" }}>
              {/* スキャンライン（カード上を走る演出） */}
              <div style={{
                position: "absolute", top: 0, left: 32, right: 32, height: 2,
                opacity: scanOp,
                transform: `translateY(${scanY}px)`,
                background: "linear-gradient(90deg, transparent, #10b981, #06b6d4, transparent)",
                boxShadow: "0 0 12px rgba(16,185,129,0.8)",
                pointerEvents: "none",
              }} />
              <p style={{ color: "#64748b", fontSize: 20, fontWeight: 600, marginBottom: 10 }}>
                成分DBスキャン進捗
              </p>
              <div style={{ background: "rgba(15,23,42,0.8)", borderRadius: 50, height: 12, overflow: "hidden", marginBottom: 8 }}>
                <div style={{
                  height: "100%", width: `${barWidth}%`,
                  background: "linear-gradient(90deg,#10b981,#06b6d4)",
                  borderRadius: 50,
                  boxShadow: "0 0 10px rgba(16,185,129,0.6)",
                  transition: "width 0.05s linear",
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ color: "#475569", fontSize: 18 }}>
                  50種以上の禁忌成分を照合中...
                </p>
                <p style={{ color: "#10b981", fontSize: 18, fontWeight: 700 }}>
                  {Math.round(barWidth)}%
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 緑の安全通知 */}
        {frame >= GREEN_POP && (
          <div style={{
            marginTop: 20,
            opacity: greenOp, transform: `scale(${greenScale})`,
            background: "linear-gradient(135deg,rgba(5,46,22,0.95),rgba(3,36,17,0.95))",
            border: "1.5px solid rgba(16,185,129,0.5)",
            borderRadius: 22, padding: "24px 32px",
            display: "flex", alignItems: "center", gap: 20,
            boxShadow: "0 0 50px rgba(16,185,129,0.2), 0 12px 40px rgba(0,0,0,0.6)",
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%", flexShrink: 0,
              background: "rgba(16,185,129,0.18)", border: "2px solid rgba(16,185,129,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30,
            }}>✅</div>
            <div>
              <p style={{ color: "#10b981", fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
                自動除外完了
              </p>
              <p style={{ color: "#f1f5f9", fontSize: 25, fontWeight: 700, lineHeight: 1.35 }}>
                カフェイン・シネフリン等の<br />
                該当成分を提案から自動除外しました
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// Scene 3 — PubMedエビデンス（480〜720f）
// ══════════════════════════════════════════════════════════
const SUPP_LIST = [
  { icon: "💊", name: "L-カルニチン",      brand: "脂肪代謝サポート",        pmid: "26876412", effect: "体脂肪燃焼補助" },
  { icon: "🍵", name: "緑茶エキス（GTE）", brand: "カフェインフリー処方",      pmid: "19597519", effect: "抗酸化・代謝促進" },
  { icon: "⚗️", name: "CLA（共役リノール酸）", brand: "体組成改善サポート",   pmid: "20861171", effect: "体脂肪低減補助" },
  { icon: "🌱", name: "コエンザイムQ10",   brand: "エネルギー産生サポート",    pmid: "14531534", effect: "細胞エネルギー補助" },
];

const Scene3: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const hlOp = fi(frame, [S3, S3 + 28], [0, 1]);
  const hlY  = interpolate(useSp(frame, fps, S3, { stiffness: 120 }), [0, 1], [-44, 0]);

  const listOp = fi(frame, [LIST_IN, LIST_IN + 30], [0, 1]);
  const listSp = useSp(frame, fps, LIST_IN, { damping: 14, stiffness: 90, mass: 1.05 });
  const listY  = interpolate(listSp, [0, 1], [80, 0]);

  const captionOp = fi(frame, [CAPTION_IN, CAPTION_IN + 30], [0, 1]);
  const captionY  = interpolate(useSp(frame, fps, CAPTION_IN, { stiffness: 100 }), [0, 1], [30, 0]);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* ヘッドライン */}
      <div style={{
        position: "absolute", top: 100, left: 0, right: 0,
        textAlign: "center", padding: "0 60px",
        opacity: hlOp, transform: `translateY(${hlY}px)`,
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <span style={{ fontSize: 26 }}>📚</span>
          <p style={{ color: "#93c5fd", fontSize: 24, fontWeight: 700, letterSpacing: "0.08em" }}>
            PUBMED EVIDENCE BASE
          </p>
        </div>
        <p style={{
          fontSize: 48, fontWeight: 900, lineHeight: 1.22, letterSpacing: "-0.025em",
          background: "linear-gradient(135deg,#f8fafc 0%,#93c5fd 50%,#22d3ee 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          科学的根拠のある<br />提案だけを届ける。
        </p>
      </div>

      {/* サプリリスト */}
      <div style={{
        position: "absolute", top: 370, left: 48, right: 48,
        opacity: listOp, transform: `translateY(${listY}px)`,
      }}>
        <div style={{
          background: "rgba(8,14,28,0.98)", border: "1px solid rgba(59,130,246,0.22)",
          borderRadius: 28, overflow: "hidden",
          boxShadow: "0 0 80px rgba(59,130,246,0.1), 0 24px 60px rgba(0,0,0,0.7)",
        }}>
          {/* ヘッダー */}
          <div style={{
            background: "linear-gradient(135deg,#0c1f4a,#071430)",
            padding: "22px 32px", borderBottom: "1px solid rgba(59,130,246,0.18)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <p style={{ color: "#93c5fd", fontSize: 19, fontWeight: 700, letterSpacing: "0.06em" }}>SUPPLEMENT ORACLE</p>
              <p style={{ color: "#f1f5f9", fontSize: 27, fontWeight: 900, marginTop: 3 }}>
                📋 安全性確認済みの提案リスト
              </p>
            </div>
            <div style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 20, padding: "8px 16px" }}>
              <p style={{ color: "#10b981", fontSize: 18, fontWeight: 800 }}>4件 / 安全</p>
            </div>
          </div>

          {/* アイテム */}
          <div style={{ padding: "8px 32px" }}>
            {SUPP_LIST.map((item, i) => {
              const delay = PMID_START + i * 22;
              return (
                <div key={i} style={{
                  padding: "16px 0",
                  borderBottom: i < SUPP_LIST.length - 1 ? "1px solid rgba(71,85,105,0.15)" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
                    <span style={{ fontSize: 28, flexShrink: 0 }}>{item.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: "#f1f5f9", fontSize: 24, fontWeight: 800, lineHeight: 1.2 }}>{item.name}</p>
                      <p style={{ color: "#64748b", fontSize: 19 }}>{item.brand}</p>
                    </div>
                    <div style={{ flexShrink: 0, textAlign: "right" }}>
                      <div style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, padding: "4px 12px" }}>
                        <p style={{ color: "#10b981", fontSize: 17, fontWeight: 700 }}>{item.effect}</p>
                      </div>
                    </div>
                  </div>
                  {/* PMIDバッジ */}
                  <div style={{ paddingLeft: 42 }}>
                    <PmidBadge pmid={item.pmid} frame={frame} fps={fps} delay={delay} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* キャプション */}
        <div style={{
          opacity: captionOp, transform: `translateY(${captionY}px)`,
          textAlign: "center", marginTop: 28, padding: "0 20px",
        }}>
          <p style={{ color: "#94a3b8", fontSize: 26, lineHeight: 1.7 }}>
            <span style={{ color: "#93c5fd", fontWeight: 800 }}>50種以上</span>の成分DBと、
            <span style={{ color: "#93c5fd", fontWeight: 800 }}>PubMed</span>エビデンスに基づく提案。
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

  const catch_ = a(CATCH_IN);
  const logo   = a(LOGO_IN,    { stiffness: 95 });
  const sub    = a(LOGO_IN + 30);
  const qr     = a(QR_IN,      { stiffness: 90 });
  const btn    = a(CTA_BTN_IN, { damping: 12, stiffness: 80, mass: 1.2 });

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "80px 60px",
    }}>
      {/* 背景グロー */}
      <div style={{
        position: "absolute", top: "25%", left: "50%",
        transform: "translateX(-50%)",
        width: 700, height: 700,
        background: "radial-gradient(circle,rgba(59,130,246,0.08) 0%,transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "20%", left: "50%",
        transform: "translateX(-50%)",
        width: 500, height: 500,
        background: "radial-gradient(circle,rgba(16,185,129,0.06) 0%,transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* キャッチコピー */}
      <div style={{ opacity: catch_.opacity, transform: `translateY(${catch_.y}px)`, textAlign: "center", marginBottom: 24 }}>
        <p style={{
          fontSize: 60, fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em",
          background: "linear-gradient(135deg,#f8fafc 0%,#86efac 50%,#22d3ee 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          提案の前に、<br />まず守る。
        </p>
      </div>

      {/* ロゴ */}
      <div style={{ opacity: logo.opacity, transform: `translateY(${logo.y}px)`, marginBottom: 16 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 14,
          background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.28)",
          borderRadius: 50, padding: "13px 32px",
        }}>
          <span style={{ fontSize: 36 }}>🔮</span>
          <p style={{
            fontSize: 32, fontWeight: 900, letterSpacing: "0.05em",
            background: "linear-gradient(135deg,#3b82f6,#22d3ee)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>SUPPLEMENT ORACLE</p>
        </div>
      </div>

      {/* サブコピー */}
      <div style={{ opacity: sub.opacity, transform: `translateY(${sub.y}px)`, textAlign: "center", marginBottom: 48 }}>
        <p style={{ color: "#94a3b8", fontSize: 27, lineHeight: 1.75 }}>
          ジムの信頼を確固たるものに。<br />
          まずは無料の
          <span style={{ color: "#f1f5f9", fontWeight: 800 }}>「梅プラン」</span>
          で。
        </p>
      </div>

      {/* QRコード + 検索バー */}
      <div style={{
        opacity: qr.opacity, transform: `translateY(${qr.y}px)`,
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 24, marginBottom: 44, width: "100%",
      }}>
        <MockQRCode size={200} />
        <div style={{
          width: "100%", background: "rgba(10,18,36,0.9)",
          border: "1px solid rgba(71,85,105,0.4)", borderRadius: 50,
          padding: "16px 32px", display: "flex", alignItems: "center", gap: 16,
        }}>
          <span style={{ fontSize: 26 }}>🔍</span>
          <span style={{ color: "#94a3b8", fontSize: 26 }}>supplement-oracle.jp</span>
          <div style={{
            marginLeft: "auto", background: "rgba(16,185,129,0.15)",
            border: "1px solid rgba(16,185,129,0.3)", borderRadius: 20, padding: "6px 16px",
          }}>
            <span style={{ color: "#10b981", fontSize: 19, fontWeight: 700 }}>無料登録</span>
          </div>
        </div>
      </div>

      {/* CTAボタン */}
      <div style={{ opacity: btn.opacity, transform: `translateY(${btn.y}px)`, width: "100%" }}>
        <div style={{
          background: "linear-gradient(135deg,#065f46 0%,#0891b2 100%)",
          borderRadius: 50, padding: "28px 60px", textAlign: "center",
          boxShadow: "0 8px 44px rgba(16,185,129,0.35), 0 0 0 1px rgba(16,185,129,0.22)",
        }}>
          <p style={{ color: "white", fontSize: 37, fontWeight: 900 }}>
            安全な提案を、今すぐ試す
          </p>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 22, marginTop: 7 }}>
            30秒で登録完了 · 永久無料プランあり
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
  // シーンに応じて背景のアクセント色を切り替え
  const isScene1 = frame < S2;
  const isScene4 = frame >= S4;
  const glowColor = isScene1
    ? "rgba(239,68,68,0.06)"
    : isScene4
    ? "rgba(16,185,129,0.05)"
    : "rgba(59,130,246,0.05)";

  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#060b18" }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(rgba(100,116,139,0.04) 1px,transparent 1px)," +
          "linear-gradient(90deg,rgba(100,116,139,0.04) 1px,transparent 1px)",
        backgroundSize: "72px 72px",
      }} />
      <div style={{
        position: "absolute", top: 0, left: "50%",
        transform: "translateX(-50%)",
        width: 900, height: 900,
        background: `radial-gradient(circle,${glowColor} 0%,transparent 70%)`,
        pointerEvents: "none",
        transition: "background 0.3s",
      }} />
    </>
  );
};

// ══════════════════════════════════════════════════════════
// メインコンポーネント
// ══════════════════════════════════════════════════════════
export const OracleSafetyEvidence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s1Op = fi(frame, [S2 - 22, S2], [1, 0]);
  const s2Op = fi(frame, [S2, S2 + 22, S3 - 20, S3], [0, 1, 1, 0]);
  const s3Op = fi(frame, [S3, S3 + 22, S4 - 20, S4], [0, 1, 1, 0]);
  const s4Op = fi(frame, [S4, S4 + 36], [0, 1]);

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

export default OracleSafetyEvidence;
