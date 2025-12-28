"use client";
import React, { useState } from 'react';
import {
    Users,
    BookOpen,
    FileEdit,
    GraduationCap,
    Filter,
    MoreVertical,
} from 'lucide-react';

// Mock Data
const STATS = [
    { label: 'Assigned Courses', value: '4', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Enrolled Students', value: '1,284', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Assignments', value: '24', icon: FileEdit, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Assessments', value: '12', icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

const STUDENTS = [
    { id: "1", name: "Olawale Adeleke", email: "olawale@ui.edu.ng", course: "CSC 401", level: "400L", status: "Active" },
    { id: "2", name: "Chidi Okafor", email: "chidi.o@ui.edu.ng", course: "MAT 211", level: "200L", status: "Active" },
    { id: "3", name: "Amina Yusuf", email: "amina.y@ui.edu.ng", course: "CSC 415", level: "400L", status: "Inactive" },
    { id: "4", name: "Tunde Bakare", email: "tunde@ui.edu.ng", course: "CSC 401", level: "400L", status: "Active" },
];

const LECTURER_COURSES = ["All", "CSC 401", "CSC 415", "MAT 211"];

export default function AdminDashboard() {
    const [courseFilter, setCourseFilter] = useState("All");

    const filteredStudents = STUDENTS.filter(s =>
        courseFilter === "All" ? true : s.course === courseFilter
    );

    return (
        <div className=''>
            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {STATS.map((stat, i) => (
                    <div key={i} className="bg-white grid grid-cols-[40px_auto] gap-3 p-4 rounded-[10px] border shadow-xs border-slate-300 transition-all">
                        <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-2xl flex items-center justify-center mb-4`}>
                            <stat.icon size={18} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-[13px] font-bold uppercase tracking-wider">{stat.label}</p>
                            <p className="text-xl font-black text-[#002147] mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* STUDENT TABLE AREA */}
            <div className="bg-white rounded-[15px] border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-xl font-black text-[#002147]">Enrolled Students</h2>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select
                                value={courseFilter}
                                onChange={(e) => setCourseFilter(e.target.value)}
                                className="pl-10 pr-6 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-[#002147] outline-none focus:ring-2 ring-[#fdb813] transition-all appearance-none cursor-pointer"
                            >
                                {LECTURER_COURSES.map(course => (
                                    <option key={course} value={course}>Course: {course}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Course Code</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Level</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[#002147] text-xs">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#002147] text-sm">{student.name}</p>
                                                <p className="text-xs text-slate-400 font-medium">{student.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-bold text-[#002147]">{student.course}</td>
                                    <td className="px-8 py-5 text-sm font-bold text-slate-500">{student.level}</td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${student.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="text-slate-300 hover:text-[#002147] transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}