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

const DEPARTMENTS = ["All Departments", "Computer Science", "Mathematics", "Statistics"];

export default function AdminCoursesPage() {
    // Convex Hooks
    const courses = useQuery(api.courses.list);
    const lecturers = useQuery(api.courses.getLecturers);
    const updateCourse = useMutation(api.courses.update);
    const deleteCourse = useMutation(api.courses.remove);

    const [searchTerm, setSearchTerm] = useState("");
    const [deptFilter, setDeptFilter] = useState("All Departments");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal & Selection States
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Filter Logic using Real Data
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
            alert("Failed to update course");
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
            alert("Failed to delete course");
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
            {!courses ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#002147]" /></div>
            ) : (
                <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <div key={course._id} className="bg-white rounded-[2rem] border border-slate-200 p-6 hover:border-[#fdb813] transition-all group relative overflow-hidden shadow-sm">
                            
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

                                <div className="mb-2">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{course.courseCode}</h3>
                                    <h2 className="text-xl font-black text-[#002147] leading-tight group-hover:text-blue-700 transition-colors">
                                        {course.courseName}
                                    </h2>
                                    <p className='text-slate-500 text-[11px] uppercase font-semibold py-1'>{course.department}</p>
                                </div>

                                <div className="space-y-3 mt-auto border-t border-slate-50 pt-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <User size={16} />
                                        </div>
                                        <p className="font-bold text-slate-600">{course.lecturerName}</p>
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
            )}

            {/* --- MODALS --- */}

            {/* Edit Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle className="font-black text-[#002147]">Update {selectedCourse?.courseCode}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4 mt-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400">Course Name</label>
                            <input 
                                name="courseName" 
                                type="text" 
                                className="w-full p-3 border rounded-xl text-sm outline-[#002147]" 
                                defaultValue={selectedCourse?.courseName} 
                                required 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400">Reassign Lecturer</label>
                            <select 
                                name="lecturerId" 
                                className="w-full p-3 border rounded-xl text-sm bg-white outline-[#002147]" 
                                defaultValue={selectedCourse?.lecturerId}
                            >
                                {lecturers?.map((l: any) => (
                                    <option key={l._id} value={l._id}>{l.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button 
                                type="button" 
                                onClick={() => setIsEditOpen(false)} 
                                className="flex-1 bg-slate-100 text-slate-600 font-black py-4 rounded-xl uppercase text-xs"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="flex-1 bg-[#002147] text-white font-black py-4 rounded-xl uppercase text-xs flex justify-center items-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "Save Changes"}
                            </button>
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
                            Are you sure you want to delete <span className="font-bold text-red-600">{selectedCourse?.courseCode}: {selectedCourse?.courseName}</span>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
                        <button 
                            onClick={() => setIsDeleteOpen(false)} 
                            className="w-full py-4 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase"
                        >
                            Keep Course
                        </button>
                        <button 
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="w-full py-4 bg-red-600 text-white rounded-xl font-black text-xs uppercase shadow-lg shadow-red-100 flex justify-center items-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "Delete Permanently"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Empty State */}
            {filteredCourses.length === 0 && courses && (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
                    <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="font-black text-[#002147] text-xl">No courses found</h3>
                    <p className="text-slate-400 font-medium">Try adjusting your filters or search terms.</p>
                </div>
            )}
        </div>
    );
}