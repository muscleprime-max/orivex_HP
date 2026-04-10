import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

// ============================================================
// 型定義
// ============================================================
interface BubbleProps {
  text: string;
  side: "left" | "right";
  opacity: number;
  translateY: number;
}

// ============================================================
// 吹き出しコンポーネント
// ============================================================
const ChatBubble: React.FC<BubbleProps> = ({
  text,
  side,
  opacity,
  translateY,
}) => {
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
      {/* アバター（左側のみ） */}
      {!isRight && (
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #475569 0%, #334155 100%)",
            flexShrink: 0,
            marginRight: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            marginTop: 4,
          }}
        >
          👤
        </div>
      )}

      <div style={{ maxWidth: "75%" }}>
        {/* 送信者名 */}
        {!isRight && (
          <p
            style={{
              fontSize: 22,
              color: "#94a3b8",
              marginBottom: 4,
              fontWeight: 600,
            }}
          >
            田中 健太
          </p>
        )}

        {/* 吹き出し本体 */}
        <div
          style={{
            background: isRight
              ? "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
              : "#2d3748",
            borderRadius: isRight
              ? "20px 4px 20px 20px"
              : "4px 20px 20px 20px",
            padding: "18px 22px",
            color: "#ffffff",
            fontSize: 28,
            lineHeight: 1.65,
            letterSpacing: "0.01em",
            boxShadow: isRight
              ? "0 4px 20px rgba(59,130,246,0.35)"
              : "0 4px 16px rgba(0,0,0,0.4)",
            wordBreak: "break-all" as const,
            whiteSpace: "pre-wrap" as const,
          }}
        >
          {text}
        </div>

        {/* 既読・時刻 */}
        <div
          style={{
            display: "flex",
            justifyContent: isRight ? "flex-end" : "flex-start",
            alignItems: "center",
            gap: 6,
            marginTop: 6,
          }}
        >
          {isRight && (
            <span style={{ fontSize: 20, color: "#06b6d4", fontWeight: 700 }}>
              既読
            </span>
          )}
          <span style={{ fontSize: 20, color: "#64748b" }}>13:42</span>
        </div>
      </div>

      {/* アバター（右側のみ） */}
      {isRight && (
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
            flexShrink: 0,
            marginLeft: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            marginTop: 4,
          }}
        >
          💪
        </div>
      )}
    </div>
  );
};

// ============================================================
// タイピングインジケーター（3ドット波打ち）
// ============================================================
const TypingIndicator: React.FC<{ opacity: number; frame: number }> = ({
  opacity,
  frame,
}) => {
  const dotStyle = (delayFrames: number) => {
    const y = Math.sin(((frame - delayFrames) / 8) * Math.PI) * 6;
    return {
      width: 12,
      height: 12,
      borderRadius: "50%",
      background: "#94a3b8",
      transform: `translateY(${y}px)`,
    };
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        marginBottom: 16,
        opacity,
        paddingRight: 80,
      }}
    >
      {/* アバター */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
          flexShrink: 0,
          marginRight: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          marginTop: 4,
        }}
      >
        💪
      </div>

      <div style={{ maxWidth: "75%" }}>
        <p
          style={{
            fontSize: 22,
            color: "#94a3b8",
            marginBottom: 4,
            fontWeight: 600,
          }}
        >
          トレーナー（自分）
        </p>
        <div
          style={{
            background: "#2d3748",
            borderRadius: "4px 20px 20px 20px",
            padding: "18px 28px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          <div style={dotStyle(0)} />
          <div style={dotStyle(8)} />
          <div style={dotStyle(16)} />
        </div>
      </div>
    </div>
  );
};

// ============================================================
// iOSステータスバー風
// ============================================================
const StatusBar: React.FC = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 32px 8px",
      color: "#f8fafc",
      fontSize: 24,
      fontWeight: 700,
    }}
  >
    <span>13:42</span>
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {/* 電波 */}
      <svg width="24" height="18" viewBox="0 0 24 18" fill="white">
        <rect x="0" y="10" width="4" height="8" rx="1" />
        <rect x="6" y="6" width="4" height="12" rx="1" />
        <rect x="12" y="2" width="4" height="16" rx="1" />
        <rect x="18" y="0" width="4" height="18" rx="1" opacity="0.3" />
      </svg>
      {/* Wi-Fi */}
      <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
        <path d="M12 14a2 2 0 110 4 2 2 0 010-4z" fill="white" />
        <path
          d="M5.6 10.4A9 9 0 0118.4 10.4"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M2 6.8A14 14 0 0122 6.8"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
      {/* バッテリー */}
      <div
        style={{
          width: 32,
          height: 16,
          border: "2px solid white",
          borderRadius: 3,
          position: "relative",
          display: "flex",
          alignItems: "center",
          padding: 2,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -5,
            top: "50%",
            transform: "translateY(-50%)",
            width: 3,
            height: 8,
            background: "white",
            borderRadius: "0 2px 2px 0",
          }}
        />
        <div
          style={{
            width: "60%",
            height: "100%",
            background: "#10b981",
            borderRadius: 1,
          }}
        />
      </div>
    </div>
  </div>
);

