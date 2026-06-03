import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function PageLayout({ title, subtitle, action, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0F0A1E] flex relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#A855F7] opacity-[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#7C3AED] opacity-[0.04] rounded-full blur-[120px] pointer-events-none" />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        <header className="sticky top-0 z-20 bg-[#0F0A1E] bg-opacity-80 backdrop-blur border-b border-[#3B1F6B] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <i className="ti ti-menu-2 text-xl" />
            </button>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">{title}</h2>
              {subtitle && <p className="text-gray-600 text-xs">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-[#2D1B4E] text-gray-400 hover:text-white transition">
              <i className="ti ti-bell text-lg" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#A855F7] rounded-full" />
            </button>
            {action && (
              <button
                onClick={() => navigate(action.path)}
                className="flex items-center gap-2 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] hover:from-[#9333EA] hover:to-[#6D28D9] text-white text-sm font-semibold px-4 py-2 rounded-xl transition active:scale-95 shadow-lg shadow-purple-900/30"
              >
                <i className={`ti ${action.icon} text-base`} />
                <span className="hidden sm:inline">{action.label}</span>
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
