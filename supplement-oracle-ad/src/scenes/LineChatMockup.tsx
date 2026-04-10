import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

// ============================================================
// 定数
// ============================================================
const TYPING_START = 120;
const TYPING_END   = 390; // 4.5秒（元480から1.5秒短縮）
const EXHAUST_IN   = 400;
const PR_START     = 570;
const PR_END       = 930;

// 短縮した長文テキスト
const FULL_TRAINER_TEXT =
  "目的と食事内容によりますね。筋力アップが優先なら、まずプロテインとクレアチンをベースに。クレアチンはローディング（20g/日×5日）後にメンテナンス（5g/日）へ移行がおすすめです。WPIプロテインは吸収率が高く◎。BCAAやEAAは補助的に使うと効果的ですよ！";

const BENEFITS = [
  {
    icon: "⚡",
    title: "提案が数秒で完成",
    body: "AIが目的・食事・体質から最適サプリを自動選定",
    color: "#3b82f6",
  },
  {
    icon: "📋",
    title: "長文入力、もう不要",
    body: "根拠・飲み方・注意点つきレポートを自動生成",
    color: "#06b6d4",
  },
  {
    icon: "💰",
    title: "販売機会を逃さない",
    body: "提案漏れ・対応遅れをゼロにして収益アップ",
    color: "#10b981",
  },
  {
    icon: "🔁",
    title: "何度でも使い回せる",
    body: "テンプレ管理で次回以降も1クリック対応",
    color: "#f59e0b",
  },
];

// ============================================================
// 吹き出し
// ============================================================
interface BubbleProps {
  text: string;
  side: "left" | "right";
  opacity: number;
  translateY: number;
}

const ChatBubble: React.FC<BubbleProps> = ({ text, side, opacity, translateY }) => {
  const isRight = side === "right";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isRight ? "flex-end" : "flex-start",
        marginBottom: 16,
        opacity,
        transform: `translateY(${translateY}px)`,
        paddingLeft: isRight ? 80 : 0,
        paddingRight: isRight ? 0 : 80,
      }}
    >
      {!isRight && (
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "linear-gradient(135deg, #475569 0%, #334155 100%)",
          flexShrink: 0, marginRight: 10, marginTop: 4,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>👤</div>
      )}
      <div style={{ maxWidth: "75%" }}>
        {!isRight && (
          <p style={{ fontSize: 22, color: "#94a3b8", marginBottom: 4, fontWeight: 600 }}>
            田中 健太
          </p>
        )}
        <div style={{
          background: isRight
            ? "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
            : "#2d3748",
          borderRadius: isRight ? "20px 4px 20px 20px" : "4px 20px 20px 20px",
          padding: "18px 22px",
          color: "#ffffff",
          fontSize: 28,
          lineHeight: 1.65,
          boxShadow: isRight
            ? "0 4px 20px rgba(59,130,246,0.35)"
            : "0 4px 16px rgba(0,0,0,0.4)",
          wordBreak: "break-all" as const,
          whiteSpace: "pre-wrap" as const,
        }}>{text}</div>
        <div style={{
          display: "flex", justifyContent: isRight ? "flex-end" : "flex-start",
          alignItems: "center", gap: 6, marginTop: 6,
        }}>
          {isRight && <span style={{ fontSize: 20, color: "#06b6d4", fontWeight: 700 }}>既読</span>}
          <span style={{ fontSize: 20, color: "#64748b" }}>13:42</span>
        </div>
      </div>
      {isRight && (
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
          flexShrink: 0, marginLeft: 10, marginTop: 4,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>💪</div>
      )}
    </div>
  );
};

