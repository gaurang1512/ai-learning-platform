import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  BookOpen,
  Library,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSideBar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);
  const handleNavClick = () => {
    if (window.innerWidth < 768) setIsMobileOpen(false);
  };

  const navItems = [
    { to: "/app", icon: Home, label: "Home", end: true },
    {
      to: "/app/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      end: true,
    },
    {
      to: "/app/learning-path",
      icon: BookOpen,
      label: "Create Learning Path",
      end: true,
    },
    { to: "/app/my-paths", icon: Library, label: "My Paths", end: true },
  ];

  return (
    <>
      {/* ── Mobile toggle (only visible on small screens) ── */}
      <button
        onClick={toggleMobileMenu}
        aria-label="Toggle Menu"
        className="md:hidden fixed top-3.5 left-4 z-60 w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all duration-200"
      >
        {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* ── Mobile overlay ── */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        />
      )}

      {/* ── Desktop Sidebar ── */}
      <aside
        className={`
          hidden md:flex shrink-0 flex-col justify-between
          bg-white border-r border-gray-100 shadow-sm py-5
          h-full transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-68px" : "w-56"}
        `}
      >
        {/* Top: Logo + Nav */}
        <div className="flex flex-col gap-1">
          {/* Nav */}
          <div className="flex flex-col gap-1 px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                title={isCollapsed ? item.label : ""}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                  ${isActive ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"}
                  ${isCollapsed ? "justify-center" : ""}`
                }
              >
                <item.icon size={18} className="shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Bottom: Collapse button */}
        <div className="px-2">
          <button
            onClick={toggleSideBar}
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-blue-600 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all duration-200 ${isCollapsed ? "justify-center" : ""}`}
          >
            {isCollapsed ? (
              <Menu size={16} />
            ) : (
              <>
                <ChevronLeft size={16} />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ── Mobile Drawer ── */}
      <aside
        className={`
          md:hidden fixed top-0 left-0 h-full z-50
          bg-white border-r border-gray-100 shadow-xl
          flex flex-col justify-between py-5 w-56
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5 px-4 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-200 shrink-0">
              <span className="text-white font-extrabold text-sm">I</span>
            </div>
            <span className="text-base font-extrabold text-gray-900 tracking-tight">
              IntelliPath <span className="text-blue-600">AI</span>
            </span>
          </div>

          <div className="flex flex-col gap-1 px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                  ${isActive ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"}`
                }
              >
                <item.icon size={18} className="shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
