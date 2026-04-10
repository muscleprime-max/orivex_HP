import React from "react";
import { Link } from "react-router-dom";
import { useReports } from "../hooks/useReports";
import ReportCard from "../components/report/ReportCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";

const ReportListPage: React.FC = () => {
  const { reports, loading, error } = useReports();

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">レポート履歴</h2>
        <Link to="/reports/new" className="btn btn-primary">
          ✨ 新規作成
        </Link>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && reports.length === 0 && (
        <div className="empty-state">
          <p>まだレポートがありません。</p>
          <Link to="/reports/new" className="btn btn-primary">
            最初のレポートを作成する
          </Link>
        </div>
      )}

      <div className="report-grid">
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
};

export default ReportListPage;