// ============================================================
// タイピングインジケーター
// ============================================================
const TypingIndicator: React.FC<{ opacity: number; frame: number }> = ({ opacity, frame }) => {
  const dot = (delay: number) => ({
    width: 12, height: 12, borderRadius: "50%", background: "#94a3b8",
    transform: `translateY(${Math.sin(((frame - delay) / 8) * Math.PI) * 6}px)`,
  });
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16, opacity, paddingRight: 80 }}>
      <div style={{
        width: 44, height: 44, borderRadius: "50%",
        background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
        flexShrink: 0, marginRight: 10, marginTop: 4,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
      }}>💪</div>
      <div style={{ maxWidth: "75%" }}>
        <p style={{ fontSize: 22, color: "#94a3b8", marginBottom: 4, fontWeight: 600 }}>
          トレーナー（自分）
        </p>
        <div style={{
          background: "#2d3748", borderRadius: "4px 20px 20px 20px",
          padding: "18px 28px", display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}>
          <div style={dot(0)} />
          <div style={dot(8)} />
          <div style={dot(16)} />
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ステータスバー
// ============================================================
const StatusBar: React.FC = () => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 32px 8px", color: "#f8fafc", fontSize: 24, fontWeight: 700,
  }}>
    <span>13:42</span>
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <svg width="24" height="18" viewBox="0 0 24 18" fill="white">
        <rect x="0" y="10" width="4" height="8" rx="1" />
        <rect x="6" y="6" width="4" height="12" rx="1" />
        <rect x="12" y="2" width="4" height="16" rx="1" />
        <rect x="18" y="0" width="4" height="18" rx="1" opacity="0.3" />
      </svg>
      <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
        <path d="M12 14a2 2 0 110 4 2 2 0 010-4z" fill="white" />
        <path d="M5.6 10.4A9 9 0 0118.4 10.4" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M2 6.8A14 14 0 0122 6.8" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </svg>
      <div style={{
        width: 32, height: 16, border: "2px solid white", borderRadius: 3,
        position: "relative", display: "flex", alignItems: "center", padding: 2,
      }}>
        <div style={{ position: "absolute", right: -5, top: "50%", transform: "translateY(-50%)", width: 3, height: 8, background: "white", borderRadius: "0 2px 2px 0" }} />
        <div style={{ width: "60%", height: "100%", background: "#10b981", borderRadius: 1 }} />
      </div>
    </div>
  </div>
);

// ============================================================
// チャットナビ
// ============================================================
const ChatNavBar: React.FC = () => (
  <div style={{
    background: "#1e293b", borderBottom: "1px solid #334155",
    padding: "14px 24px", display: "flex", alignItems: "center", gap: 16,
  }}>
    <div style={{ color: "#3b82f6", fontSize: 26, fontWeight: 700 }}>＜</div>
    <div style={{
      width: 52, height: 52, borderRadius: "50%",
      background: "linear-gradient(135deg, #475569, #334155)",
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0,
    }}>👤</div>
    <div style={{ flex: 1 }}>
      <p style={{ color: "#f8fafc", fontSize: 26, fontWeight: 700, lineHeight: 1.2 }}>田中 健太</p>
      <p style={{ color: "#10b981", fontSize: 20, fontWeight: 500 }}>オンライン</p>
    </div>
    <div style={{ display: "flex", gap: 20, color: "#94a3b8", fontSize: 28 }}>
      <span>📞</span><span>⋮</span>
    </div>
  </div>
);

