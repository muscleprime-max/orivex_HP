import * as admin from "firebase-admin";
import OpenAI from "openai";
import { buildNutritionPrompt } from "./prompts";
import type { ClientInput, ReportOutput, GenerateReportResponse } from "./types";

const MODEL = "gpt-4o-mini";

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }
  return new OpenAI({ apiKey });
}

function validateInput(input: ClientInput): void {
  if (!input.clientName?.trim()) throw new Error("クライアント名は必須です。");
  if (!input.age || input.age < 10 || input.age > 100) throw new Error("年齢は10〜100の範囲で入力してください。");
  if (!input.height || input.height < 100 || input.height > 250) throw new Error("身長は100〜250cmの範囲で入力してください。");
  if (!input.weight || input.weight < 20 || input.weight > 300) throw new Error("体重は20〜300kgの範囲で入力してください。");
  if (!input.mealsPerDay || input.mealsPerDay < 1 || input.mealsPerDay > 8) throw new Error("食事回数は1〜8回の範囲で入力してください。");

  const validGoals = ["減量", "増量", "維持", "健康改善"];
  if (!validGoals.includes(input.goal)) throw new Error("目標の値が不正です。");

  const validActivity = ["低い", "普通", "高い"];
  if (!validActivity.includes(input.activityLevel)) throw new Error("活動レベルの値が不正です。");

  const validGenders = ["男性", "女性", "その他"];
  if (!validGenders.includes(input.gender)) throw new Error("性別の値が不正です。");

  const validPolicies = ["バランス型", "ハイカーボ型", "ローカーボ型", "継続重視型"];
  if (!validPolicies.includes(input.trainerPolicy)) throw new Error("指導方針の値が不正です。");
}

function parseReportOutput(raw: string): ReportOutput {
  // markdown コードブロックが含まれていた場合に除去
  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const parsed = JSON.parse(cleaned) as ReportOutput;

  // 最低限の構造チェック
  if (!parsed.summary || !parsed.calorie_policy || !parsed.pfc_balance) {
    throw new Error("AIの出力形式が不正です。");
  }
  if (!Array.isArray(parsed.meal_guidelines) || !Array.isArray(parsed.adherence_advice)) {
    throw new Error("AIの出力形式が不正です（配列）。");
  }
  if (!Array.isArray(parsed.sample_day_plan)) {
    throw new Error("AIの出力形式が不正です（食事例）。");
  }

  return parsed;
}

export async function generateNutritionReportHandler(
  userId: string,
  input: ClientInput
): Promise<GenerateReportResponse> {
  validateInput(input);

  const openai = getOpenAIClient();
  const prompt = buildNutritionPrompt(input);

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: "あなたは栄養士です。指示に従い、必ずJSONのみを返してください。説明文やmarkdownは不要です。",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 1500,
    response_format: { type: "json_object" },
  });

  const rawContent = completion.choices[0]?.message?.content ?? "";
  if (!rawContent) throw new Error("AIからの応答が空でした。");

  const output = parseReportOutput(rawContent);

  // Firestoreに保存
  const db = admin.firestore();
  const now = admin.firestore.Timestamp.now();

  const docRef = await db.collection("reports").add({
    userId,
    clientName: input.clientName,
    input,
    output,
    model: MODEL,
    createdAt: now,
  });

  return {
    reportId: docRef.id,
    output,
    model: MODEL,
    createdAt: now.toDate().toISOString(),
  };
}
