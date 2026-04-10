import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReports } from "../hooks/useReports";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import type { Report } from "../types";

const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchReport } = useReports();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const data = await fetchReport(id);
      if (!data) {
        setError("レポートが見つかりませんでした。");
      } else {
        setReport(data);
      }
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);

  if (loading) return <LoadingSpinner message="レポートを読み込み中..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!report) return null;

  const { output, input } = report;

  return (
    <div className="page">
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          ← 戻る
        </button>
        <div>
          <p className="report-meta-date">作成日: {formatDate(report.createdAt)}</p>
          <p className="report-meta-model">使用モデル: {report.model}</p>
        </div>
      </div>

      <div className="report-detail">
        {/* クライアント情報 */}
        <div className="detail-card client-info-card">
          <h2 className="detail-client-name">{report.clientName} さんの栄養提案レポート</h2>
          <div className="client-tags">
            <span className="tag">{input.age}歳 / {input.gender}</span>
            <span className="tag">{input.height}cm / {input.weight}kg</span>
            <span className="tag tag-goal">{input.goal}</span>
            <span className="tag">活動量: {input.activityLevel}</span>
            <span className="tag tag-policy">{input.trainerPolicy}</span>
          </div>
          {input.allergies && (
            <p className="allergies-note">⚠️ アレルギー・制限: {input.allergies}</p>
          )}
        </div>

        {/* サマリー */}
        <div className="detail-card">
          <h3 className="card-title">📋 サマリー</h3>
          <p className="card-text">{output.summary}</p>
        </div>

        {/* カロリー方針 & PFC */}
        <div className="detail-card-row">
          <div className="detail-card">
            <h3 className="card-title">🔥 推定カロリー方針</h3>
            <p className="card-text">{output.calorie_policy}</p>
          </div>
          <div className="detail-card">
            <h3 className="card-title">⚖️ 推奨PFCバランス</h3>
            <div className="pfc-grid">
              <div className="pfc-item pfc-protein">
                <span className="pfc-label">タンパク質 (P)</span>
                <span className="pfc-value">{output.pfc_balance.protein}</span>
              </div>
              <div className="pfc-item pfc-fat">
                <span className="pfc-label">脂質 (F)</span>
                <span className="pfc-value">{output.pfc_balance.fat}</span>
              </div>
              <div className="pfc-item pfc-carb">
                <span className="pfc-label">炭水化物 (C)</span>
                <span className="pfc-value">{output.pfc_balance.carb}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 食事方針 */}
        <div className="detail-card">
          <h3 className="card-title">🍽️ 食事方針</h3>
          <ul className="guideline-list">
            {output.meal_guidelines.map((item, i) => (
              <li key={i} className="guideline-item">✅ {item}</li>
            ))}
          </ul>
        </div>

        {/* 継続アドバイス */}
        <div className="detail-card">
          <h3 className="card-title">💪 継続のためのアドバイス</h3>
          <ul className="guideline-list">
            {output.adherence_advice.map((item, i) => (
              <li key={i} className="guideline-item">💡 {item}</li>
            ))}
          </ul>
        </div>

        {/* 1日の食事例 */}
        <div className="detail-card">
          <h3 className="card-title">📅 1日の食事例</h3>
          <div className="meal-plan-grid">
            {output.sample_day_plan.map((meal, i) => (
              <div key={i} className="meal-item">
                <span className="meal-label">{meal.meal}</span>
                <p className="meal-content">{meal.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* トレーナーコメント */}
        <div className="detail-card coach-comment-card">
          <h3 className="card-title">💬 トレーナーコメント</h3>
          <blockquote className="coach-comment">{output.coach_comment}</blockquote>
        </div>

        {/* 追加メモ */}
        {input.notes && (
          <div className="detail-card notes-card">
            <h3 className="card-title">📝 指導メモ</h3>
            <p className="card-text">{input.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDetailPage;
