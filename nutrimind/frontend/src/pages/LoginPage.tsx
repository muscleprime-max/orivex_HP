import React from "react";
import LoginForm from "../components/auth/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <div className="auth-page">
      <div className="auth-logo">
        <h1>🥗 NutriMind</h1>
        <p>パーソナルトレーナー向け栄養提案ツール</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
