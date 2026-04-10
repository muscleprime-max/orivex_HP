// ========== リクエスト ==========
export type Goal = "減量" | "増量" | "維持" | "健康改善";
export type ActivityLevel = "低い" | "普通" | "高い";
export type Gender = "男性" | "女性" | "その他";
export type TrainerPolicy = "バランス型" | "ハイカーボ型" | "ローカーボ型" | "継続重視型";

export interface ClientInput {
  clientName: string;
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  goal: Goal;
  activityLevel: ActivityLevel;
  mealsPerDay: number;
  allergies: string;
  trainerPolicy: TrainerPolicy;
  notes: string;
}

// ========== AI出力 ==========
export interface MealItem {
  meal: string;
  content: string;
}

export interface PFCBalance {
  protein: string;
  fat: string;
  carb: string;
}

export interface ReportOutput {
  summary: string;
  calorie_policy: string;
  pfc_balance: PFCBalance;
  meal_guidelines: string[];
  adherence_advice: string[];
  sample_day_plan: MealItem[];
  coach_comment: string;
}

// ========== Functionsレスポンス ==========
export interface GenerateReportResponse {
  reportId: string;
  output: ReportOutput;
  model: string;
  createdAt: string;
}
