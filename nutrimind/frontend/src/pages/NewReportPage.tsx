import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReportForm from "../components/report/ReportForm";
import ErrorMessage from "../components/ui/ErrorMessage";
import { useReports } from "../hooks/useReports";
import type { ClientInput } from "../types";

const NewReportPage: React.FC = () => {
  const { generateReport } = useReports();
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (input: ClientInput) => {
    setError(null);
    setGenerating(true);
    try {
      const result = await generateReport(input);
      navigate(`/reports/${result.reportId}`);
    } catch (e: unknown) {
      console.error(e);
      setError(
        "レポートの生成に失敗しました。しばらく待ってから再度お試しください。"
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="page">
      <h2 className="page-title">新規レポート作成</h2>
      <p className="page-subtitle">クライアントの情報を入力して、AIが栄養提案レポートを生成します。</p>

      {error && <ErrorMessage message={error} />}

      <ReportForm onSubmit={handleSubmit} loading={generating} />
    </div>
  );
};

export default NewReportPage;
