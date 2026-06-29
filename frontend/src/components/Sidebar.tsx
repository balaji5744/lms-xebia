import React from "react";
import { useApp } from "../context/AppContext";
import {
  GraduationCap,
  BookOpen,
  HelpCircle,
  LogOut,
  FolderTree,
  Sparkles,
} from "lucide-react";
import logoPurple from "../assets/Logo-Purple.png";
import logoWhite from "../assets/Logo-White.png";

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, startNewCourseWizard } = useApp();
  // Define the strict types allowed for views
  type ViewType = "courses" | "categories" | "wizard" | "course-detail";

  const navItems: { id: ViewType; label: string; icon: React.ElementType }[] = [
    { id: "courses", label: "Course Catalog", icon: BookOpen },
    { id: "categories", label: "Category Management", icon: FolderTree },
  ];

  const handleNavClick = (viewId: ViewType) => {
    setCurrentView(viewId); // No more 'any' hack!
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-[#510047] text-white flex flex-col py-6 z-50 shadow-xl border-r border-[#3c0034]">
      {/* Brand Header */}
      <div className="px-6 mb-10 flex items-center">
        <img
          src={logoWhite}
          alt="Brand Logo"
          className="h-12 w-auto object-contain transition-transform duration-300 hover:scale-105 cursor-pointer"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-3 text-left transition-all duration-200 group relative ${
                isActive
                  ? "border-l-4 border-[#76f7e8] bg-white/10 text-[#76f7e8] font-semibold"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-[#76f7e8]" : "text-white/60 group-hover:text-white"}`}
              />
              <span className="text-sm font-medium">{item.label}</span>

              {isActive && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#76f7e8]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Sidebar Panel */}
      <div className="mt-auto px-6 space-y-4">
        {/* Course Creator Shortcut */}
        {currentView !== "wizard" && (
          <button
            onClick={startNewCourseWizard}
            className="w-full py-2.5 bg-[#01AC9F] hover:bg-[#008f84] text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
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
            className="w-full py-2 bg-[#006a62] hover:bg-[#01ac9f] text-white rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95 border border-white/10 hover:border-transparent shadow-sm"
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
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (confirm("Are you sure you want to log out?"))
                alert("Sign out simulated successfully!");
            }}
            className="flex items-center gap-3 py-2 text-white/70 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 text-white/50" />
            <span className="text-sm font-medium">Logout</span>
          </a>
        </div>
      </div>
    </aside>
  );
};;
