import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, COPY, FONT, SCENES } from "../constants";
import { sceneOpacity, springScale, springSlideY } from "../utils/animations";
import { Logo } from "../components/Logo";
import { MockFlowStep, FlowArrow, MockSuppCard } from "../components/MockUI";

// ============================================================
//  Scene 3: ProductReveal (8–13秒 / 240–390f → ローカル 0–150f)
//  タイミング:
//   - ロゴ: f4-22 登場 → f22-55 ホールド (1.1s)
//   - ブランド名: f18-36 登場 → f36-70 ホールド (1.1s)
//   - by ORIVEX タグ: f30-44
//   - サブタイトル: f50-64
//   - フロー: Step1 f68, Step2 f80, Step3 f92 → f110まで全表示ホールド
//   - レポートカード: f110-128 → f128-140 ホールド
//   - フェードアウト: f140-150
// ============================================================

const DURATION = SCENES.reveal.durationInFrames; // 150f
const CLAMP = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const ProductReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = sceneOpacity(frame, DURATION, 6, 10);

  // ── ロゴ ──
  const logoScale = springScale(frame, 4, fps, 0.6, { damping: 16, stiffness: 80, mass: 1 });
  const logoOpacity = interpolate(frame, [4, 22], [0, 1], CLAMP);

  // ── ブランド名 ──
  const brandOpacity = interpolate(frame, [18, 36], [0, 1], CLAMP);
  const brandY = interpolate(frame, [18, 36], [28, 0], CLAMP);

  // ── by ORIVEX タグ ──
  const byOpacity = interpolate(frame, [30, 44], [0, 1], CLAMP);

  // ── サブタイトル ──
  const subtitleOpacity = interpolate(frame, [50, 64], [0, 1], CLAMP);
  const subtitleY = interpolate(frame, [50, 64], [16, 0], CLAMP);
  const dividerOpacity = interpolate(frame, [58, 70], [0, 1], CLAMP);

  // ── 3ステップフロー ──
  const step1Opacity = interpolate(frame, [68, 82], [0, 1], CLAMP);
  const step1Y = interpolate(frame, [68, 82], [24, 0], CLAMP);
  const step2Opacity = interpolate(frame, [80, 94], [0, 1], CLAMP);
  const step2Y = interpolate(frame, [80, 94], [24, 0], CLAMP);
  const step3Opacity = interpolate(frame, [92, 106], [0, 1], CLAMP);
  const step3Y = interpolate(frame, [92, 106], [24, 0], CLAMP);

  // ── レポートカード ──
  const reportOpacity = interpolate(frame, [110, 126], [0, 1], CLAMP);

  const bgGlowOpacity = interpolate(frame, [6, 28], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ opacity }}>

      {/* ── シーン固有グロー ── */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 65% 45% at 50% 28%, rgba(6,182,212,0.09) 0%, rgba(59,130,246,0.07) 55%, transparent 100%)",
          opacity: bgGlowOpacity,
        }}
      />

      {/* ── ロゴアイコン ── */}
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        <Logo size={140} />
      </div>

      {/* ── ブランド名 ── */}
      <div
        style={{
          position: "absolute",
          top: 408,
          left: 52,
          right: 52,
          textAlign: "center" as const,
          fontFamily: FONT.montserrat,
          opacity: brandOpacity,
          transform: `translateY(${brandY}px)`,
        }}
      >
        <div
          style={{
            background: `linear-gradient(90deg, ${COLORS.blueLight} 0%, ${COLORS.cyan} 50%, ${COLORS.blue} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontSize: 68,
            fontWeight: 800,
            letterSpacing: 1,
            lineHeight: 1.1,
          }}
        >
          {COPY.scene3.productName}
        </div>
      </div>

      {/* ── by ORIVEX タグ ── */}
      <div
        style={{
          position: "absolute",
          top: 500,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: byOpacity,
        }}
      >
        <div style={{
          display: "inline-block",
          padding: "6px 20px",
          border: `1px solid rgba(6,182,212,0.45)`,
          borderRadius: 24,
          color: "rgba(6,182,212,0.9)",
          fontSize: 15,
          fontWeight: 600,
          fontFamily: FONT.montserrat,
          letterSpacing: 1.5,
          background: "rgba(6,182,212,0.06)",
        }}>
          {COPY.scene3.byBrand}
        </div>
      </div>

      {/* ── サブタイトル ── */}
      <div
        style={{
          position: "absolute",
          top: 570,
          left: 52,
          right: 52,
          textAlign: "center" as const,
          fontFamily: FONT.family,
        }}
      >
        <div
          style={{
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            color: COLORS.textSub,
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: 2,
            marginBottom: 22,
          }}
        >
          {COPY.scene3.subtitle}
        </div>
        <div
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${COLORS.blue}, ${COLORS.cyan}, ${COLORS.blue}, transparent)`,
            opacity: dividerOpacity * 0.45,
          }}
        />
      </div>

      {/* ── 3ステップフロー ── */}
      <div
        style={{
          position: "absolute",
          top: 682,
          left: 40,
          right: 40,
          display: "flex",
          alignItems: "center",
          fontFamily: FONT.family,
        }}
      >
        <div style={{ flex: 1, opacity: step1Opacity, transform: `translateY(${step1Y}px)` }}>
          <MockFlowStep
            icon="📋"
            title={COPY.scene3.step1}
            subtitle={"顧客情報・目標・\nサプリ状況を入力"}
          />
        </div>
        <div style={{ opacity: step2Opacity, transform: `translateY(${step2Y}px)` }}>
          <FlowArrow />
        </div>
        <div style={{ flex: 1, opacity: step2Opacity, transform: `translateY(${step2Y}px)` }}>
          <MockFlowStep
            icon="⚡"
            title={COPY.scene3.step2}
            subtitle={"禁忌・注意点を\n自動スクリーニング"}
            isCenter
          />
        </div>
        <div style={{ opacity: step3Opacity, transform: `translateY(${step3Y}px)` }}>
          <FlowArrow />
        </div>
        <div style={{ flex: 1, opacity: step3Opacity, transform: `translateY(${step3Y}px)` }}>
          <MockFlowStep
            icon="📄"
            title={COPY.scene3.step3}
            subtitle={"根拠・タイミング・\n注意点を整理出力"}
          />
        </div>
      </div>

      {/* ── 提案レポートサンプル ── */}
      <div
        style={{
          position: "absolute",
          top: 1020,
          left: 52,
          right: 52,
          opacity: reportOpacity,
          fontFamily: FONT.family,
        }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}>
          <div style={{ color: COLORS.textSub, fontSize: 14, fontWeight: 600, letterSpacing: 1 }}>
            PROPOSAL REPORT — 田中 太郎様
          </div>
          <div style={{
            background: "rgba(16,185,129,0.15)",
            border: "1px solid rgba(16,185,129,0.4)",
            color: COLORS.success,
            fontSize: 12, fontWeight: 700,
            borderRadius: 20, padding: "4px 14px",
          }}>
            生成完了
          </div>
        </div>
        <MockSuppCard name="BCAA（2:1:1）" timing="トレーニング直前・中 / 5g" score="A" lane="a" />
        <MockSuppCard name="グルタミン" timing="就寝前 / 5g" score="A" lane="a" />
        <MockSuppCard
          name="ZMA（亜鉛・マグネシウム）"
          timing="就寝 30 分前 / 1cap"
          score="B+"
          lane="b"
          note="⚠ 高血圧家族歴あり — 亜鉛過剰摂取に注意"
        />
      </div>

    </AbsoluteFill>
  );
};
