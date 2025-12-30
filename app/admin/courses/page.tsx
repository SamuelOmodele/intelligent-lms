/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from 'react';
import {
    Search,
    Plus,
    BookOpen,
    User,
    MoreVertical,
    Filter,
    Building2,
    ArrowRight,
    Edit,
    Trash2,
    AlertTriangle
} from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock Data
const ALL_COURSES = [
    { id: 1, code: "CSC 401", name: "Analysis of Algorithms", department: "Computer Science", lecturer: "Prof. A. B. Adeboye", students: 124, status: "Active" },
    { id: 2, code: "MAT 211", name: "Abstract Algebra", department: "Mathematics", lecturer: "Dr. Sarah Idris", students: 85, status: "Active" },
    { id: 3, code: "CSC 415", name: "Artificial Intelligence", department: "Computer Science", lecturer: "Dr. O. Olumide", students: 92, status: "Inactive" },
    { id: 4, code: "STA 101", name: "Intro to Statistics", department: "Statistics", lecturer: "Prof. J. K. Zungeru", students: 250, status: "Active" },
];

const DEPARTMENTS = ["All Departments", "Computer Science", "Mathematics", "Statistics"];

export default function AdminCoursesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [deptFilter, setDeptFilter] = useState("All Departments");
    
    // Modal & Selection States
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const filteredCourses = ALL_COURSES.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = deptFilter === "All Departments" || course.department === deptFilter;
        return matchesSearch && matchesDept;
    });

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#002147]">Course Registry</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage institutional curriculum and assignments.</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <button className="flex items-center gap-2 bg-[#002147] text-white px-6 py-3 rounded-[5px] font-black text-xs uppercase hover:bg-[#003366] transition-all cursor-pointer shadow-xs shadow-blue-900/20">
                            <Plus size={18} /> Add New Course
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                            <DialogTitle className="font-black text-[#002147]">Create Institutional Course</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Course Code</label>
                                    <input type="text" className="w-full p-3 border rounded-xl text-sm" placeholder="e.g. CSC 401" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Department</label>
                                    <select className="w-full p-3 border rounded-xl text-sm bg-white">
                                        <option>Computer Science</option>
                                        <option>Mathematics</option>
                                        <option>Statistics</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-slate-400">Course Name</label>
                                <input type="text" className="w-full p-3 border rounded-xl text-sm" placeholder="e.g. Analysis of Algorithms" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-slate-400">Assign Lecturer</label>
                                <select className="w-full p-3 border rounded-xl text-sm bg-white">
                                    <option>Select a Lecturer...</option>
                                    <option>Prof. A. B. Adeboye</option>
                                    <option>Dr. Sarah Idris</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-[#fdb813] text-[#002147] font-black py-4 rounded-xl uppercase text-xs mt-2 hover:opacity-90 transition-all">
                                Finalize & Register Course
                            </button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search code or course name..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-blue-100 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Building2 size={18} className="text-slate-400" />
                    <select
                        className="bg-slate-50 border-none px-4 py-3 rounded-xl text-sm font-bold text-[#002147] outline-none cursor-pointer"
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                    >
                        {DEPARTMENTS.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Course Grid */}
            <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                    <div key={course.id} className="bg-white rounded-[2rem] border border-slate-200 p-6 hover:border-[#fdb813] transition-all group relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 p-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="p-2 hover:bg-slate-50 rounded-full outline-none">
                                    <MoreVertical size={18} className="text-slate-400" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl w-40">
                                    <DropdownMenuItem 
                                        onClick={() => { setSelectedCourse(course); setIsEditOpen(true); }}
                                        className="flex items-center gap-2 text-xs font-bold p-3 cursor-pointer"
                                    >
                                        <Edit size={14} /> Edit Course
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                        onClick={() => { setSelectedCourse(course); setIsDeleteOpen(true); }}
                                        className="flex items-center gap-2 text-xs font-bold p-3 text-red-600 cursor-pointer"
                                    >
                                        <Trash2 size={14} /> Delete Course
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="flex flex-col h-full">
                            <div className="mb-4 text-xs font-bold">
                                <span className={`px-3 py-1 rounded-full uppercase ${course.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                    {course.status}
                                </span>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{course.code}</h3>
                                <h2 className="text-xl font-black text-[#002147] leading-tight group-hover:text-blue-700 transition-colors">
                                    {course.name}
                                </h2>
                            </div>

                            <div className="space-y-3 mt-auto border-t border-slate-50 pt-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <User size={16} />
                                    </div>
                                    <p className="font-bold text-slate-600">{course.lecturer}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                        <BookOpen size={14} />
                                        <span>{course.students} Students Enrolled</span>
                                    </div>
                                    <button className="p-2 bg-[#002147] text-white rounded-lg hover:bg-blue-900 transition-all cursor-pointer">
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MODALS --- */}

            {/* Edit Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle className="font-black text-[#002147]">Update {selectedCourse?.code}</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4 mt-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400">Course Name</label>
                            <input type="text" className="w-full p-3 border rounded-xl text-sm" defaultValue={selectedCourse?.name} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400">Reassign Lecturer</label>
                            <select className="w-full p-3 border rounded-xl text-sm bg-white" defaultValue={selectedCourse?.lecturer}>
                                <option>{selectedCourse?.lecturer}</option>
                                <option>Prof. A. B. Adeboye</option>
                                <option>Dr. Sarah Idris</option>
                            </select>
                        </div>
                        <div className="flex gap-3 pt-2">
                             <button type="button" onClick={() => setIsEditOpen(false)} className="flex-1 bg-slate-100 text-slate-600 font-black py-4 rounded-xl uppercase text-xs">Cancel</button>
                             <button type="submit" className="flex-1 bg-[#002147] text-white font-black py-4 rounded-xl uppercase text-xs">Save Changes</button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[400px] text-center">
                    <div className="flex justify-center mb-2 text-red-500">
                        <div className="p-4 bg-red-50 rounded-full">
                            <AlertTriangle size={40} />
                        </div>
                    </div>
                    <DialogHeader>
                        <DialogTitle className="font-black text-center text-[#002147] text-xl">Delete Course?</DialogTitle>
                        <DialogDescription className="text-center font-medium">
                            Are you sure you want to delete <span className="font-bold text-red-600">{selectedCourse?.code}: {selectedCourse?.name}</span>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
                        <button onClick={() => setIsDeleteOpen(false)} className="w-full py-4 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase">Keep Course</button>
                        <button className="w-full py-4 bg-red-600 text-white rounded-xl font-black text-xs uppercase shadow-lg shadow-red-100">Delete Permanently</button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                    <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="font-black text-[#002147] text-xl">No courses found</h3>
                    <p className="text-slate-400 font-medium">Try adjusting your filters or search terms.</p>
                </div>
            )}
        </div>
    );
}