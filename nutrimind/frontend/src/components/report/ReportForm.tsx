import React, { useState } from "react";
import type { ClientInput, Goal, ActivityLevel, Gender, TrainerPolicy } from "../../types";
import ErrorMessage from "../ui/ErrorMessage";

interface Props {
  onSubmit: (input: ClientInput) => Promise<void>;
  loading: boolean;
}

const defaultInput: ClientInput = {
  clientName: "",
  age: 30,
  gender: "男性",
  height: 170,
  weight: 65,
  goal: "減量",
  activityLevel: "普通",
  mealsPerDay: 3,
  allergies: "",
  trainerPolicy: "バランス型",
  notes: "",
};

const ReportForm: React.FC<Props> = ({ onSubmit, loading }) => {
  const [input, setInput] = useState<ClientInput>(defaultInput);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ClientInput>(key: K, value: ClientInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!input.clientName.trim()) {
      setError("クライアント名を入力してください。");
      return;
    }
    if (input.age < 10 || input.age > 100) {
      setError("年齢は10〜100の範囲で入力してください。");
      return;
    }
    if (input.height < 100 || input.height > 250) {
      setError("身長は100〜250cmの範囲で入力してください。");
      return;
    }
    if (input.weight < 20 || input.weight > 300) {
      setError("体重は20〜300kgの範囲で入力してください。");
      return;
    }
    if (input.mealsPerDay < 1 || input.mealsPerDay > 8) {
      setError("食事回数は1〜8回の範囲で入力してください。");
      return;
    }

    await onSubmit(input);
  };

  return (
    <form onSubmit={handleSubmit} className="report-form">
      {error && <ErrorMessage message={error} />}

      <section className="form-section">
        <h3 className="section-title">クライアント基本情報</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="clientName">クライアント名 <span className="required">*</span></label>
            <input
              id="clientName"
              type="text"
              value={input.clientName}
              onChange={(e) => update("clientName", e.target.value)}
              placeholder="山田 太郎"
              className="input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="age">年齢 <span className="required">*</span></label>
            <input
              id="age"
              type="number"
              value={input.age}
              onChange={(e) => update("age", Number(e.target.value))}
              min={10}
              max={100}
              className="input"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="gender">性別</label>
            <select
              id="gender"
              value={input.gender}
              onChange={(e) => update("gender", e.target.value as Gender)}
              className="select"
            >
              <option value="男性">男性</option>
              <option value="女性">女性</option>
              <option value="その他">その他</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="mealsPerDay">食事回数（1日）</label>
            <input
              id="mealsPerDay"
              type="number"
              value={input.mealsPerDay}
              onChange={(e) => update("mealsPerDay", Number(e.target.value))}
              min={1}
              max={8}
              className="input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="height">身長 (cm) <span className="required">*</span></label>
            <input
              id="height"
              type="number"
              value={input.height}
              onChange={(e) => update("height", Number(e.target.value))}
              min={100}
              max={250}
              step={0.1}
              className="input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="weight">体重 (kg) <span className="required">*</span></label>
            <input
              id="weight"
              type="number"
              value={input.weight}
              onChange={(e) => update("weight", Number(e.target.value))}
              min={20}
              max={300}
              step={0.1}
              className="input"
              required
            />
          </div>
        </div>
      </section>

      <section className="form-section">
        <h3 className="section-title">目標・活動量</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="goal">目標</label>
            <select
              id="goal"
              value={input.goal}
              onChange={(e) => update("goal", e.target.value as Goal)}
              className="select"
            >
              <option value="減量">減量</option>
              <option value="増量">増量</option>
              <option value="維持">維持</option>
              <option value="健康改善">健康改善</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="activityLevel">活動レベル</label>
            <select
              id="activityLevel"
              value={input.activityLevel}
              onChange={(e) => update("activityLevel", e.target.value as ActivityLevel)}
              className="select"
            >
              <option value="低い">低い（デスクワーク中心）</option>
              <option value="普通">普通（週2〜3回運動）</option>
              <option value="高い">高い（週4回以上・肉体労働）</option>
            </select>
          </div>
        </div>
      </section>

      <section className="form-section">
        <h3 className="section-title">指導方針・制限事項</h3>

        <div className="form-group">
          <label htmlFor="trainerPolicy">トレーナーの指導方針</label>
          <select
            id="trainerPolicy"
            value={input.trainerPolicy}
            onChange={(e) => update("trainerPolicy", e.target.value as TrainerPolicy)}
            className="select"
          >
            <option value="バランス型">バランス型（PFCをバランスよく）</option>
            <option value="ハイカーボ型">ハイカーボ型（炭水化物多め）</option>
            <option value="ローカーボ型">ローカーボ型（炭水化物控えめ）</option>
            <option value="継続重視型">継続重視型（無理なく長く続ける）</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="allergies">アレルギー / 食事制限</label>
          <input
            id="allergies"
            type="text"
            value={input.allergies}
            onChange={(e) => update("allergies", e.target.value)}
            placeholder="例: 乳製品アレルギー、グルテンフリー、ベジタリアン"
            className="input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">追加メモ</label>
          <textarea
            id="notes"
            value={input.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="特記事項があれば記入してください（例: 夜勤あり、朝食が取れない、外食が多い）"
            className="textarea"
            rows={3}
          />
        </div>
      </section>

      <div className="form-submit">
        <button type="submit" disabled={loading} className="btn btn-primary btn-large">
          {loading ? "AIレポートを生成中..." : "✨ レポートを生成する"}
        </button>
        {loading && (
          <p className="generating-note">
            AIが栄養プランを作成しています。少々お待ちください（10〜30秒程度）
          </p>
        )}
      </div>
    </form>
  );
};

export default ReportForm;
