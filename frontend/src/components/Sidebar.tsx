import React from "react";
import { NavLink, useNavigate, Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  GraduationCap,
  BookOpen,
  HelpCircle,
  LogOut,
  FolderTree,
  Sparkles,
  Shield,
  User,
} from "lucide-react";
import logoWhite from "../assets/Logo-White.png";

export const Sidebar: React.FC = () => {
  const { userRole, currentUser, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/login");
    }
  };

  const isRouteActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-[#510047] text-white flex flex-col py-6 z-50 shadow-xl border-r border-[#3c0034]">
      {/* Brand Header */}
      <div className="px-6 mb-8 flex items-center">
        <Link to="/courses" className="flex items-center gap-3">
          <img
            src={logoWhite}
            alt="Brand Logo"
            className="h-10 w-auto object-contain transition-transform duration-300 hover:scale-105 cursor-pointer"
          />
          <span className="text-lg font-extrabold tracking-tight text-white select-none">
            Xebia LMS
          </span>
        </Link>
      </div>

      {/* User Mini Profile Detail */}
      <div className="mx-4 mb-6 p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${userRole === "admin" ? "bg-[#ffd7f0]/20 text-[#76f7e8]" : "bg-[#01AC9F]/20 text-[#76f7e8]"}`}
        >
          {userRole === "admin" ? (
            <Shield className="w-5 h-5 text-[#ffd7f0]" />
          ) : (
            <User className="w-5 h-5 text-[#01AC9F]" />
          )}
        </div>
        <div className="overflow-hidden">
          <p className="text-[10px] font-extrabold text-white/50 tracking-wider uppercase">
            {currentUser ? currentUser.fullName : "Active Session"}
          </p>
          <p className="text-xs font-bold text-white truncate">
            {currentUser
              ? currentUser.role === "admin"
                ? "Administrator"
                : "Student"
              : userRole === "admin"
                ? "Administrator"
                : "Student"}
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow space-y-1">
        <NavLink
          to="/courses"
          className={({ isActive }) =>
            `w-full flex items-center gap-4 px-6 py-3 text-left transition-all duration-200 group relative ${
              isActive
                ? "border-l-4 border-[#76f7e8] bg-white/10 text-[#76f7e8] font-semibold"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <BookOpen
                className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-[#76f7e8]" : "text-white/60 group-hover:text-white"}`}
              />
              <span className="text-sm font-medium">Course Catalog</span>
              {isActive && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#76f7e8]" />
              )}
            </>
          )}
        </NavLink>

        {/* Admin-Only navigation item */}
        {userRole === "admin" && (
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `w-full flex items-center gap-4 px-6 py-3 text-left transition-all duration-200 group relative ${
                isActive
                  ? "border-l-4 border-[#76f7e8] bg-white/10 text-[#76f7e8] font-semibold"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <FolderTree
                  className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-[#76f7e8]" : "text-white/60 group-hover:text-white"}`}
                />
                <span className="text-sm font-medium">Category Management</span>
                {isActive && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#76f7e8]" />
                )}
              </>
            )}
          </NavLink>
        )}
      </nav>

      {/* Bottom Sidebar Panel */}
      <div className="mt-auto px-6 space-y-4">
        {/* Admin-Only Course Creator Shortcut */}
        {userRole === "admin" && (
          <button
            onClick={() => navigate("/wizard")}
            className="w-full py-2.5 bg-[#01AC9F] hover:bg-[#008f84] text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#76f7e8]" />
            Create Course
          </button>
        )}

        {/* Upgrade Plan Banner */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-[11px] font-semibold tracking-wider text-white/50 uppercase mb-2">
            Enterprise Plan
          </p>
          <button
            onClick={() =>
              alert(
                "Upgrade request sent to accounts department! Standard tier active.",
              )
            }
            className="w-full py-2 bg-[#006a62] hover:bg-[#01ac9f] text-white rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95 border border-white/10 hover:border-transparent shadow-sm cursor-pointer"
          >
            Upgrade Plan
          </button>
        </div>

        {/* Utility Actions */}
        <div className="pt-4 border-t border-white/10 space-y-1">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert("EduCorp Support: How can we assist you today?");
            }}
            className="flex items-center gap-3 py-2 text-white/70 hover:text-white transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-white/50" />
            <span className="text-sm font-medium">Support</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 py-2 text-white/70 hover:text-white transition-colors text-left cursor-pointer"
          >
            <LogOut className="w-5 h-5 text-white/50" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
