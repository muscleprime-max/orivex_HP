import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, COPY, FONT, SCENES } from "../constants";
import { sceneOpacity, springSlideY } from "../utils/animations";
import { MockCard, MockCardHeader, MockInput, MockGenerateButton } from "../components/MockUI";

// ============================================================
//  Scene 1: OpeningHook (0–3秒 / 0–90f)
//  タイミング:
//   - 行1テキスト: f4-18 登場 → f18-80 ホールド (2s以上)
//   - 行2テキスト: f14-28 登場 → f28-80 ホールド
//   - UIカード: f12-30 スプリング登場 → f30-80 ホールド (1.67s)
//   - フェードアウト: f80-90
// ============================================================

const DURATION = SCENES.hook.durationInFrames; // 90f
const CLAMP = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const OpeningHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = sceneOpacity(frame, DURATION, 5, 10);

  // ── テキスト ──
  const text1Opacity = interpolate(frame, [4, 18], [0, 1], CLAMP);
  const text1Y = interpolate(frame, [4, 18], [28, 0], CLAMP);

  const text2Opacity = interpolate(frame, [14, 28], [0, 1], CLAMP);
  const text2Y = interpolate(frame, [14, 28], [28, 0], CLAMP);

  // ── UIカード ──
  const cardY = springSlideY(frame, 12, fps, 80, {
    damping: 22, stiffness: 85, mass: 1,
  });
  const cardOpacity = interpolate(frame, [12, 28], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ opacity }}>

      {/* ── 中央グロー ── */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 28%, rgba(59,130,246,0.12) 0%, transparent 100%)",
        }}
      />

      {/* ── フックテキスト ── */}
      <div
        style={{
          position: "absolute",
          top: 260,
          left: 72,
          right: 72,
          fontFamily: FONT.family,
        }}
      >
        {/* 行1 */}
        <div
          style={{
            opacity: text1Opacity,
            transform: `translateY(${text1Y}px)`,
            color: COLORS.textPrimary,
            fontSize: 96,
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: -2,
          }}
        >
          {COPY.scene1.line1}
        </div>

        {/* 行2 グラデーション */}
        <div
          style={{
            opacity: text2Opacity,
            transform: `translateY(${text2Y}px)`,
            background: `linear-gradient(90deg, ${COLORS.blueLight}, ${COLORS.cyan})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontSize: 96,
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: -2,
            marginTop: 4,
          }}
        >
          {COPY.scene1.line2}
        </div>
      </div>

      {/* ── モックUIカード ── */}
      <div
        style={{
          position: "absolute",
          top: 610,
          left: 52,
          right: 52,
          opacity: cardOpacity,
          transform: `translateY(${cardY}px)`,
        }}
      >
        <MockCard glowIntensity={1.0}>
          <MockCardHeader title="Supplement Oracle" badge="v13" />

          <MockInput label="顧客名" value="田中 太郎（30代・男性）" highlighted />
          <MockInput label="目標・課題" value="筋肥大 / 睡眠改善" />
          <MockInput label="現在の服用状況" value="プロテイン（WPC）のみ" />
          <MockInput label="服用禁忌・注意事項" value="なし（高血圧の家族歴あり）" />

          <div style={{ marginTop: 10 }}>
            <MockGenerateButton />
          </div>
        </MockCard>
      </div>

    </AbsoluteFill>
  );
};
