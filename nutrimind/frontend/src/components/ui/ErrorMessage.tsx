import React from "react";

interface Props {
  message: string;
}

const ErrorMessage: React.FC<Props> = ({ message }) => {
  return (
    <div className="error-message" role="alert">
      <span className="error-icon">⚠️</span>
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;
