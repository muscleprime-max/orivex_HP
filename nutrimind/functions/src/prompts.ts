import type { ClientInput } from "./types";

export function buildNutritionPrompt(input: ClientInput): string {
  const {
    clientName,
    age,
    gender,
    height,
    weight,
    goal,
    activityLevel,
    mealsPerDay,
    allergies,
    trainerPolicy,
    notes,
  } = input;

  // BMI計算（参考情報としてプロンプトに含める）
  const bmi = (weight / ((height / 100) ** 2)).toFixed(1);

  const policyGuide: Record<string, string> = {
    バランス型: "PFCをバランスよく摂取することを重視し、特定の栄養素に偏らない食事設計にしてください。",
    ハイカーボ型: "炭水化物を多めに設定し、エネルギー補給を炭水化物で行う食事設計にしてください。脂質は控えめに。",
    ローカーボ型: "炭水化物を控えめにし、タンパク質と良質な脂質を中心にした食事設計にしてください。",
    継続重視型: "無理なく長期的に続けられることを最優先に、実現可能な食事設計にしてください。制限を最小限に。",
  };

  const allergyNote = allergies
    ? `⚠️ アレルギー・食事制限（必ず厳守してください）: ${allergies}`
    : "特記なし";

  const notesNote = notes
    ? `📝 追加メモ（優先的に反映してください）: ${notes}`
    : "特記なし";

  return `
あなたは経験豊富な栄養士です。以下のクライアント情報をもとに、パーソナルトレーナーがクライアントへ説明するための栄養提案レポートを作成してください。

【クライアント情報】
- 氏名: ${clientName}
- 年齢: ${age}歳
- 性別: ${gender}
- 身長: ${height}cm / 体重: ${weight}kg（BMI: ${bmi}）
- 目標: ${goal}
- 活動レベル: ${activityLevel}
- 食事回数: 1日${mealsPerDay}回
- アレルギー・制限: ${allergyNote}
- 指導方針: ${trainerPolicy}
- 追加メモ: ${notesNote}

【指導方針の詳細】
${policyGuide[trainerPolicy] ?? "バランスよく提案してください。"}

【出力ルール】
- 必ずJSONのみを返すこと（前後の説明文・markdownコードブロック不要）
- 日本語で出力すること
- トレーナーがそのままクライアントに説明できる、自然で実用的な表現にすること
- 医療行為の断定・診断はしないこと（「〜の可能性があります」「〜を意識しましょう」等の表現を使うこと）
- 極端な食事制限は勧めないこと
- 内容は簡潔にまとめること（各項目は長くなりすぎない）
- アレルギー・制限がある場合は必ずその食品を除外した提案にすること

以下のJSON形式で返してください:
{
  "summary": "このクライアントへの全体的な栄養方針（2〜3文）",
  "calorie_policy": "推定カロリー目標と根拠（1〜2文）",
  "pfc_balance": {
    "protein": "タンパク質の推奨量・割合",
    "fat": "脂質の推奨量・割合",
    "carb": "炭水化物の推奨量・割合"
  },
  "meal_guidelines": ["食事方針1", "食事方針2", "食事方針3"],
  "adherence_advice": ["継続アドバイス1", "継続アドバイス2"],
  "sample_day_plan": [
    {"meal": "朝食", "content": "具体的な食事内容"},
    {"meal": "昼食", "content": "具体的な食事内容"},
    {"meal": "夕食", "content": "具体的な食事内容"}
  ],
  "coach_comment": "トレーナーからクライアントへの一言コメント（1文）"
}
`.trim();
}
