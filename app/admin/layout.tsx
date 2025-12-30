"use client";
import React from 'react';

import { Bell, User } from 'lucide-react';
import AdminSidebar from '@/components/shared/AdminSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      {/* 1. FIXED SIDEBAR */}
      <AdminSidebar />

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 ml-64 flex flex-col">

        {/* TOP NAVIGATION BAR (Universal for Admin) */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div>
            <h1 className="text-xl font-black text-[#002147]">Administrator Control Center</h1>
            <p className="text-slate-500 font-medium">Welcome back, Mr Adebayo</p>
          </div>

          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <button className="relative p-2 text-slate-400 hover:text-[#002147] transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Admin Profile Quick View */}
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-[#002147] leading-tight">Super Admin</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">System Root</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#002147] border border-slate-200">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-7 animate-in fade-in duration-700">
          {children}
        </main>

      </div>
    </div>
  );
}