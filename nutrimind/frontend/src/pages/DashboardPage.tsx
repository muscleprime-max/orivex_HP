import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useReports } from "../hooks/useReports";
import ReportCard from "../components/report/ReportCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { reports, loading, error } = useReports();

  const recentReports = reports.slice(0, 3);

  return (
    <div className="page">
      <div className="dashboard-hero">
        <div>
          <h2 className="page-title">ダッシュボード</h2>
          <p className="page-subtitle">
            ようこそ、{currentUser?.email} さん
          </p>
        </div>
        <Link to="/reports/new" className="btn btn-primary">
          ✨ 新規レポート作成
        </Link>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-number">{reports.length}</span>
          <span className="stat-label">作成済みレポート</span>
        </div>
      </div>

      <section className="dashboard-section">
        <div className="section-header">
          <h3>最近のレポート</h3>
          {reports.length > 3 && (
            <Link to="/reports" className="link-more">すべて見る →</Link>
          )}
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && recentReports.length === 0 && (
          <div className="empty-state">
            <p>まだレポートがありません。</p>
            <Link to="/reports/new" className="btn btn-primary">
              最初のレポートを作成する
            </Link>
          </div>
        )}

        <div className="report-grid">
          {recentReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
