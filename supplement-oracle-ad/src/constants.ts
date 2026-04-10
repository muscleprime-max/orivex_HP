// ============================================================
//  SUPPLEMENT-ORACLE- PR動画 — 設定定数
//  ここを編集することで文言・色・タイミングを一括変更できます
// ============================================================

// --- 動画スペック ---
export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 720, // 24秒 (読みやすい尺に延長)
} as const;

// --- シーン別フレーム範囲 (30fps) ---
export const SCENES = {
  hook:     { from: 0,   durationInFrames: 90  }, // 0–3s
  problem:  { from: 90,  durationInFrames: 150 }, // 3–8s
  reveal:   { from: 240, durationInFrames: 150 }, // 8–13s
  benefits: { from: 390, durationInFrames: 180 }, // 13–19s
  cta:      { from: 570, durationInFrames: 150 }, // 19–24s
} as const;

// --- カラーパレット (LP・ツールのデザインに準拠) ---
export const COLORS = {
  // Backgrounds
  bg:           "#080d1a",
  bgCard:       "rgba(10, 18, 38, 0.97)",
  bgCardLight:  "rgba(17, 28, 54, 0.95)",
  bgInput:      "rgba(13, 22, 44, 0.9)",

  // Borders
  borderBlue:   "rgba(59, 130, 246, 0.25)",
  borderBlueMid:"rgba(59, 130, 246, 0.45)",
  borderCyan:   "rgba(6, 182, 212, 0.3)",

  // Accents
  blue:         "#3b82f6",
  blueLight:    "#60a5fa",
  blueDark:     "#1d4ed8",
  cyan:         "#06b6d4",
  cyanLight:    "#67e8f9",

  // Glows
  blueGlow:     "rgba(59, 130, 246, 0.35)",
  cyanGlow:     "rgba(6, 182, 212, 0.25)",

  // Text
  textPrimary:  "#f1f5f9",
  textSub:      "#94a3b8",
  textDim:      "#475569",
  white:        "#ffffff",

  // Functional
  success:      "#10b981",
  successBg:    "rgba(10, 42, 26, 0.9)",
  successBorder:"#059669",
  warning:      "#f59e0b",
  warningBg:    "rgba(42, 26, 10, 0.9)",
  warningBorder:"#f97316",
} as const;

// --- フォント ---
export const FONT = {
  family: '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", Meiryo, sans-serif',
  montserrat: '"Montserrat", "Noto Sans JP", sans-serif',
} as const;

// --- テロップ文言 ---
export const COPY = {
  scene1: {
    line1: "サプリ提案、",
    line2: "まだ手動でやってる？",
  },
  scene2: {
    line1: "長文対応・提案整理・",
    line2: "説明の手間を省く。",
  },
  scene3: {
    productName: "Supplement Oracle",
    byBrand:     "by ORIVEX",
    subtitle:    "トレーナー向け サプリ提案支援ツール",
    step1: "情報入力",
    step2: "AI 分析",
    step3: "提案レポート",
  },
  scene4: [
    {
      number: "01",
      headline: "提案を速く。",
      body:     "入力から提案まで、最短で。",
    },
    {
      number: "02",
      headline: "説明をわかりやすく。",
      body:     "根拠と注意点も自動で整理。",
    },
    {
      number: "03",
      headline: "機会損失を減らす。",
      body:     "提案漏れと対応遅れをなくす。",
    },
  ],
  scene5: {
    main1:   "現場に、余裕と",
    main2:   "収益機会を。",
    cta:     "詳しくはLPへ",
    ctaSub:  "プロフィールのリンクから",
  },
} as const;

// --- アセットパス ---
export const ASSETS = {
  logo:          "assets/logo.png",
  lpScreenshot:  "assets/lp-screenshot.png",
  toolScreenshot:"assets/tool-screenshot.png",
} as const;

// --- ロゴ切り替え ---
// logo.png を public/assets/ に配置したら true に変更
export const USE_LOGO_IMAGE = false;
