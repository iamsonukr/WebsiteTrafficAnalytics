import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login/Login";
import Header from "./components/Header/Header";
import AnalyticsTab from "./components/Analytics/AnalyticsTab";
import PaymentsTab from "./components/Payments/PaymentsTab";

import { removeToken, isAuthenticated } from "./utils/authUtils";
import PaymentDueHTML from "./components/Dcumentation/PaymentdueHTML";
import PaymentDueJSX from "./components/Dcumentation/PaymentDueJSX";

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
            <Route path="/docs" element={<PaymentDueJSX />} />
            <Route path="/payment-html" element={<PaymentDueHTML />} />
            <Route path="*" element={<Navigate to="/analytics" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
