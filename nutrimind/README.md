# 🥗 NutriMind v1

パーソナルトレーナー向けの **食事指導方針・栄養提案レポート生成ツール**。

クライアント情報を入力するだけで、AI（OpenAI GPT）が個別の栄養提案レポートを自動生成します。

---

## 📁 ディレクトリ構成

```
nutrimind/
├── frontend/          # React + Vite アプリ
├── functions/         # Firebase Functions（OpenAI呼び出し）
├── firestore.rules    # Firestoreセキュリティルール
├── firestore.indexes.json
├── firebase.json
├── .firebaserc
└── README.md
```

---

## 🚀 セットアップ手順

### 前提条件

- Node.js 20以上
- Firebase CLI (`npm install -g firebase-tools`)
- Firebaseプロジェクト（Blaze プラン ※ Functions使用のため）
- OpenAI APIキー

---

### 1. Firebaseプロジェクトの準備

1. [Firebase Console](https://console.firebase.google.com/) でプロジェクト作成
2. Authentication を有効化 → 「メール/パスワード」プロバイダをオン
3. Firestore Database を作成（本番モード or テストモード）
4. Firebase Hosting を有効化（任意、デプロイ時）

---

### 2. .firebaserc を編集

```json
{
  "projects": {
    "default": "your-firebase-project-id"   // ← 実際のプロジェクトIDに変更
  }
}
```

---

### 3. フロントエンドのセットアップ

```bash
cd frontend
cp .env.example .env
```

`.env` に Firebase の設定値を記入：

```env
VITE_FIREBASE_API_KEY=xxxx
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxx
VITE_FIREBASE_APP_ID=xxxx
```

> Firebase Console → プロジェクト設定 → 「アプリ」セクション → Webアプリの設定から取得

```bash
npm install
npm run dev   # http://localhost:3000 で起動
```

---

### 4. Firebase Functions のセットアップ

```bash
cd functions
npm install
```

**OpenAI APIキーをFirebase Functionsの環境変数に設定：**

```bash
# Firebase CLI でシークレットを設定（推奨）
firebase functions:secrets:set OPENAI_API_KEY
# プロンプトが表示されたらAPIキーを入力

# または環境変数として設定（v2）
firebase functions:config:set openai.apikey="sk-xxxx"  # 旧方式（非推奨）
```

Functions v2（本プロジェクト）では `process.env.OPENAI_API_KEY` で読み込みます。
Secrets Manager を使うと安全に管理できます：

```bash
# firebase.json の functions 設定に以下を追加
"secretEnvironmentVariables": [
  { "key": "OPENAI_API_KEY" }
]
```

---

### 5. Firestore ルール・インデックスのデプロイ

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

---

## 🌐 デプロイ手順

### Functions のみデプロイ

```bash
cd functions
npm run build
firebase deploy --only functions
```

### フロントエンドのビルド & Hosting デプロイ

```bash
cd frontend
npm run build
firebase deploy --only hosting
```

### 全部まとめてデプロイ

```bash
# プロジェクトルートから
cd frontend && npm run build && cd ..
cd functions && npm run build && cd ..
firebase deploy
```

---

## 🔐 環境変数一覧

### フロントエンド（`frontend/.env`）

| 変数名 | 説明 |
|--------|------|
| `VITE_FIREBASE_API_KEY` | Firebase APIキー |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth ドメイン |
| `VITE_FIREBASE_PROJECT_ID` | Firebase プロジェクトID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage バケット |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |
| `VITE_USE_EMULATOR` | `true` でエミュレーター接続（開発用） |

### Firebase Functions（シークレット）

| 変数名 | 説明 |
|--------|------|
| `OPENAI_API_KEY` | OpenAI APIキー（`firebase functions:secrets:set` で設定） |

---

## 🧪 ローカルエミュレーター（開発用）

```bash
# Functions をビルド
cd functions && npm run build && cd ..

# エミュレーター起動
firebase emulators:start

# フロントの .env で以下を設定
VITE_USE_EMULATOR=true
```

エミュレーター UI: http://localhost:4000

---

## 🔒 Firestoreセキュリティルール

- `reports` コレクション: **自分のレポートのみ読み取り可能**、書き込みは Admin SDK（Functions）のみ
- フロントエンドから直接 Firestore に書き込む処理はなし

---

## 📊 Firestoreデータ構造

```
reports/{reportId}
  - userId: string
  - clientName: string
  - input: {
      age, gender, height, weight, goal,
      activityLevel, mealsPerDay, allergies,
      trainerPolicy, notes
    }
  - output: {
      summary, calorie_policy, pfc_balance,
      meal_guidelines, adherence_advice,
      sample_day_plan, coach_comment
    }
  - model: string
  - createdAt: Timestamp
```

---

## 🔮 今後の拡張ポイント（v2以降）

| 機能 | 実装方針 |
|------|---------|
| **PDF出力** | `jsPDF` or `puppeteer` でレポートをPDF化 |
| **LINE向け文面生成** | Functions に `/generateLineMessage` を追加 |
| **使用量制限** | Firestore に `usageCount` を持ち、Functions側でチェック |
| **サブスクリプション** | Stripe + Firebase Extensions |
| **クライアント管理** | `clients` コレクション追加 |
| **テンプレート保存** | 指導方針のテンプレートを保存・再利用 |
| **多言語対応** | i18next 導入 |

---

## ⚠️ 注意事項

- OpenAI APIキーは **絶対にフロントエンドに書かないこと**
- `frontend/.env` は `.gitignore` に追加すること
- Firebaseプロジェクトは **Blaze（従量課金）プラン** が必要（Functions使用のため）
