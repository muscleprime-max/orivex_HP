import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, COPY, FONT, SCENES } from "../constants";
import { sceneOpacity, springScale } from "../utils/animations";
import { Logo } from "../components/Logo";
import { AccentDivider } from "../components/MockUI";

// ============================================================
//  Scene 5: ClosingCTA (19–24秒 / 570–720f → ローカル 0–150f)
//  タイミング:
//   - ロゴ: f6-24 登場
//   - ブランド名: f20-36 登場 → f36-60 ホールド (0.8s)
//   - by ORIVEX: f32-44
//   - 区切り線: f44-56
//   - メッセージ行1: f58-74 登場
//   - メッセージ行2: f68-84 登場
//   - CTAボタン: f86-104 登場 → f104-136 ホールド (1.07s！)
//   - サブテキスト: f100-116
//   - フッター: f112-128
//   - フェードアウト: f138-150
// ============================================================

const DURATION = SCENES.cta.durationInFrames; // 150f
const CLAMP = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

export const ClosingCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = sceneOpacity(frame, DURATION, 10, 12);

  // ── ロゴ ──
  const logoScale = springScale(frame, 6, fps, 0.7, { damping: 18, stiffness: 82, mass: 1 });
  const logoOpacity = interpolate(frame, [6, 22], [0, 1], CLAMP);

  // ── ブランド名 ──
  const brandOpacity = interpolate(frame, [20, 36], [0, 1], CLAMP);
  const brandY = interpolate(frame, [20, 36], [24, 0], CLAMP);

  // ── by ORIVEX ──
  const byOpacity = interpolate(frame, [32, 46], [0, 1], CLAMP);

  // ── 区切り線 ──
  const dividerOpacity = interpolate(frame, [44, 56], [0, 1], CLAMP);

  // ── メインメッセージ ──
  const msg1Opacity = interpolate(frame, [58, 74], [0, 1], CLAMP);
  const msg1Y = interpolate(frame, [58, 74], [30, 0], CLAMP);
  const msg2Opacity = interpolate(frame, [68, 84], [0, 1], CLAMP);
  const msg2Y = interpolate(frame, [68, 84], [30, 0], CLAMP);

  // ── CTAボタン ──
  const ctaOpacity = interpolate(frame, [86, 104], [0, 1], CLAMP);
  const ctaScale = interpolate(frame, [86, 104], [0.88, 1.0], CLAMP);

  // CTAグロー: 登場後パルス
  const ctaGlowBase = interpolate(frame, [100, 114], [0, 1], CLAMP);
  const pulse = interpolate(
    frame % 50,
    [0, 25, 50],
    [0.4, 0.95, 0.4],
    CLAMP
  );
  const ctaGlowOpacity = ctaGlowBase * pulse;

  // ── サブテキスト ──
  const subOpacity = interpolate(frame, [100, 116], [0, 1], CLAMP);

  // ── フッター ──
  const footerOpacity = interpolate(frame, [112, 128], [0, 1], CLAMP);

  // ── ボトムグロー ──
  const bottomGlow = interpolate(frame, [44, 68], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ opacity }}>

      {/* ── ボトムアンビエントグロー ── */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 85% 42% at 50% 82%, rgba(59,130,246,0.08) 0%, transparent 100%)",
          opacity: bottomGlow,
        }}
      />

      {/* ── ロゴ ── */}
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        <Logo size={130} />
      </div>

      {/* ── ブランド名 ── */}
      <div
        style={{
          position: "absolute",
          top: 480,
          left: 52,
          right: 52,
          textAlign: "center" as const,
          fontFamily: FONT.montserrat,
          opacity: brandOpacity,
          transform: `translateY(${brandY}px)`,
        }}
      >
        <div style={{
          background: `linear-gradient(90deg, ${COLORS.blueLight} 0%, ${COLORS.cyan} 50%, ${COLORS.blue} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontSize: 52,
          fontWeight: 800,
          letterSpacing: 1,
        }}>
          {COPY.scene3.productName}
        </div>
      </div>

      {/* ── by ORIVEX ── */}
      <div
        style={{
          position: "absolute",
          top: 556,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: byOpacity,
        }}
      >
        <div style={{
          display: "inline-block",
          padding: "5px 18px",
          border: `1px solid rgba(6,182,212,0.4)`,
          borderRadius: 22,
          color: "rgba(6,182,212,0.85)",
          fontSize: 14,
          fontWeight: 600,
          fontFamily: FONT.montserrat,
          letterSpacing: 1.5,
          background: "rgba(6,182,212,0.05)",
        }}>
          {COPY.scene3.byBrand}
        </div>
      </div>

      {/* ── アクセント区切り線 ── */}
      <div style={{
        position: "absolute",
        top: 630,
        left: 0,
        right: 0,
        opacity: dividerOpacity,
      }}>
        <AccentDivider opacity={1.4} />
      </div>

      {/* ── メインメッセージ ── */}
      <div
        style={{
          position: "absolute",
          top: 682,
          left: 68,
          right: 68,
          fontFamily: FONT.family,
          textAlign: "center" as const,
        }}
      >
        <div style={{
          opacity: msg1Opacity,
          transform: `translateY(${msg1Y}px)`,
          color: COLORS.textPrimary,
          fontSize: 76,
          fontWeight: 900,
          lineHeight: 1.16,
          letterSpacing: -1.5,
        }}>
          {COPY.scene5.main1}
        </div>
        <div style={{
          opacity: msg2Opacity,
          transform: `translateY(${msg2Y}px)`,
          color: COLORS.textPrimary,
          fontSize: 76,
          fontWeight: 900,
          lineHeight: 1.16,
          letterSpacing: -1.5,
        }}>
          {COPY.scene5.main2}
        </div>
      </div>

      {/* ── CTAボタン ── */}
      <div
        style={{
          position: "absolute",
          top: 1018,
          left: 64,
          right: 64,
          textAlign: "center" as const,
          fontFamily: FONT.family,
          opacity: ctaOpacity,
          transform: `scale(${ctaScale})`,
        }}
      >
        {/* グローエフェクト */}
        <div style={{
          position: "absolute",
          inset: -28,
          borderRadius: 32,
          background: `radial-gradient(ellipse 80% 80% at 50% 50%, rgba(59,130,246,${ctaGlowOpacity * 0.5}) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        {/* ボタン本体 */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.blueDark} 100%)`,
          color: COLORS.white,
          borderRadius: 22,
          padding: "34px 72px",
          fontSize: 56,
          fontWeight: 900,
          letterSpacing: 1,
          display: "inline-block",
          boxShadow: `0 0 48px rgba(59,130,246,${ctaGlowOpacity * 0.55}), 0 16px 40px rgba(0,0,0,0.48)`,
        }}>
          {COPY.scene5.cta}
        </div>
      </div>

      {/* ── サブテキスト ── */}
      <div
        style={{
          position: "absolute",
          top: 1220,
          left: 72,
          right: 72,
          textAlign: "center" as const,
          fontFamily: FONT.family,
          opacity: subOpacity,
        }}
      >
        <div style={{
          color: COLORS.textSub,
          fontSize: 20,
          letterSpacing: 1.5,
        }}>
          {COPY.scene5.ctaSub}
        </div>
      </div>

      {/* ── ボトム区切り線 ── */}
      <div style={{
        position: "absolute",
        bottom: 320,
        left: 0,
        right: 0,
        opacity: footerOpacity * 0.5,
      }}>
        <AccentDivider opacity={0.9} />
      </div>

      {/* ── フッターテキスト ── */}
      <div style={{
        position: "absolute",
        bottom: 240,
        left: 72,
        right: 72,
        textAlign: "center" as const,
        fontFamily: FONT.family,
        opacity: footerOpacity * 0.6,
      }}>
        <div style={{
          color: COLORS.textDim,
          fontSize: 13,
          letterSpacing: 2.5,
          textTransform: "uppercase" as const,
        }}>
          SUPPLEMENT ORACLE | TRAINER SUPPORT TOOL by ORIVEX
        </div>
      </div>

    </AbsoluteFill>
  );
};
