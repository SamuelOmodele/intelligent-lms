"use client";
import React, { useState } from 'react';

import Sidebar from '@/components/shared/Sidebar';
import StudentNavbar from '@/components/shared/StudentNavbar';
import StudentAuthProvider from '@/components/provider/StudentAuthProvider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);


  return (
    <StudentAuthProvider>
      <div className="font-nunito h-screen bg-slate-50 flex">
        <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* --- Main Content Area --- */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <StudentNavbar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Dynamic Page Content */}
          <div onClick={() => setSidebarOpen(false)} className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </StudentAuthProvider>
  );
}