"use client";
import LecturerAuthProvider from '@/components/provider/LecturerAuthProvider';
import InstructorNavbar from '@/components/shared/InstructorNavbar';
import InstructorSidebar from '@/components/shared/InstructorSidebar';
import React, { useState } from 'react';


export default function InstructorDashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <LecturerAuthProvider>
            <div className="flex min-h-screen bg-slate-50/50">
                {/* SIDEBAR */}
                <InstructorSidebar />

                {/* MAIN CONTENT */}
                <main className="ml-64 flex-1">
                    {/* Header */}
                    <InstructorNavbar />
                    <div className='p-7 h-[calc(100dvh-80px)] overflow-y-auto'>
                        {children}
                    </div>
                </main>
            </div>
        </LecturerAuthProvider>
    );
}