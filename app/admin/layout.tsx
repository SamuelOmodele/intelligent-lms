"use client";
import React from 'react';
import AdminSidebar from '@/components/shared/AdminSidebar';
import AdminAuthProvider from '@/components/provider/AdminAuthProvider';
import AdminNavbar from '@/components/shared/AdminNavbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <div className="flex min-h-screen bg-[#fafafa]">
        {/* 1. FIXED SIDEBAR */}
        <AdminSidebar />

        {/* 2. MAIN CONTENT AREA */}
        <div className="flex-1 ml-64 flex flex-col">
          <AdminNavbar />

          {/* PAGE CONTENT */}
          <main className="p-7 animate-in fade-in duration-700">
            {children}
          </main>

        </div>
      </div>
    </AdminAuthProvider>
  );
}