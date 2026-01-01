/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
    Search,
    Filter,
    MoreVertical,
    Download,
    Users,
    Loader2,
    Mail,
} from 'lucide-react';
import { toast } from 'sonner';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function InstructorStudentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [courseFilter, setCourseFilter] = useState("All Courses");
    const [lecturerId, setLecturerId] = useState<Id<"users"> | null>(null);

    // 1. Get Lecturer ID from Local Storage on mount
    useEffect(() => {
        const storedId = localStorage.getItem("userId"); // Ensure this matches your storage key
        if (storedId) {
            setLecturerId(storedId as Id<"users">);
        }
    }, []);

    // 2. Fetch Data using the ID (only if ID exists)
    const allStudents = useQuery(
        api.students.getInstructorStudents, 
        lecturerId ? { lecturerId } : "skip"
    );

    // 3. Filter logic applied to backend data
    const filteredStudents = allStudents?.filter(student => {
        const matchesSearch = 
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.matric.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCourse = courseFilter === "All Courses" || student.course === courseFilter;
        
        return matchesSearch && matchesCourse;
    }) ?? [];

    // 4. Extract dynamic courses for the filter dropdown
    const uniqueCourses = [
        "All Courses", 
        ...new Set(allStudents?.map(s => s.course).filter(Boolean))
    ];

    // 5. CSV Export Functionality
    const downloadCSV = () => {
        if (filteredStudents.length === 0) return toast.error("No data to download");
        
        const headers = "Name,Email,Matric No,Department,Level,Course\n";
        const rows = filteredStudents.map(s => 
            `"${s.name}","${s.email}","${s.matric}","${s.department}","${s.level}","${s.course}"`
        ).join("\n");
        
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `students_directory_${new Date().toLocaleDateString()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success("CSV Downloaded successfully");
    };

    // Loading State
    if (allStudents === undefined || !lecturerId) {
        return (
            <div className="h-96 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="font-bold text-sm uppercase tracking-widest animate-pulse">
                    Accessing Student Records...
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto ">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-[#002147] flex items-center gap-3">
                        Students Directory
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Viewing all students currently enrolled in your courses.
                    </p>
                </div>
                <button 
                    onClick={downloadCSV}
                    className="flex items-center gap-2 bg-[#002147] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-all shadow-md"
                >
                    <Download size={18} /> Download CSV
                </button>
            </div>

            {/* Table Controls */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or matric number..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 ring-blue-100 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 mr-2">
                        <Filter size={14} /> Filter:
                    </div>
                    <select
                        className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-sm font-bold text-[#002147] outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                        value={courseFilter}
                        onChange={(e) => setCourseFilter(e.target.value)}
                    >
                        {uniqueCourses.map(course => (
                            <option key={course} value={course}>{course}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Matric No.</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Level</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Course Code</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={`${student.id}-${student.course}`} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-blue-50 text-[#002147] flex items-center justify-center font-bold text-xs border border-blue-100 group-hover:bg-[#002147] group-hover:text-white transition-colors">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#002147] text-sm">{student.name}</p>
                                                    <p className="text-[11px] text-slate-400 font-medium">{student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                                {student.matric}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-bold text-slate-600">{student.department}</td>
                                        <td className="px-8 py-5">
                                            <span className="text-[12px] font-black text-slate-500 uppercase">
                                                {student.level}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-black text-blue-600">
                                                {student.course}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="p-2 hover:bg-slate-100 rounded-lg outline-none transition-colors">
                                                    <MoreVertical size={18} className="text-slate-400" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem 
                                                        className="flex items-center gap-2 font-bold text-xs py-3 cursor-pointer"
                                                        onClick={() => window.location.href = `mailto:${student.email}`}
                                                    >
                                                        <Mail size={14} /> Send Email
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <Users size={48} className="text-slate-200 mb-4" />
                                            <p className="text-slate-400 font-bold italic">No students found matching your filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}