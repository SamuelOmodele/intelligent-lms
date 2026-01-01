/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
    ArrowUpToLine, CheckCircle2, Clock, FileText,
    Loader2, Inbox, DownloadCloud
} from 'lucide-react';
import Link from 'next/link';

// Helper Component for Downloads
const AttachmentDownload = ({ storageId }: { storageId: string }) => {
    const getUrl = useMutation(api.assignments.getDownloadUrl);
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            const url = await getUrl({ storageId });
            if (url) window.open(url, "_blank");
        } catch (error) {
            console.error("Download failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={loading}
            className="flex cursor-pointer items-center gap-1.5 text-blue-600 hover:text-blue-800 transition-colors"
        >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <DownloadCloud size={14} />}
            <span>{loading ? "Getting link..." : "Download Assignment Document"}</span>
        </button>
    );
};

const StudentAssignmentTab = ({ courseId }: any) => {
    const [studentId, setStudentId] = useState<Id<"users"> | null>(null);

    useEffect(() => {
        const storedId = localStorage.getItem("userId");
        if (storedId) setStudentId(storedId as Id<"users">);
    }, []);

    // Now using the course-specific query
    const assignments = useQuery(
        api.assignments.getAssignmentsByCourse,
        (studentId && courseId) ? { studentId, courseId } : "skip"
    );

    if (assignments === undefined) {
        return (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                <Loader2 className="animate-spin" size={24} />
                <p className="text-xs font-bold uppercase tracking-widest">Loading Tasks...</p>
            </div>
        );
    }

    if (assignments.length === 0) {
        return (
            <div className="py-16 text-center border-2 border-dashed border-slate-100 rounded-xl">
                <Inbox className="mx-auto text-slate-200 mb-3" size={40} />
                <p className="text-slate-400 font-bold italic text-sm">No assignments available.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {assignments.map((asgn) => (
                <div key={asgn._id} className="bg-white rounded-[10px] border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-5 flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`text-[10px] font-black px-2 py-1 rounded uppercase ${asgn.status === 'Submitted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {asgn.status}
                                </span>
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-tight">
                                    {asgn.courseCode}
                                </span>
                            </div>

                            <h3 className="text-lg font-black text-[#002147] mb-1">{asgn.title}</h3>
                            <p className="text-sm text-slate-500 font-medium mb-4">{asgn.instructions}</p>

                            <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-slate-400">
                                <span className="flex items-center gap-1.5"><Clock size={14} /> Due {asgn.dueDate}</span>

                                {/* ATTACHMENT SECTION */}
                                {asgn.attachmentId ? (
                                    <AttachmentDownload storageId={asgn.attachmentId} />
                                ) : (
                                    <span className="flex items-center gap-1.5 text-slate-300 italic"><FileText size={14} /> No attachment</span>
                                )}
                            </div>
                        </div>

                        <div className="w-full md:w-auto">
                            {asgn.status === 'Submitted' ? (
                                <button className="w-full md:w-auto px-6 py-3 bg-slate-50 text-slate-400 rounded-lg font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-default border border-slate-100">
                                    <CheckCircle2 size={16} className="text-emerald-500" /> Submitted
                                </button>
                            ) : (
                                <Link
                                    href={`/dashboard/my-courses/${asgn.courseId}/submit/${asgn._id}`}
                                    className="w-full md:w-auto px-6 py-3 bg-[#002147] text-white rounded-lg font-bold text-xs uppercase flex items-center justify-center gap-2 hover:bg-[#003366] transition-all"
                                >
                                    <ArrowUpToLine size={16} /> Submit Task
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default StudentAssignmentTab;