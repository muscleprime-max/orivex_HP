import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ErrorMessage from "../ui/ErrorMessage";

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください。");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: unknown) {
      setError("ログインに失敗しました。メールアドレスまたはパスワードが正しくありません。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">ログイン</h2>
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="trainer@example.com"
            required
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6文字以上"
            required
            className="input"
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary btn-full">
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </form>
      <p className="auth-footer">
        アカウントをお持ちでない方は <Link to="/register">新規登録</Link>
      </p>
    </div>
  );
};

export default LoginForm;
