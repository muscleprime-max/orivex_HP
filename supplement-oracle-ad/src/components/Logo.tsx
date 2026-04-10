import { Img, staticFile } from "remotion";
import { ASSETS, USE_LOGO_IMAGE, COLORS } from "../constants";

// ============================================================
//  Logo コンポーネント — Supplement Oracle ブランドロゴ
//  ・USE_LOGO_IMAGE = true  → public/assets/logo.png を使用
//  ・USE_LOGO_IMAGE = false → SVGブランドマークを表示
//    ブランド: "Supplement Oracle" by ORIVEX
//    ロゴ形状: フラスコ/試験管アイコン + グラデーションテキスト
// ============================================================

interface LogoProps {
  size?: number;
  style?: React.CSSProperties;
  showText?: boolean; // テキスト部分も表示するか
}

/** フラスコアイコン SVG */
const FlaskIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 80"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block" }}
  >
    {/* 円形背景 */}
    <circle cx="40" cy="40" r="38" fill="rgba(15,25,55,0.95)" />
    <circle cx="40" cy="40" r="38" fill="none" stroke="rgba(59,130,246,0.6)" strokeWidth="1.5" />
    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(59,130,246,0.25)" strokeWidth="1" />

    {/* フラスコ本体 */}
    {/* フラスコの首部分 */}
    <rect x="30" y="12" width="20" height="22" rx="3" fill="none"
      stroke="url(#flaskGrad)" strokeWidth="2.5" />
    {/* フラスコ底部（三角形→丸底） */}
    <path
      d="M 22,34 L 30,34 L 30,56 Q 30,66 40,66 Q 50,66 50,56 L 50,34 L 58,34"
      fill="none"
      stroke="url(#flaskGrad)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* フラスコ内部の液体 */}
    <path
      d="M 31,46 Q 31,64 40,64 Q 49,64 49,46 Z"
      fill="url(#liquidGrad)"
      opacity="0.8"
    />
    {/* 泡 */}
    <circle cx="36" cy="54" r="2.5" fill="rgba(96,165,250,0.6)" />
    <circle cx="43" cy="58" r="1.8" fill="rgba(6,182,212,0.6)" />
    {/* 横線（フラスコの首の区切り） */}
    <line x1="28" y1="34" x2="52" y2="34" stroke="url(#flaskGrad)" strokeWidth="2" />

    {/* グラデーション定義 */}
    <defs>
      <linearGradient id="flaskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
      <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
      </linearGradient>
    </defs>
  </svg>
);

export const Logo: React.FC<LogoProps> = ({ size = 100, style }) => {
  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ...style,
  };

  if (!USE_LOGO_IMAGE) {
    return (
      <div style={containerStyle}>
        <FlaskIcon size={size} />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <Img
        src={staticFile(ASSETS.logo)}
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    </div>
  );
};