// ============================================================
// ナビゲーションバー（LINEチャット上部）
// ============================================================
const ChatNavBar: React.FC = () => (
  <div
    style={{
      background: "#1e293b",
      borderBottom: "1px solid #334155",
      padding: "14px 24px",
      display: "flex",
      alignItems: "center",
      gap: 16,
    }}
  >
    {/* 戻るボタン */}
    <div style={{ color: "#3b82f6", fontSize: 26, fontWeight: 700 }}>＜</div>

    {/* アバター */}
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #475569, #334155)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        flexShrink: 0,
      }}
    >
      👤
    </div>

    {/* 名前・ステータス */}
    <div style={{ flex: 1 }}>
      <p
        style={{
          color: "#f8fafc",
          fontSize: 26,
          fontWeight: 700,
          lineHeight: 1.2,
        }}
      >
        田中 健太
      </p>
      <p style={{ color: "#10b981", fontSize: 20, fontWeight: 500 }}>
        オンライン
      </p>
    </div>

    {/* アイコン群 */}
    <div style={{ display: "flex", gap: 20, color: "#94a3b8", fontSize: 28 }}>
      <span>📞</span>
      <span>⋮</span>
    </div>
  </div>
);

// ============================================================
// メインコンポーネント
// ============================================================

const FULL_TRAINER_TEXT =
  "現在の目的と、普段の食事内容によりますね。もし筋力アップが第一優先であれば、まずはベースとしてプロテインとクレアチンをしっかり摂りましょう。クレアチンはローディング期を設けるか否かで効果の出方が変わりますが、個人的には最初の5日間だけ1日20gを分割摂取して、その後5g/日のメンテナンス期に移行するのがおすすめです。プロテインはWPI（ホエイプロテインアイソレート）が吸収率が高く、乳糖不耐症の方にも優しいです。食事で十分なタンパク質（体重×1.6〜2.0g）が摂れているなら、量を控えてBCAAやEAAを補助的に使うのも手です。";

