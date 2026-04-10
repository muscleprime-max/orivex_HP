import React from "react";
import Header from "./Header";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">{children}</main>
      <footer className="footer">
        <p>© 2025 NutriMind — パーソナルトレーナー向け栄養提案ツール</p>
      </footer>
    </div>
  );
};

export default Layout;
