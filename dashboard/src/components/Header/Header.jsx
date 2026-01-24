import React from "react";
import { NavLink } from "react-router-dom";
import { LogOut, BarChart3, CreditCard, FileText } from "lucide-react";

const navLinkBase =
  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors";

const Header = ({ onLogout }) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo / Title */}
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <span className="text-lg font-semibold text-gray-900">
            Analytics & Payments
          </span>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-1">
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `${navLinkBase} ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`
              }
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </NavLink>

            <NavLink
              to="/payments"
              className={({ isActive }) =>
                `${navLinkBase} ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`
              }
            >
              <CreditCard className="w-4 h-4" />
              Payments
            </NavLink>

            <NavLink
              to="/docs"
              className={({ isActive }) =>
                `${navLinkBase} ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`
              }
            >
              <FileText className="w-4 h-4" />
              Docs
            </NavLink>
          </nav>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
                       text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
