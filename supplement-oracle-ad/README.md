# SUPPLEMENT-ORACLE- PR動画

Instagram / TikTok / リール広告向け縦型 PR 動画
**Remotion** + **TypeScript** 実装

---

## 動画スペック

| 項目 | 値 |
|------|-----|
| サイズ | 1080 × 1920px (縦型 9:16) |
| FPS | 30fps |
| 尺 | 15秒 (450フレーム) |
| 出力形式 | MP4 (H.264) |

---

## シーン構成

| シーン | 時間 | フレーム | 内容 | ファイル |
|--------|------|----------|------|----------|
| Scene 1: Hook | 0〜2s | 0〜60f | フックテキスト + ツール UI | `src/scenes/OpeningHook.tsx` |
| Scene 2: Problem | 2〜5s | 60〜150f | 課題提示 (チャット・タスク) | `src/scenes/ProblemScene.tsx` |
| Scene 3: Reveal | 5〜8s | 150〜240f | プロダクト紹介 + フロー | `src/scenes/ProductReveal.tsx` |
| Scene 4: Benefits | 8〜11.5s | 240〜345f | 3つのベネフィット | `src/scenes/BenefitScene.tsx` |
| Scene 5: CTA | 11.5〜15s | 345〜450f | メッセージ + CTA | `src/scenes/ClosingCTA.tsx` |

---

## セットアップ

```bash
# 1. プロジェクトフォルダへ移動
cd supplement-oracle-ad

# 2. 依存パッケージをインストール
npm install

# 3. 素材を配置 (後述)

# 4. Remotion Studio でプレビュー
npm start

# 5. MP4 をレンダリング
npm run render
```

出力ファイル: `out/supplement-oracle-ad.mp4`

---

## 素材の配置

`public/assets/` フォルダに以下を配置してください:

| ファイル名 | 用途 | 使用シーン |
|-----------|------|-----------|
| `logo.png` | ロゴ画像 (PNG透過推奨) | Scene3, Scene5 |
| `lp-screenshot.png` | LP スクリーンショット (オプション) | — |
| `tool-screenshot.png` | ツール画面 (オプション) | — |

### ロゴ画像の有効化

`src/constants.ts` を開き:

```ts
export const USE_LOGO_IMAGE = true;  // false → SVG プレースホルダー使用
```

---

## カスタマイズ

すべての文言・色・タイミングは **`src/constants.ts`** で一括管理:

```ts
// テロップ文言
export const COPY = { ... }

// カラーパレット
export const COLORS = { ... }

// シーンのフレーム範囲
export const SCENES = { ... }
```

### 文言だけ変えたい場合

`src/constants.ts` の `COPY` オブジェクトを編集してください。
意味を変えない範囲での改行・サイズ調整は各 `.tsx` ファイルのスタイルで行えます。

### 色を変えたい場合

`src/constants.ts` の `COLORS` オブジェクトを編集してください。

---

## ファイル構成

```
supplement-oracle-ad/
├── package.json
├── tsconfig.json
├── remotion.config.ts
├── public/
│   └── assets/           ← 素材をここに配置
│       ├── logo.png
│       ├── lp-screenshot.png
│       └── tool-screenshot.png
├── src/
│   ├── index.ts           エントリーポイント (registerRoot)
│   ├── Root.tsx           コンポジション登録・フォント読み込み
│   ├── MainAdVideo.tsx    メインコンポジション (全シーン統括)
│   ├── constants.ts       ★ 文言・色・タイミング定数 (編集ここだけでOK)
│   ├── components/
│   │   ├── Background.tsx 全シーン共通の背景レイヤー
│   │   ├── Logo.tsx       ロゴ (画像 or SVGプレースホルダー)
│   │   └── MockUI.tsx     ツール UI モックコンポーネント群
│   ├── scenes/
│   │   ├── OpeningHook.tsx  Scene 1
│   │   ├── ProblemScene.tsx Scene 2
│   │   ├── ProductReveal.tsx Scene 3
│   │   ├── BenefitScene.tsx Scene 4
│   │   └── ClosingCTA.tsx   Scene 5
│   └── utils/
│       └── animations.ts  アニメーションユーティリティ関数
└── out/
    └── supplement-oracle-ad.mp4  ← レンダリング出力先
```

---

## 素材をリアル画像に差し替える方法

### ツール画面を実画像に差し替え (Scene 1)

`src/scenes/OpeningHook.tsx` 内のモック UI ブロックを以下に置換:

```tsx
import { Img, staticFile } from 'remotion';

// モックカード全体を以下に差し替え
<Img
  src={staticFile('assets/tool-screenshot.png')}
  style={{ width: '100%', borderRadius: 20, objectFit: 'cover' }}
/>
```

---

## モーションデザイン方針

- `spring()` による自然なスライドイン・スケール
- `interpolate()` による線形フェード
- シーン間はダーク背景を通じた自然なフェードトランジション
- bounce / glitch / 激しい点滅は一切不使用
- 文字可読性を最優先

---

## 法務・表現上の注意 (実装済み)

- 「必ず売上が上がる」等の断定表現は使用していません
- 医療行為・診断・治療を想起させる表現は使用していません
- 「提案支援ツール」としての表現に統一しています

---

## トラブルシューティング

**日本語フォントが表示されない**
→ `npm install` 後、Remotion Studio を再起動してください。
→ `@remotion/google-fonts/NotoSansJP` が正常にロードされると Noto Sans JP で表示されます。

**ロゴが表示されない**
→ `public/assets/logo.png` を確認してください。
→ または `src/constants.ts` で `USE_LOGO_IMAGE = false` に設定すると SVG プレースホルダーが表示されます。

**レンダリングが遅い**
→ `npm run render` は Chrome ヘッドレスで動作するため、初回は時間がかかります。
→ 並列数を指定する場合: `remotion render ... --concurrency=4`
