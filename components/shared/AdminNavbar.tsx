/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Bell, User, } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const AdminNavbar = () => {
    const [userId, setUserId] = useState<string | null>(null);

    // 1. Get the ID from localStorage on mount
    useEffect(() => {
        const storedId = localStorage.getItem("userId");
        setUserId(storedId);
    }, []);

    // 2. Fetch user data from Convex
    // We cast to any if the ID format needs a specific Convex ID type
    const admin = useQuery(api.users.currentUser, {
        id: userId as any
    });

    return (
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
            <div>
                <h1 className="text-xl font-black text-[#002147]">Administrator Control Center</h1>
                <p className="text-slate-500 font-medium">
                    {admin ? `Welcome back, ${admin.name}` : "Loading account..."}
                </p>
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
                        <p className="text-sm font-black text-[#002147] leading-tight">
                            Super Admin
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            System Root
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#002147] border border-slate-200">
                        {admin ? (
                            <span className="font-bold text-xs">
                                {admin.name.charAt(0).toUpperCase()}
                            </span>
                        ) : (
                            <User size={20} />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;