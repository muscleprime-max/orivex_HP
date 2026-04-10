import React from "react";
import RegisterForm from "../components/auth/RegisterForm";

const RegisterPage: React.FC = () => {
  return (
    <div className="auth-page">
      <div className="auth-logo">
        <h1>🥗 NutriMind</h1>
        <p>パーソナルトレーナー向け栄養提案ツール</p>
      </div>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