export const LineChatMockup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ----------------------------------------
  // Phase 1: クライアントメッセージ登場 (0〜60f)
  // ----------------------------------------
  const clientBubbleProgress = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: {
      damping: 14,
      stiffness: 120,
      mass: 0.8,
    },
  });

  const clientOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const clientTranslateY = interpolate(clientBubbleProgress, [0, 1], [60, 0]);

  // ----------------------------------------
  // Phase 2: タイピングインジケーター (60〜120f)
  // ----------------------------------------
  const typingOpacity = interpolate(frame, [60, 80, 100, 120], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ----------------------------------------
  // Phase 3: トレーナーメッセージ タイピング (120〜480f)
  // ----------------------------------------
  const TYPING_START = 120;
  const TYPING_END = 480;
  const totalChars = FULL_TRAINER_TEXT.length;

  const trainerBubbleOpacity = interpolate(
    frame,
    [TYPING_START, TYPING_START + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const typedChars =
    frame >= TYPING_START
      ? Math.min(
          totalChars,
          Math.floor(
            interpolate(
              frame,
              [TYPING_START, TYPING_END],
              [0, totalChars],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            )
          )
        )
      : 0;

  const visibleText = FULL_TRAINER_TEXT.slice(0, typedChars);

  // トレーナー吹き出しのスライドイン
  const trainerSlide = spring({
    frame: frame - TYPING_START,
    fps,
    from: 0,
    to: 1,
    config: { damping: 16, stiffness: 100, mass: 0.9 },
  });
  const trainerTranslateY = interpolate(trainerSlide, [0, 1], [50, 0]);

  // ----------------------------------------
  // Phase 4: 完成・静止 (480〜600f) → "面倒くさい"オーバーレイ
  // ----------------------------------------
  const exhaustOverlayOpacity = interpolate(
    frame,
    [490, 520],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // スクロール: タイピングが進むに連れてチャットを上にスクロール
  const scrollOffset = interpolate(
    frame,
    [TYPING_START, TYPING_END],
    [0, -340],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: "#0f172a",
        display: "flex",
        flexDirection: "column",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Noto Sans JP", sans-serif',
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ===== ステータスバー ===== */}
      <StatusBar />

      {/* ===== チャットナビゲーション ===== */}
      <ChatNavBar />

      {/* ===== チャット背景 ===== */}
      <div
        style={{
          flex: 1,
          background:
            "radial-gradient(ellipse at top, #1a2744 0%, #0f172a 60%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 装飾的な背景グリッド */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* スクロールコンテナ */}
        <div
          style={{
            padding: "32px 28px",
            transform: `translateY(${scrollOffset}px)`,
          }}
        >
          {/* --- クライアントメッセージ --- */}
          <ChatBubble
            text="おすすめのサプリは何ですか？💊"
            side="left"
            opacity={clientOpacity}
            translateY={clientTranslateY}
          />

          {/* --- タイピングインジケーター --- */}
          {frame >= 60 && frame < 130 && (
            <TypingIndicator opacity={typingOpacity} frame={frame} />
          )}

          {/* --- トレーナー長文メッセージ --- */}
          {frame >= TYPING_START && visibleText.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 16,
                opacity: trainerBubbleOpacity,
                transform: `translateY(${trainerTranslateY}px)`,
                paddingLeft: 80,
              }}
            >
              <div style={{ maxWidth: "75%" }}>
                <p
                  style={{
                    fontSize: 22,
                    color: "#94a3b8",
                    marginBottom: 4,
                    fontWeight: 600,
                    textAlign: "right",
                  }}
                >
                  トレーナー（自分）
                </p>
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                    borderRadius: "20px 4px 20px 20px",
                    padding: "20px 24px",
                    color: "#ffffff",
                    fontSize: 27,
                    lineHeight: 1.7,
                    letterSpacing: "0.01em",
                    boxShadow: "0 6px 28px rgba(59,130,246,0.4)",
                    wordBreak: "break-all" as const,
                    whiteSpace: "pre-wrap" as const,
                  }}
                >
                  {visibleText}
                  {/* カーソル点滅 */}
                  {frame < TYPING_END && (
                    <span
                      style={{
                        display: "inline-block",
                        width: 3,
                        height: "1em",
                        background: "rgba(255,255,255,0.9)",
                        marginLeft: 2,
                        verticalAlign: "text-bottom",
                        opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0,
                      }}
                    />
                  )}
                </div>
                {frame >= TYPING_END && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 6,
                    }}
                  >
                    <span
                      style={{ fontSize: 20, color: "#06b6d4", fontWeight: 700 }}
                    >
                      既読
                    </span>
                    <span style={{ fontSize: 20, color: "#64748b" }}>
                      13:43
                    </span>
                  </div>
                )}
              </div>

              {/* アバター */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                  flexShrink: 0,
                  marginLeft: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  marginTop: 4,
                }}
              >
                💪
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== テキスト入力バー ===== */}
      <div
        style={{
          background: "#1e293b",
          borderTop: "1px solid #334155",
          padding: "18px 20px 32px",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div style={{ color: "#64748b", fontSize: 32 }}>＋</div>
        <div
          style={{
            flex: 1,
            background: "#0f172a",
            borderRadius: 24,
            padding: "14px 20px",
            color: "#475569",
            fontSize: 26,
            border: "1px solid #334155",
          }}
        >
          メッセージを入力...
        </div>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
          }}
        >
          ➤
        </div>
      </div>

      {/* ===== Phase4: 絶望オーバーレイ ===== */}
      {frame >= 490 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: exhaustOverlayOpacity,
            pointerEvents: "none",
          }}
        >
          {/* 暗いグラデーションベール */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(15,23,42,0) 0%, rgba(15,23,42,0.75) 40%, rgba(15,23,42,0.92) 100%)",
            }}
          />

          {/* メッセージ */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              textAlign: "center",
              padding: "48px 60px",
              background: "rgba(15,23,42,0.85)",
              borderRadius: 32,
              border: "1px solid rgba(239,68,68,0.3)",
              boxShadow:
                "0 0 80px rgba(239,68,68,0.15), 0 24px 64px rgba(0,0,0,0.6)",
              backdropFilter: "blur(12px)",
              marginTop: 600,
            }}
          >
            {/* 疲弊アイコン */}
            <div style={{ fontSize: 96, marginBottom: 24, lineHeight: 1 }}>
              😩
            </div>
            <p
              style={{
                color: "#ef4444",
                fontSize: 46,
                fontWeight: 800,
                lineHeight: 1.3,
                letterSpacing: "-0.02em",
                marginBottom: 16,
              }}
            >
              この作業、面倒くさい…
            </p>
            <p
              style={{
                color: "#94a3b8",
                fontSize: 30,
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              毎回この長文を打ち直す
              {"\n"}時間が本当にもったいない
            </p>

            {/* 時間ロスの強調 */}
            <div
              style={{
                marginTop: 28,
                padding: "16px 32px",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                gap: 12,
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 28 }}>⏱</span>
              <span
                style={{ color: "#fca5a5", fontSize: 28, fontWeight: 700 }}
              >
                1クライアントあたり平均 15分/回 のロス
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// Remotion コンポジション登録用のデフォルトエクスポート
// ============================================================
export default LineChatMockup;
