/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    Eye,
    ShieldAlert,
    Download,
    Mail,
    Users
} from 'lucide-react';

// Shadcn imports (assumed installed)
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Mock Data
const ALL_STUDENTS = [
    { id: "1", name: "Olawale Adeleke", email: "o.adeleke@stu.ui.edu.ng", matric: "190201", department: "Computer Science", level: "400L", course: "CSC 401" },
    { id: "2", name: "Amina Yusuf", email: "a.yusuf@stu.ui.edu.ng", matric: "190452", department: "Computer Science", level: "400L", course: "CSC 415" },
    { id: "3", name: "Chidi Okafor", email: "c.okafor@stu.ui.edu.ng", matric: "190331", department: "Mathematics", level: "200L", course: "MAT 211" },
    { id: "4", name: "Tunde Bakare", email: "t.bakare@stu.ui.edu.ng", matric: "190112", department: "Computer Science", level: "400L", course: "CSC 401" },
    { id: "5", name: "Sarah Idibia", email: "s.idibia@stu.ui.edu.ng", matric: "201442", department: "Statistics", level: "300L", course: "MAT 211" },
];

const COURSES = ["All Courses", "CSC 401", "CSC 415", "MAT 211"];

export default function InstructorStudentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [courseFilter, setCourseFilter] = useState("All Courses");
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [blockOpen, setBlockOpen] = useState(false);

    // Filtering Logic
    const filteredStudents = ALL_STUDENTS.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.matric.includes(searchTerm);
        const matchesCourse = courseFilter === "All Courses" || student.course === courseFilter;
        return matchesSearch && matchesCourse;
    });

    return (
        <div className="max-w-7xl mx-auto">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                    <h1 className="text-2xl font-black text-[#002147] flex items-center gap-3">
                        Students Directory
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Manage and monitor all students enrolled in your courses.</p>
                </div>
                <button className="flex items-center gap-2 bg-white border border-slate-200 text-[#002147] px-5 py-2.5 rounded-[5px] font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
                    <Download size={18} /> Download CSV
                </button>
            </div>

            {/* Table Controls */}
            <div className="bg-white p-4 rounded-[10px] border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
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
                        className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-sm font-bold text-[#002147] outline-none cursor-pointer"
                        value={courseFilter}
                        onChange={(e) => setCourseFilter(e.target.value)}
                    >
                        {COURSES.map(course => (
                            <option key={course} value={course}>{course}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Matric No.</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Level</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Course</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/30 transition-colors group">
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
                                        <td className="px-8 py-5 text-sm font-bold text-slate-600">{student.matric}</td>
                                        <td className="px-8 py-5 text-sm font-bold text-slate-600">{student.department}</td>
                                        <td className="px-8 py-5">
                                            <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-500">{student.level}</span>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-black text-[#002147]">{student.course}</td>
                                        <td className="px-8 py-5 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="p-2 hover:bg-slate-100 rounded-lg outline-none transition-colors">
                                                    <MoreVertical size={18} className="text-slate-400" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-xl border-slate-200">
                                                    <DropdownMenuItem
                                                        onClick={() => { setSelectedStudent(student); setViewOpen(true); }}
                                                        className="flex items-center gap-2 text-xs font-bold p-3 cursor-pointer"
                                                    >
                                                        <Eye size={16} /> View Performance
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => { setSelectedStudent(student); setBlockOpen(true); }}
                                                        className="flex items-center gap-2 text-xs font-bold p-3 text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-600"
                                                    >
                                                        <ShieldAlert size={16} /> Block Student
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

            {/* MODALS */}

            {/* View Student Performance Modal */}
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogContent className="sm:max-w-[550px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="font-black text-[#002147] text-xl">Student Details</DialogTitle>
                    </DialogHeader>
                    {selectedStudent && (
                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-14 h-14 bg-[#002147] text-[#fdb813] rounded-full flex items-center justify-center text-2xl font-black shadow-lg">
                                    {selectedStudent.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-black text-[#002147] text-lg">{selectedStudent.name}</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedStudent.matric}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border border-slate-100 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Current Course</p>
                                    <p className="font-bold text-[#002147]">{selectedStudent.course}</p>
                                </div>
                                <div className="p-4 border border-slate-100 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Overall Grade</p>
                                    <p className="font-bold text-emerald-600">A (82%)</p>
                                </div>
                            </div>

                            
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Block Student Confirmation Modal */}
            <Dialog open={blockOpen} onOpenChange={setBlockOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="font-black text-red-600 flex items-center gap-2 text-xl">
                            <ShieldAlert /> Restrict Access
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            Are you sure you want to block <span className="font-black text-[#002147]">{selectedStudent?.name}</span> from accessing <span className="font-black text-[#002147]">{selectedStudent?.course}</span>?
                        </p>
                        <p className="text-[11px] text-red-400 mt-4 italic">* They will still be able to see other courses they are enrolled in.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setBlockOpen(false)} className="flex-1 py-4 text-xs font-black uppercase text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
                        <button className="flex-1 py-4 text-xs font-black uppercase text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all">Confirm Block</button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}