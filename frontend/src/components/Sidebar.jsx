import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";

const navItems = [
  { icon: "ti-layout-dashboard", label: "Dashboard", path: "/dashboard" },
  { icon: "ti-stack-2", label: "Subscriptions", path: "/subscriptions" },
  { icon: "ti-circle-plus", label: "Add New", path: "/add" },
  { icon: "ti-shield-half", label: "Admin", path: "/admin" },
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <aside
        className={`fixed lg:static z-40 top-0 left-0 h-full w-64 bg-[#1A0F35] border-r border-[#3B1F6B] flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[#3B1F6B]">
          <Logo size={34} />
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Sub<span className="text-[#A855F7]">Sense</span>
            </h1>
            <p className="text-[#A855F7] text-[9px] tracking-[3px] uppercase opacity-60">Intelligence</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => { navigate(item.path); onClose && onClose(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? "bg-[#A855F7] bg-opacity-15 text-[#A855F7] border border-[#A855F7] border-opacity-25"
                    : "text-gray-400 hover:text-white hover:bg-[#2D1B4E]"
                }`}
              >
                <i className={`ti ${item.icon} text-base`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-[#3B1F6B]">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#2D1B4E] cursor-pointer transition">
            <div className="w-8 h-8 rounded-full bg-[#A855F7] bg-opacity-20 border border-[#A855F7] border-opacity-30 flex items-center justify-center text-xs font-bold text-[#A855F7]">
              GK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">Gowtham Kumar</p>
              <p className="text-gray-600 text-xs truncate">Admin</p>
            </div>
            <i className="ti ti-logout text-gray-600 hover:text-gray-400 text-sm" />
          </div>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-60 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}
