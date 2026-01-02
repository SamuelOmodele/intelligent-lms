/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from '@/convex/_generated/dataModel';
import { Loader2 } from 'lucide-react';

const InstructorNavbar = () => {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedId = localStorage.getItem("userId");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (storedId) setUserId(storedId);
    }, []);

    // Reusing your currentUser query
    const lecturer = useQuery(api.users.currentUser, 
        userId ? { id: userId as Id<"users"> } : "skip"
    );

    return (
        <div className="bg-white border border-slate-200 h-20 flex justify-between items-center py-3 px-7 pr-10">
            <div>
                <h1 className="text-xl font-black text-[#002147]">Instructor Dashboard</h1>
                {/* Dynamic Welcome Message */}
                <div className="flex items-center gap-2">
                    {!lecturer ? (
                        <div className="h-4 w-32 bg-slate-100 animate-pulse rounded mt-1" />
                    ) : (
                        <p className="text-slate-500 font-medium">
                            Welcome back, {lecturer.name.split(' ')[0].length > 0 ? `Prof. ${lecturer.name}` : lecturer.name}
                        </p>
                    )}
                </div>
            </div>
            <div className="bg-white p-2 rounded-[5px] border border-slate-200 flex items-center gap-3 pr-5">
                <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-[#002147] font-bold uppercase">
                    {lecturer?.name?.charAt(0) || <Loader2 size={12} className="animate-spin" />}
                </div>
                <span className="text-sm font-black text-[#002147]">Instructor Panel</span>
            </div>
        </div>
    )
}

export default InstructorNavbar;