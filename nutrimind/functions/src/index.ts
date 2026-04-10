import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { generateNutritionReportHandler } from "./generateReport";
import type { ClientInput } from "./types";

// Firebase Admin 初期化
admin.initializeApp();

// generateNutritionReport — callable function
// リージョン: asia-northeast1（東京）
export const generateNutritionReport = onCall(
  {
    region: "asia-northeast1",
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  async (request) => {
    // 認証チェック
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "ログインが必要です。");
    }

    const userId = request.auth.uid;
    const input = request.data as ClientInput;

    if (!input || typeof input !== "object") {
      throw new HttpsError("invalid-argument", "リクエストデータが不正です。");
    }

    try {
      const result = await generateNutritionReportHandler(userId, input);
      return result;
    } catch (error: unknown) {
      console.error("generateNutritionReport error:", error);

      if (error instanceof Error) {
        // バリデーションエラーはクライアントへ伝える
        if (
          error.message.includes("必須") ||
          error.message.includes("範囲") ||
          error.message.includes("不正")
        ) {
          throw new HttpsError("invalid-argument", error.message);
        }
      }

      throw new HttpsError("internal", "レポートの生成中にエラーが発生しました。");
    }
  }
);
