/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Eye, Loader2, MoreVertical, ShieldAlert, Search } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Id } from '@/convex/_generated/dataModel';


// --- STUDENTS TAB ---
function StudentsTab({ courseId }: { courseId: Id<"courses"> }) {
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [blockOpen, setBlockOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch enrolled students for this course via Convex
    const enrolledStudents = useQuery(api.lecturers.getEnrolledStudents, { courseId });

    if (!enrolledStudents) return <div className="p-10 text-center"><Loader2 className="animate-spin inline mr-2" /> Loading Students...</div>;

    // Frontend filtering logic
    const filteredStudents = enrolledStudents.filter((student: any) => 
        student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.matricNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white rounded-[10px] border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
                <h3 className="font-black text-[#002147] uppercase tracking-wider text-sm">
                    Enrolled Students ({filteredStudents.length})
                </h3>
                
                {/* Search Box Replacement */}
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                        type="text"
                        placeholder="Search name or matric..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none focus:ring-1 ring-[#002147] transition-all"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Matric No.</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Level</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student: any) => (
                                <tr key={student._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#002147] flex items-center justify-center font-bold text-xs border border-blue-100">
                                                {student.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#002147] text-sm">{student.name}</p>
                                                <p className="text-[11px] text-slate-400 font-medium">{student.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-600">{student.matricNumber}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-600">{student.level}</td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="p-2 hover:bg-slate-100 rounded-lg outline-none"><MoreVertical size={16} /></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl p-1 w-40">
                                                <DropdownMenuItem onClick={() => { setSelectedStudent(student); setViewOpen(true); }} className="flex items-center gap-2 text-xs font-bold p-2 cursor-pointer">
                                                    <Eye size={14} /> View Student
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => { setSelectedStudent(student); setBlockOpen(true); }} className="flex items-center gap-2 text-xs font-bold p-2 text-red-600 cursor-pointer">
                                                    <ShieldAlert size={14} /> Block Student
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                                    No students found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Student Modal */}
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle className="font-black text-[#002147]">Student Profile</DialogTitle></DialogHeader>
                    {selectedStudent && (
                        <div className="space-y-4 py-4">
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                                <div className="w-15 h-15 bg-[#002147] text-[#fdb813] rounded-full flex items-center justify-center text-xl font-black">{selectedStudent.name?.charAt(0)}</div>
                                <div>
                                    <h3 className="font-black text-[#002147]">{selectedStudent.name}</h3>
                                    <p className="text-xs font-bold text-slate-500 uppercase">{selectedStudent.email} <br /> {selectedStudent.matricNumber}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="p-3 border rounded-xl"><p className="text-[10px] font-black text-slate-400 uppercase">Department</p><p className="font-bold text-[#002147]">{selectedStudent.department}</p></div>
                                <div className="p-3 border rounded-xl"><p className="text-[10px] font-black text-slate-400 uppercase">Level</p><p className="font-bold text-[#002147]">{selectedStudent.level}</p></div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Block Student Modal */}
            <Dialog open={blockOpen} onOpenChange={setBlockOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle className="font-black text-red-600 flex items-center gap-2"><ShieldAlert /> Restrict Student</DialogTitle></DialogHeader>
                    <p className="text-sm text-slate-500 font-medium">Are you sure you want to block <span className="font-black text-[#002147]">{selectedStudent?.name}</span>? They will no longer be able to access materials for this specific course.</p>
                    <div className="flex gap-3 mt-4">
                        <button onClick={() => setBlockOpen(false)} className="flex-1 py-3 text-xs font-black uppercase text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                        <button className="flex-1 py-3 text-xs font-black uppercase text-white bg-red-600 rounded-xl">Confirm Block</button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default StudentsTab;