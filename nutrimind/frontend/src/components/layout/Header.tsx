import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          🥗 NutriMind
        </Link>
        {currentUser && (
          <nav className="header-nav">
            <Link to="/reports" className="nav-link">レポート履歴</Link>
            <Link to="/reports/new" className="nav-link nav-link-primary">新規作成</Link>
            <button onClick={handleLogout} className="btn-logout">
              ログアウト
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
