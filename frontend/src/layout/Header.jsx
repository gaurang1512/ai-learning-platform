import React from "react";
import { useNavigate } from "react-router-dom";
import { AppData } from "../context/AppContext.jsx";

function Header() {
  const { logoutUser, isAuth } = AppData();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm px-6 py-3 z-50 shrink-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-200">
            <span className="text-white font-extrabold text-sm">I</span>
          </div>
          <h1 className="text-lg font-extrabold text-gray-900 tracking-tight">
            IntelliPath <span className="text-blue-600">AI</span>
          </h1>
        </div>

        {/* Logout */}
        {isAuth && (
          <button
            onClick={handleLogout}
            className="text-sm font-bold text-gray-500 hover:text-red-500 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 px-4 py-2 rounded-xl transition-all duration-200"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