// ============================================================
// ベネフィットカード（PRセクション用）
// ============================================================
const BenefitCard: React.FC<{
  icon: string; title: string; body: string; color: string;
  opacity: number; translateY: number;
}> = ({ icon, title, body, color, opacity, translateY }) => (
  <div style={{
    opacity,
    transform: `translateY(${translateY}px)`,
    background: "rgba(15,23,42,0.85)",
    border: `1px solid ${color}55`,
    borderRadius: 24,
    padding: "28px 32px",
    display: "flex",
    alignItems: "flex-start",
    gap: 24,
    boxShadow: `0 0 32px ${color}22, 0 8px 24px rgba(0,0,0,0.5)`,
    backdropFilter: "blur(8px)",
  }}>
    <div style={{
      width: 72, height: 72, borderRadius: 20,
      background: `${color}22`,
      border: `1.5px solid ${color}66`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 36, flexShrink: 0,
    }}>{icon}</div>
    <div>
      <p style={{ color: "#f1f5f9", fontSize: 34, fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>
        {title}
      </p>
      <p style={{ color: "#94a3b8", fontSize: 26, lineHeight: 1.5 }}>{body}</p>
    </div>
  </div>
);

// ============================================================
// メインコンポーネント
// ============================================================
export const LineChatMockup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Phase1: クライアントメッセージ ---
  const clientProgress = spring({ frame, fps, from: 0, to: 1, config: { damping: 14, stiffness: 120, mass: 0.8 } });
  const clientOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const clientTranslateY = interpolate(clientProgress, [0, 1], [60, 0]);

  // --- Phase2: タイピングインジケーター ---
  const typingOpacity = interpolate(frame, [60, 80, 100, 120], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // --- Phase3: タイピングアニメーション ---
  const totalChars = FULL_TRAINER_TEXT.length;
  const trainerOpacity = interpolate(frame, [TYPING_START, TYPING_START + 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const typedChars = frame >= TYPING_START
    ? Math.min(totalChars, Math.floor(interpolate(frame, [TYPING_START, TYPING_END], [0, totalChars], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      })))
    : 0;
  const visibleText = FULL_TRAINER_TEXT.slice(0, typedChars);

  const trainerSlide = spring({ frame: frame - TYPING_START, fps, from: 0, to: 1, config: { damping: 16, stiffness: 100, mass: 0.9 } });
  const trainerTranslateY = interpolate(trainerSlide, [0, 1], [50, 0]);

  // スクロールオフセット
  const scrollOffset = interpolate(frame, [TYPING_START, TYPING_END], [0, -280], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // --- Phase4: 面倒くさいオーバーレイ ---
  const exhaustOpacity = interpolate(frame, [EXHAUST_IN, EXHAUST_IN + 40], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // PRセクション開始前にフェードアウト
  const exhaustFadeOut = interpolate(frame, [PR_START - 30, PR_START], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const exhaustFinal = exhaustOpacity * exhaustFadeOut;

  // --- Phase5: PRセクション ---
  const prBgOpacity = interpolate(frame, [PR_START, PR_START + 30], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ロゴ・タイトル
  const logoSlide = spring({ frame: frame - PR_START, fps, from: 0, to: 1, config: { damping: 14, stiffness: 90, mass: 1 } });
  const logoOpacity = interpolate(frame, [PR_START, PR_START + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoY = interpolate(logoSlide, [0, 1], [60, 0]);

  // ベネフィットカード（各カードを0.5秒ずつずらして登場）
  const cardAnimations = BENEFITS.map((_, i) => {
    const start = PR_START + 80 + i * 50;
    const cardSpring = spring({ frame: frame - start, fps, from: 0, to: 1, config: { damping: 15, stiffness: 110, mass: 0.85 } });
    return {
      opacity: interpolate(frame, [start, start + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      translateY: interpolate(cardSpring, [0, 1], [50, 0]),
    };
  });

  // CTA
  const ctaStart = PR_START + 260;
  const ctaSpring = spring({ frame: frame - ctaStart, fps, from: 0, to: 1, config: { damping: 12, stiffness: 80, mass: 1.2 } });
  const ctaOpacity = interpolate(frame, [ctaStart, ctaStart + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaScale = interpolate(ctaSpring, [0, 1], [0.85, 1]);

  const showPR = frame >= PR_START;

  return (
    <div style={{
      width: 1080, height: 1920,
      background: "#0f172a",
      display: "flex", flexDirection: "column",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Noto Sans JP", sans-serif',
      overflow: "hidden", position: "relative",
    }}>

      {/* ===== チャット画面（PRセクション前まで表示） ===== */}
      {!showPR && (
        <>
          <StatusBar />
          <ChatNavBar />
          <div style={{
            flex: 1,
            background: "radial-gradient(ellipse at top, #1a2744 0%, #0f172a 60%)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }} />
            <div style={{ padding: "32px 28px", transform: `translateY(${scrollOffset}px)` }}>
              <ChatBubble
                text="おすすめのサプリは何ですか？💊"
                side="left"
                opacity={clientOpacity}
                translateY={clientTranslateY}
              />
              {frame >= 60 && frame < 130 && (
                <TypingIndicator opacity={typingOpacity} frame={frame} />
              )}
              {frame >= TYPING_START && visibleText.length > 0 && (
                <div style={{
                  display: "flex", justifyContent: "flex-end", marginBottom: 16,
                  opacity: trainerOpacity,
                  transform: `translateY(${trainerTranslateY}px)`,
                  paddingLeft: 80,
                }}>
                  <div style={{ maxWidth: "75%" }}>
                    <p style={{ fontSize: 22, color: "#94a3b8", marginBottom: 4, fontWeight: 600, textAlign: "right" }}>
                      トレーナー（自分）
                    </p>
                    <div style={{
                      background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                      borderRadius: "20px 4px 20px 20px",
                      padding: "20px 24px",
                      color: "#ffffff",
                      fontSize: 27, lineHeight: 1.7,
                      boxShadow: "0 6px 28px rgba(59,130,246,0.4)",
                      wordBreak: "break-all" as const,
                      whiteSpace: "pre-wrap" as const,
                    }}>
                      {visibleText}
                      {frame < TYPING_END && (
                        <span style={{
                          display: "inline-block", width: 3, height: "1em",
                          background: "rgba(255,255,255,0.9)", marginLeft: 2,
                          verticalAlign: "text-bottom",
                          opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0,
                        }} />
                      )}
                    </div>
                    {frame >= TYPING_END && (
                      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6, marginTop: 6 }}>
                        <span style={{ fontSize: 20, color: "#06b6d4", fontWeight: 700 }}>既読</span>
                        <span style={{ fontSize: 20, color: "#64748b" }}>13:43</span>
                      </div>
                    )}
                  </div>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                    flexShrink: 0, marginLeft: 10, marginTop: 4,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                  }}>💪</div>
                </div>
              )}
            </div>
          </div>
          {/* 入力バー */}
          <div style={{
            background: "#1e293b", borderTop: "1px solid #334155",
            padding: "18px 20px 32px", display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{ color: "#64748b", fontSize: 32 }}>＋</div>
            <div style={{
              flex: 1, background: "#0f172a", borderRadius: 24,
              padding: "14px 20px", color: "#475569", fontSize: 26, border: "1px solid #334155",
            }}>メッセージを入力...</div>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
            }}>➤</div>
          </div>
        </>
      )}

      {/* ===== Phase4: 面倒くさいオーバーレイ ===== */}
      {frame >= EXHAUST_IN && frame < PR_START + 10 && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "flex-end",
          opacity: exhaustFinal, pointerEvents: "none",
          paddingBottom: 200,
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(15,23,42,0) 0%, rgba(15,23,42,0.8) 50%, rgba(15,23,42,0.95) 100%)",
          }} />
          <div style={{
            position: "relative", zIndex: 10,
            textAlign: "center", padding: "44px 56px",
            background: "rgba(15,23,42,0.9)",
            borderRadius: 32, border: "1px solid rgba(239,68,68,0.3)",
            boxShadow: "0 0 80px rgba(239,68,68,0.15), 0 24px 64px rgba(0,0,0,0.6)",
          }}>
            <div style={{ fontSize: 88, marginBottom: 20, lineHeight: 1 }}>😩</div>
            <p style={{ color: "#ef4444", fontSize: 44, fontWeight: 800, lineHeight: 1.3, marginBottom: 12 }}>
              この作業、面倒くさい…
            </p>
            <p style={{ color: "#94a3b8", fontSize: 28, lineHeight: 1.6 }}>
              毎回この長文を打ち直す時間が{"\n"}本当にもったいない
            </p>
            <div style={{
              marginTop: 24, padding: "14px 28px",
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 14, display: "flex", alignItems: "center", gap: 10, justifyContent: "center",
            }}>
              <span style={{ fontSize: 26 }}>⏱</span>
              <span style={{ color: "#fca5a5", fontSize: 26, fontWeight: 700 }}>
                1クライアントあたり平均 15分/回 のロス
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ===== Phase5: SUPPLEMENT-ORACLE PRセクション ===== */}
      {showPR && (
        <div style={{
          position: "absolute", inset: 0,
          opacity: prBgOpacity,
          background: "linear-gradient(160deg, #080d1a 0%, #0f1f3d 40%, #080d1a 100%)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "60px 48px",
          gap: 0,
        }}>
          {/* 装飾背景グロー */}
          <div style={{
            position: "absolute", top: "15%", left: "50%",
            transform: "translateX(-50%)",
            width: 600, height: 600, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* ロゴ・ヘッドライン */}
          <div style={{
            opacity: logoOpacity,
            transform: `translateY(${logoY}px)`,
            textAlign: "center", marginBottom: 48,
          }}>
            <p style={{ color: "#94a3b8", fontSize: 26, fontWeight: 600, letterSpacing: "0.15em", marginBottom: 12 }}>
              SOLUTION
            </p>
            <p style={{
              fontSize: 52, fontWeight: 900, lineHeight: 1.2,
              background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em", marginBottom: 8,
            }}>
              Supplement Oracle
            </p>
            <p style={{ color: "#f1f5f9", fontSize: 30, fontWeight: 700 }}>
              が、この悩みを解決します。
            </p>
          </div>

          {/* ベネフィットカード */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", marginBottom: 44 }}>
            {BENEFITS.map((b, i) => (
              <BenefitCard
                key={i}
                icon={b.icon}
                title={b.title}
                body={b.body}
                color={b.color}
                opacity={cardAnimations[i].opacity}
                translateY={cardAnimations[i].translateY}
              />
            ))}
          </div>

          {/* CTA */}
          <div style={{
            opacity: ctaOpacity,
            transform: `scale(${ctaScale})`,
            textAlign: "center",
          }}>
            <div style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
              borderRadius: 50, padding: "26px 72px",
              boxShadow: "0 8px 40px rgba(59,130,246,0.5)",
              marginBottom: 18,
            }}>
              <p style={{ color: "#ffffff", fontSize: 36, fontWeight: 900, letterSpacing: "0.02em" }}>
                今すぐ無料で試す
              </p>
            </div>
            <p style={{ color: "#64748b", fontSize: 22 }}>プロフィールのリンクから ↗</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LineChatMockup;
