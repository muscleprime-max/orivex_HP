import React from "react";
import { useNavigate } from "react-router-dom";
import type { Report } from "../../types";

interface Props {
  report: Report;
}

const ReportCard: React.FC<Props> = ({ report }) => {
  const navigate = useNavigate();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const goalColors: Record<string, string> = {
    減量: "#ff6b6b",
    増量: "#51cf66",
    維持: "#339af0",
    健康改善: "#fab005",
  };

  return (
    <div
      className="report-card"
      onClick={() => navigate(`/reports/${report.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/reports/${report.id}`)}
    >
      <div className="report-card-header">
        <h3 className="report-card-name">{report.clientName}</h3>
        <span
          className="goal-badge"
          style={{ backgroundColor: goalColors[report.input.goal] || "#868e96" }}
        >
          {report.input.goal}
        </span>
      </div>
      <p className="report-card-summary">{report.output.summary}</p>
      <div className="report-card-meta">
        <span className="meta-item">📅 {formatDate(report.createdAt)}</span>
        <span className="meta-item">🎯 {report.input.trainerPolicy}</span>
        <span className="meta-item">⚙️ {report.model}</span>
      </div>
    </div>
  );
};

export default ReportCard;
