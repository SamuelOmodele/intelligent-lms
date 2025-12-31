/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from 'react';
import {
    Search,
    Plus,
    BookOpen,
    User,
    MoreVertical,
    Building2,
    ArrowRight,
    Edit,
    Trash2,
    AlertTriangle,
    Loader2
} from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateCourseModal from '@/components/modals/CreateCourseModal';

// Convex Imports
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function AdminCoursesPage() {
    // --- Convex Hooks ---
    const courses = useQuery(api.courses.list);
    const departments = useQuery(api.departments.list); // Dynamic departments
    const lecturers = useQuery(api.courses.getLecturers);
    const updateCourse = useMutation(api.courses.update);
    const deleteCourse = useMutation(api.courses.remove);

    // --- Local State ---
    const [searchTerm, setSearchTerm] = useState("");
    const [deptFilter, setDeptFilter] = useState("All Departments");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal & Selection States
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // --- Filter Logic ---
    const filteredCourses = courses?.filter(course => {
        const matchesSearch = 
            course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesDept = deptFilter === "All Departments" || course.department === deptFilter;
        return matchesSearch && matchesDept;
    }) || [];

    // --- Action Handlers ---
    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        
        try {
            await updateCourse({
                id: selectedCourse._id,
                courseName: formData.get("courseName") as string,
                lecturerId: formData.get("lecturerId") as Id<"users">,
            });
            setIsEditOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        try {
            await deleteCourse({ id: selectedCourse._id });
            setIsDeleteOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#002147]">Course Registry</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage institutional curriculum and assignments.</p>
                </div>

                <CreateCourseModal>
                    <button className="flex items-center gap-2 bg-[#002147] text-white px-6 py-3 rounded-[5px] font-black text-xs uppercase hover:bg-[#003366] transition-all cursor-pointer shadow-xs shadow-blue-900/20">
                        <Plus size={18} /> Add New Course
                    </button>
                </CreateCourseModal>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search code or course name..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-blue-100 transition-all font-medium text-[#002147]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Building2 size={18} className="text-slate-400" />
                    <select
                        className="bg-slate-50 border-none px-4 py-3 rounded-xl text-sm font-bold text-[#002147] outline-none cursor-pointer min-w-[160px]"
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                    >
                        <option value="All Departments">All Departments</option>
                        {departments?.map((dept) => (
                            <option key={dept._id} value={dept.name}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Course Grid */}
            {!courses ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-[#002147]" size={40} />
                    <p className="text-slate-400 font-bold animate-pulse">Syncing Registry...</p>
                </div>
            ) : (
                <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <div key={course._id} className="bg-white rounded-[2rem] border border-slate-200 p-6 hover:border-[#fdb813] transition-all group relative overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50">
                            
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
                                    <span className="px-3 py-1 rounded-full uppercase bg-emerald-50 text-emerald-600">
                                        Active
                                    </span>
                                </div>

                                <div className="mb-2">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{course.courseCode}</h3>
                                    <h2 className="text-xl font-black text-[#002147] leading-tight group-hover:text-blue-700 transition-colors">
                                        {course.courseName}
                                    </h2>
                                    <p className='text-slate-500 text-[11px] uppercase font-bold py-1 flex items-center gap-1.5'>
                                        <Building2 size={12} className="text-[#fdb813]" /> {course.department}
                                    </p>
                                </div>

                                <div className="space-y-3 mt-auto border-t border-slate-50 pt-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black text-slate-400 leading-none mb-1">Instructor</p>
                                            <p className="font-bold text-slate-600">{course.lecturerName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                            <BookOpen size={14} />
                                            <span>{course.students || 0} Enrolled</span>
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
            )}

            {/* --- MODALS --- */}

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[550px] rounded-[2rem]">
                    <DialogHeader>
                        <DialogTitle className="font-black text-[#002147] text-xl">Update {selectedCourse?.courseCode}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4 mt-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Course Title</label>
                            <input 
                                name="courseName" 
                                type="text" 
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-[#002147]" 
                                defaultValue={selectedCourse?.courseName} 
                                required 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Reassign Lecturer</label>
                            <select 
                                name="lecturerId" 
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold bg-white outline-[#002147] cursor-pointer" 
                                defaultValue={selectedCourse?.lecturerId}
                            >
                                {lecturers?.map((l: any) => (
                                    <option key={l._id} value={l._id}>{l.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button 
                                type="button" 
                                onClick={() => setIsEditOpen(false)} 
                                className="flex-1 bg-slate-100 text-slate-600 font-black py-4 rounded-2xl uppercase text-xs hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="flex-1 bg-[#002147] text-white font-black py-4 rounded-2xl uppercase text-xs flex justify-center items-center gap-2 hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/10"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[400px] text-center rounded-[2rem]">
                    <div className="flex justify-center mb-2 text-red-500">
                        <div className="p-4 bg-red-50 rounded-full">
                            <AlertTriangle size={40} />
                        </div>
                    </div>
                    <DialogHeader>
                        <DialogTitle className="font-black text-center text-[#002147] text-xl">Delete Course?</DialogTitle>
                        <DialogDescription className="text-center font-medium px-4">
                            You are about to remove <span className="font-bold text-red-600">{selectedCourse?.courseCode}</span>. This will affect student enrollments and records.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
                        <button 
                            onClick={() => setIsDeleteOpen(false)} 
                            className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase shadow-lg shadow-red-100 flex justify-center items-center gap-2 hover:bg-red-700 transition-all"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "Confirm Delete"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Empty State */}
            {filteredCourses.length === 0 && courses && (
                <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen size={32} className="text-slate-200" />
                    </div>
                    <h3 className="font-black text-[#002147] text-xl">No courses matched</h3>
                    <p className="text-slate-400 font-medium max-w-xs mx-auto mt-2">Try changing your department filter or refining your search query.</p>
                </div>
            )}
        </div>
    );
}