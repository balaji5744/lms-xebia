import React, { useState } from 'react';
import { Search, Bell, History, HelpCircle, ChevronDown, User, Shield, Key, LogOut } from 'lucide-react';

interface HeaderProps {
  onSearchChange?: (val: string) => void;
  searchValue?: string;
  placeholderText?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  onSearchChange, 
  searchValue = '', 
  placeholderText = "Search courses, categories, or students..." 
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, text: "Course 'GDPR & Privacy' has 10 new enrolments.", time: "10 mins ago", isUnread: true },
    { id: 2, text: "System maintenance scheduled for Sunday 2 AM UTC.", time: "4 hours ago", isUnread: true },
    { id: 3, text: "Active learner streak milestone unlocked.", time: "1 day ago", isUnread: false }
  ];

  const handleProfileOptionClick = (option: string) => {
    alert(`Profile Option: "${option}" simulated successfully.`);
    setShowProfileMenu(false);
  };

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      {/* Search Input */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-transparent rounded-full font-sans text-sm focus:outline-none focus:bg-white focus:border-[#510047] focus:ring-2 focus:ring-[#ffd7f0] transition-all placeholder:text-gray-400 text-gray-800"
            placeholder={placeholderText}
          />
        </div>
      </div>

      {/* Action Utilities & Profile details */}
      <div className="flex items-center gap-6">
        {/* Notifications Trigger */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-gray-500 hover:text-[#510047] hover:bg-gray-100 p-2 rounded-full transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                <span className="font-semibold text-sm text-gray-800">Notifications</span>
                <span className="text-xs text-[#01AC9F] font-semibold cursor-pointer" onClick={() => alert("Marked all as read")}>Mark all read</span>
              </div>
              <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${notif.isUnread ? 'bg-[#ffd7f0]/10' : ''}`}>
                    <p className="text-xs text-gray-700 leading-normal">{notif.text}</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* History Clock Action */}
        <button 
          onClick={() => alert("Simulated System Activity Log: Checked courses taxonomy and security records.")}
          className="text-gray-500 hover:text-[#510047] hover:bg-gray-100 p-2 rounded-full transition-colors"
          title="Activity History"
        >
          <History className="w-5 h-5" />
        </button>

        <div className="h-8 w-[1px] bg-gray-200" />

        {/* Profile Dropdown */}
        <div className="relative">
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800 group-hover:text-[#510047] transition-colors">Alex Rivera</p>
              <p className="text-[10px] text-gray-400 font-medium tracking-wide">LMS Administrator</p>
            </div>
            <img 
              className="w-10 h-10 rounded-full border-2 border-[#ffd7f0] object-cover shadow-sm group-hover:scale-105 transition-transform duration-200"
              alt="Manager Avatar"
              referrerPolicy="no-referrer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMXt9gPPaGFp0lxKBansRbI09u5YpxZY2_afmsA2K8qPyozoAVh0tk8fsA4PiIKt9fsgg8y2Y2D4z-ZB1BYVC_TKec2BiuzxlN7fS6QzvdXAKiCwAysLqxLNqkI4VjJzpJS0V1Ey8aeL1i_nIKlxQBDBKtIFfSSLJqfDyEIrrA1LiR4dbtcH0fTPCugFLFPYFPArUZzMKkPoSceuMDnkE3Om0y8Dd2wcKINBqpDnMvgm28HnQxbd3nlcmjWfq41OmdLRcqUEeZbH0"
            />
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors hidden sm:block" />
          </div>

          {/* Profile Contextual Actions Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
              <div className="px-4 py-2 border-b border-gray-50">
                <p className="text-xs text-gray-400">Signed in as</p>
                <p className="text-sm font-semibold text-gray-800 truncate">sayabalaji1@gmail.com</p>
              </div>
              
              <button onClick={() => handleProfileOptionClick("My Profile")} className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <User className="w-4 h-4 text-gray-400" /> My Profile
              </button>
              <button onClick={() => handleProfileOptionClick("Security Settings")} className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Shield className="w-4 h-4 text-gray-400" /> Security
              </button>
              <button onClick={() => handleProfileOptionClick("API Access Keys")} className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Key className="w-4 h-4 text-gray-400" /> Developer Console
              </button>
              
              <div className="h-px bg-gray-50 my-1" />
              
              <button 
                onClick={() => { setShowProfileMenu(false); if(confirm("Log out?")) alert("Logged out successfully"); }} 
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50/50 transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-400" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
