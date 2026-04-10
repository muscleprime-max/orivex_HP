import React from "react";

interface Props {
  message?: string;
}

const LoadingSpinner: React.FC<Props> = ({ message = "読み込み中..." }) => {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
