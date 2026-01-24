import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login/Login";
import Header from "./components/Header/Header";
import AnalyticsTab from "./components/Analytics/AnalyticsTab";
import PaymentsTab from "./components/Payments/PaymentsTab";
import Documentation from "./components/Dcumentation/Documentation";

import { removeToken, isAuthenticated } from "./utils/authUtils";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  const handleLoginSuccess = () => setIsLoggedIn(true);

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header onLogout={handleLogout} />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/analytics" />} />
            <Route path="/analytics" element={<AnalyticsTab />} />
            <Route path="/payments" element={<PaymentsTab />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="*" element={<Navigate to="/analytics" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
