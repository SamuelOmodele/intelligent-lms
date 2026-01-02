/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
    Menu,
    X,
    Bell,
    User,
    Loader2
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from '@/convex/_generated/dataModel';

type TProps = {
    isSidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const StudentNavbar = ({ isSidebarOpen, setSidebarOpen }: TProps) => {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedId = localStorage.getItem("userId");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (storedId) setUserId(storedId);
    }, []);

    // Using the currentUser query from your users.ts
    const student = useQuery(api.users.currentUser, 
        userId ? { id: userId as Id<"users"> } : "skip"
    );

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8" >
            <button onClick={() => setSidebarOpen(prev => !prev)} className="lg:hidden p-2 text-slate-600">
                {isSidebarOpen ? <X /> : <Menu />}
            </button>

            <div className="flex-1 max-lg:px-4 hidden md:block">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Student Portal</h2>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-slate-400 hover:text-[#002147] relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="text-right hidden sm:block">
                        {!student ? (
                            <div className="w-24 h-8 bg-slate-50 animate-pulse rounded flex items-center justify-center">
                                <Loader2 size={14} className="animate-spin text-slate-200" />
                            </div>
                        ) : (
                            <>
                                <p className="text-xs font-black text-[#002147] uppercase">
                                    {student.name}
                                </p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">
                                    {student.matricNumber || "N/A"} • {student.department}
                                </p>
                            </>
                        )}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-[#fdb813] flex items-center justify-center overflow-hidden shrink-0">
                        <User size={20} className="text-[#002147] " />
                    </div>
                </div>
            </div>
        </header >
    )
}

export default StudentNavbar;