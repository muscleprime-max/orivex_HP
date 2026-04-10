import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, COPY, FONT, SCENES } from "../constants";
import { sceneOpacity, springSlideX } from "../utils/animations";

// ============================================================
//  Scene 4: BenefitScene (13–19秒 / 390–570f → ローカル 0–180f)
//  順番表示＋アクティブグロー:
//
//  f8-26:   B1 スライドイン
//  f26-70:  B1 アクティブホールド (1.47s) ← しっかり読める
//  f70-88:  B2 スライドイン (B1は薄く)
//  f88-130: B2 アクティブホールド (1.4s)
//  f130-148: B3 スライドイン (B2は薄く)
//  f148-168: B3 アクティブホールド (0.67s) + 全表示
//  f168-180: フェードアウト
// ============================================================

const DURATION = SCENES.benefits.durationInFrames; // 180f
const CLAMP = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ── ベネフィットアイコン ──
const IconSpeed: React.FC = () => (
  <svg width="30" height="30" viewBox="0 0 26 26" fill="none">
    <circle cx="13" cy="13" r="10" stroke={COLORS.blueLight} strokeWidth="2" />
    <path d="M13 8V13L16.5 16.5" stroke={COLORS.blueLight} strokeWidth="2.2" strokeLinecap="round" />
    <path d="M7.5 4L10 6.5" stroke={COLORS.blue} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M18.5 4L16 6.5" stroke={COLORS.blue} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconDoc: React.FC = () => (
  <svg width="30" height="30" viewBox="0 0 26 26" fill="none">
    <rect x="4" y="2" width="13" height="19" rx="2" stroke={COLORS.blueLight} strokeWidth="2" />
    <path d="M17 2L22 7V22H9" stroke={COLORS.blue} strokeWidth="2" strokeLinejoin="round" />
    <path d="M8 10H15" stroke={COLORS.blueLight} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 13H15" stroke={COLORS.blueLight} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 16H12" stroke={COLORS.blue} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconTrend: React.FC = () => (
  <svg width="30" height="30" viewBox="0 0 26 26" fill="none">
    <path d="M3 19L10 12L14 16L23 7" stroke={COLORS.blueLight} strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 7H23V12" stroke={COLORS.blue} strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── ベネフィット行コンポーネント ──
interface BenefitRowProps {
  number: string;
  headline: string;
  body: string;
  icon: React.ReactNode;
  opacity: number;
  translateX: number;
  glowIntensity: number; // 0-1: アクティブグロー強度
}

const BenefitRow: React.FC<BenefitRowProps> = ({
  number, headline, body, icon, opacity, translateX, glowIntensity
}) => {
  const isActive = glowIntensity > 0.15;
  const borderLeftWidth = 3 + glowIntensity * 4; // 3px → 7px
  const borderColor = `rgba(59,130,246,${0.28 + glowIntensity * 0.55})`;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        background: isActive
          ? `rgba(12, 22, 52, 0.99)`
          : COLORS.bgCard,
        border: `1px solid ${borderColor}`,
        borderLeft: `${borderLeftWidth}px solid ${borderColor}`,
        borderRadius: 20,
        padding: "30px 34px",
        opacity,
        transform: `translateX(${translateX}px)`,
        boxShadow: isActive
          ? `0 0 ${36 * glowIntensity}px rgba(59,130,246,${0.18 * glowIntensity}), 0 14px 40px rgba(0,0,0,0.42)`
          : "0 8px 24px rgba(0,0,0,0.28)",
      }}
    >
      {/* 番号 + アイコン */}
      <div style={{ flexShrink: 0, textAlign: "center" as const, width: 62 }}>
        <div style={{
          color: COLORS.blue,
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: 2.5,
          marginBottom: 10,
          opacity: isActive ? 0.85 : 0.42,
        }}>
          {number}
        </div>
        <div style={{
          width: 58,
          height: 58,
          borderRadius: "50%",
          background: isActive
            ? `rgba(59,130,246,${0.22 + glowIntensity * 0.14})`
            : "rgba(59,130,246,0.1)",
          border: `1px solid rgba(59,130,246,${0.32 + glowIntensity * 0.32})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isActive ? `0 0 18px rgba(59,130,246,${0.25 * glowIntensity})` : "none",
        }}>
          {icon}
        </div>
      </div>

      {/* テキスト */}
      <div style={{ flex: 1 }}>
        <div style={{
          color: isActive ? COLORS.textPrimary : COLORS.textSub,
          fontSize: 36,
          fontWeight: 900,
          letterSpacing: -0.5,
          lineHeight: 1.18,
          marginBottom: 10,
        }}>
          {headline}
        </div>
        <div style={{
          color: isActive ? COLORS.textSub : COLORS.textDim,
          fontSize: 19,
          lineHeight: 1.5,
          letterSpacing: 0.2,
        }}>
          {body}
        </div>
      </div>
    </div>
  );
};

export const BenefitScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = sceneOpacity(frame, DURATION, 7, 12);

  // ── セクションラベル ──
  const labelOpacity = interpolate(frame, [6, 18], [0, 1], CLAMP);

  // ── Benefit 1 ──
  const b1SlideX = springSlideX(frame, 8, fps, -70, { damping: 24, stiffness: 82, mass: 1 });
  const b1Opacity = interpolate(frame, [8, 24, 64, 80], [0, 1, 1, 0.38], CLAMP);
  const b1Glow   = interpolate(frame, [8, 26, 64, 80], [0, 1, 1, 0], CLAMP);

  // ── Benefit 2 ──
  const b2SlideX = springSlideX(frame, 70, fps, -70, { damping: 24, stiffness: 82, mass: 1 });
  const b2Opacity = interpolate(frame, [70, 86, 124, 140], [0, 1, 1, 0.38], CLAMP);
  const b2Glow   = interpolate(frame, [70, 88, 124, 140], [0, 1, 1, 0], CLAMP);

  // ── Benefit 3 ──
  const b3SlideX = springSlideX(frame, 130, fps, -70, { damping: 24, stiffness: 82, mass: 1 });
  const b3Opacity = interpolate(frame, [130, 148, 168], [0, 1, 1], CLAMP);
  const b3Glow   = interpolate(frame, [130, 148, 168, 180], [0, 1, 1, 0], CLAMP);

  // ── 補助インジケーター ──
  const auxOpacity = interpolate(frame, [152, 165], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ opacity }}>

      {/* ── セクションラベル ── */}
      <div style={{
        position: "absolute",
        top: 188,
        left: 72,
        fontFamily: FONT.family,
        opacity: labelOpacity,
      }}>
        <div style={{
          color: COLORS.blue,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: "uppercase" as const,
        }}>
          WHY SUPPLEMENT ORACLE
        </div>
      </div>

      {/* ── Benefit 01 ── */}
      <div style={{
        position: "absolute",
        top: 248,
        left: 52,
        right: 52,
        fontFamily: FONT.family,
      }}>
        <BenefitRow
          number={COPY.scene4[0].number}
          headline={COPY.scene4[0].headline}
          body={COPY.scene4[0].body}
          icon={<IconSpeed />}
          opacity={b1Opacity}
          translateX={b1SlideX}
          glowIntensity={b1Glow}
        />
      </div>

      {/* ── Benefit 02 ── */}
      <div style={{
        position: "absolute",
        top: 640,
        left: 52,
        right: 52,
        fontFamily: FONT.family,
      }}>
        <BenefitRow
          number={COPY.scene4[1].number}
          headline={COPY.scene4[1].headline}
          body={COPY.scene4[1].body}
          icon={<IconDoc />}
          opacity={b2Opacity}
          translateX={b2SlideX}
          glowIntensity={b2Glow}
        />
      </div>

      {/* ── Benefit 03 ── */}
      <div style={{
        position: "absolute",
        top: 1032,
        left: 52,
        right: 52,
        fontFamily: FONT.family,
      }}>
        <BenefitRow
          number={COPY.scene4[2].number}
          headline={COPY.scene4[2].headline}
          body={COPY.scene4[2].body}
          icon={<IconTrend />}
          opacity={b3Opacity}
          translateX={b3SlideX}
          glowIntensity={b3Glow}
        />
      </div>

      {/* ── 補助インジケーター ── */}
      <div style={{
        position: "absolute",
        top: 1424,
        left: 52,
        right: 52,
        opacity: auxOpacity,
        fontFamily: FONT.family,
      }}>
        <div style={{
          background: "rgba(10, 18, 38, 0.88)",
          border: `1px solid ${COLORS.borderBlue}`,
          borderRadius: 18,
          padding: "20px 28px",
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
            background: "rgba(16,185,129,0.15)",
            border: "1px solid rgba(16,185,129,0.38)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
              <path d="M3 9L7.5 13.5L15 4.5" stroke={COLORS.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div style={{ color: COLORS.textPrimary, fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
              提案・禁忌チェック — 自動スクリーニング完了
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["BCAA", "グルタミン", "ZMA"].map((n) => (
                <div key={n} style={{
                  background: "rgba(59,130,246,0.12)",
                  border: `1px solid ${COLORS.borderBlue}`,
                  color: COLORS.blueLight,
                  borderRadius: 20, padding: "4px 14px",
                  fontSize: 13, fontWeight: 600,
                }}>{n}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </AbsoluteFill>
  );
};
