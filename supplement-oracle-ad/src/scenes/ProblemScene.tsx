import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, COPY, FONT, SCENES } from "../constants";
import { sceneOpacity, springSlideX } from "../utils/animations";
import { MockCard, MockCardHeader, MockChatBubble, MockCheckItem } from "../components/MockUI";

// ============================================================
//  Scene 2: ProblemScene (3–8秒 / 90–240f → ローカル 0–150f)
//  タイミング:
//   - Card1 (チャット): f6-24 登場 → f24-90 ホールド (2.2s！)
//   - Card2 (タスク):   f72-90 登場 → f90-130 ホールド (1.3s)
//   - 問題テキスト:     f108-124 登場 → f124-140 ホールド
//   - フェードアウト:   f140-150
// ============================================================

const DURATION = SCENES.problem.durationInFrames; // 150f
const CLAMP = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = sceneOpacity(frame, DURATION, 7, 10);

  // ── カード1: チャット対応 ──
  const card1X = springSlideX(frame, 6, fps, 65, { damping: 24, stiffness: 82, mass: 1 });
  const card1Opacity = interpolate(frame, [6, 22], [0, 1], CLAMP);

  // ── カード2: タスク管理 ──
  const card2X = springSlideX(frame, 72, fps, 65, { damping: 24, stiffness: 82, mass: 1 });
  const card2Opacity = interpolate(frame, [72, 88], [0, 1], CLAMP);

  // ── 問題テキスト ──
  const textOpacity = interpolate(frame, [108, 124], [0, 1], CLAMP);
  const textY = interpolate(frame, [108, 124], [24, 0], CLAMP);

  return (
    <AbsoluteFill style={{ opacity }}>

      {/* ── チャット対応カード ── */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: 52,
          right: 52,
          opacity: card1Opacity,
          transform: `translateX(${card1X}px)`,
        }}
      >
        <MockCard glowIntensity={0.8}>
          <MockCardHeader title="相談対応 (LINE)" badge="未読 3" />

          <MockChatBubble
            text="プロテインは飲んでるんですが、最近なかなか筋肉がつかない感じがして。食事も気をつけてるつもりなんですが…"
            time="13:24"
          />
          <MockChatBubble
            text="睡眠が浅くて夜中に目が覚めることも多くて。何かいいサプリとかありますか？ZMAとかトリプトファンって副作用ありますか？"
            time="13:26"
          />
          {/* 返信入力エリア */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 8,
              padding: "12px 16px",
              background: "rgba(17,24,39,0.65)",
              borderRadius: 10,
              border: `1px solid ${COLORS.borderBlue}`,
            }}
          >
            <div style={{ color: COLORS.textDim, fontSize: 14, flex: 1 }}>
              返信を入力…
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: "50%",
                background: COLORS.blue, opacity: 0.35 + i * 0.25,
              }} />
            ))}
          </div>
        </MockCard>
      </div>

      {/* ── 提案タスク管理カード ── */}
      <div
        style={{
          position: "absolute",
          top: 860,
          left: 52,
          right: 52,
          opacity: card2Opacity,
          transform: `translateX(${card2X}px)`,
        }}
      >
        <MockCard glowIntensity={0.7}>
          <MockCardHeader title="提案タスク管理" badge="5件 対応中" />

          <MockCheckItem label="プロテイン選定 — 田中さん" sub="目標: 筋肥大 / 本日締切" checked={false} />
          <MockCheckItem label="BCAA 推奨量の計算 — 佐藤さん" sub="腎機能の確認要" checked={false} />
          <MockCheckItem label="グルタミンの説明文作成 — 山田さん" sub="初回提案・資料添付必要" checked={false} />
          <MockCheckItem label="禁忌サプリ確認 — 鈴木さん" sub="医師への確認済み" checked={true} />
          <MockCheckItem label="ZMA 比較資料 — 中島さん" sub="LINE にて質問あり" checked={false} />
        </MockCard>
      </div>

      {/* ── 問題テキスト ── */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: 72,
          right: 72,
          fontFamily: FONT.family,
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        <div style={{
          color: COLORS.blue,
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: "uppercase" as const,
          marginBottom: 14,
        }}>
          PROBLEM
        </div>
        <div style={{
          color: COLORS.textPrimary,
          fontSize: 68,
          fontWeight: 800,
          lineHeight: 1.18,
          letterSpacing: -1,
        }}>
          {COPY.scene2.line1}
        </div>
        <div style={{
          color: COLORS.textPrimary,
          fontSize: 68,
          fontWeight: 800,
          lineHeight: 1.18,
          letterSpacing: -1,
        }}>
          {COPY.scene2.line2}
        </div>
      </div>

    </AbsoluteFill>
  );
};
