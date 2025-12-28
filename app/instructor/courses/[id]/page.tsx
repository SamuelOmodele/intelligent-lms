/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from 'react';
import {
    ChevronLeft, User, FileText, ArrowDownToLine, Clock, ArrowUpToLine,
    BookText, Users, MoreVertical, Mail, Plus, ShieldAlert, Eye, Upload
} from 'lucide-react';
import Link from 'next/link';
import StudyModal from '@/components/shared/StudyModal';

// --- SHADCN COMPONENTS (Mocked or Imported) ---
// Note: Ensure you have these installed via shadcn-ui CLI
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function InstructorCourseClassroom() {
    const [activeTab, setActiveTab] = useState('Lessons');
    const [openStudyModal, setOpenStudyModal] = useState(false);

    const course = {
        code: "CSC 401",
        name: "Analysis of Algorithms",
        lecturer: "Prof. A. B. Adeboye",
        description: "A deep dive into computational complexity and algorithmic efficiency."
    };

    const tabs = [
        { name: 'Lessons', icon: <BookText size={18} /> },
        { name: 'Assignments', icon: <FileText size={18} /> },
        { name: 'Students', icon: <Users size={18} /> },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <Link href="/instructor/courses" className="flex items-center gap-2 text-slate-500 font-bold text-sm mb-6 hover:text-[#002147] transition-colors">
                <ChevronLeft size={18} /> Back to Courses
            </Link>

            <div className="bg-white p-8 rounded-[10px] border border-slate-200 mb-4 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex-1">
                        <h1 className="text-3xl font-black text-[#002147] mb-2">{course.code}: {course.name}</h1>
                        <p className="text-slate-500 font-medium mb-4">{course.description}</p>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#002147] flex items-center justify-center">
                                <User size={16} className="text-[#fdb813]" />
                            </div>
                            <span className="text-sm font-bold text-[#002147]">{course.lecturer}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1 border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all whitespace-nowrap border-b-2 ${activeTab === tab.name
                            ? 'border-[#002147] text-[#002147]'
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        {tab.icon}
                        {tab.name}
                    </button>
                ))}
            </div>

            <div className="animate-in fade-in duration-500">
                {activeTab === 'Lessons' && <LessonsTab setOpenStudyModal={setOpenStudyModal} openStudyModal={openStudyModal} />}
                {activeTab === 'Assignments' && <AssignmentsTab />}
                {activeTab === 'Students' && <StudentsTab />}
            </div>
        </div>
    );
}

// --- LESSONS TAB ---
function LessonsTab({ setOpenStudyModal, openStudyModal }: any) {
    const [activeTopic, setActiveTopic] = useState("Algorithmic Complexity");

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="flex items-center gap-2 bg-[#002147] text-white px-5 py-2.5 rounded-[5px] cursor-pointer font-black text-xs uppercase hover:bg-[#003366] transition-all">
                            <Plus size={18} /> Create New Lesson
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                            <DialogTitle className="font-black text-[#002147]">Create New Lesson</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4 mt-4">
                            <div>
                                <label className="text-xs font-black uppercase text-slate-400">Lesson Title</label>
                                <input type="text" className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 ring-blue-100" placeholder="e.g. Graph Theory Part 1" />
                            </div>
                            <div>
                                <label className="text-xs font-black uppercase text-slate-400">Week Number</label>
                                <input type="number" className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 ring-blue-100" placeholder="4" />
                            </div>
                            <div className="border-2 border-dashed border-slate-200 p-6 rounded-2xl text-center">
                                <Upload className="mx-auto text-slate-300 mb-2" />
                                <p className="text-xs font-bold text-slate-500 mb-2">Upload Lesson PDF/Material</p>
                                <input type="file" className="text-xs text-slate-400" />
                            </div>
                            <button className="w-full bg-[#fdb813] text-[#002147] font-black py-3 rounded-[5px] uppercase text-xs">Publish Lesson</button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white px-4 py-5 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-[#fdb813] transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><BookText size={20} /></div>
                        <div>
                            <p className="font-black text-[#002147]">Week {i}: Topic {i}</p>
                            <p className="text-xs text-slate-400 font-bold uppercase">PDF Material • 2.4 MB</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <button onClick={() => { setActiveTopic(`Week ${i} Topic`); setOpenStudyModal(true); }} className="text-[10px] font-black uppercase text-[#002147] bg-[#fdb813] px-3 py-2 rounded-lg">Preview</button>
                        <ArrowDownToLine size={20} className='text-slate-400 hover:text-[#002147] cursor-pointer' />
                    </div>
                </div>
            ))}
            <StudyModal openModal={openStudyModal} setOpenModal={setOpenStudyModal} initialCourseCode='CSC 401' initialLessonTopic={activeTopic} />
        </div>
    );
}

// --- ASSIGNMENTS TAB ---
function AssignmentsTab() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    const handleEdit = () => {
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setModalMode('create');
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-4">
            {/* Control the Dialog with the open and onOpenChange props */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <div className="flex justify-end">
                    <button 
                        onClick={handleCreate}
                        className="flex items-center gap-2 bg-[#002147] text-white px-5 py-2.5 rounded-[5px] font-black text-xs uppercase hover:bg-[#003366] transition-all"
                    >
                        <Plus size={18} /> Create Assignment
                    </button>
                </div>

                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle className="font-black text-[#002147]">
                            {modalMode === 'create' ? 'New Assignment' : 'Edit Assignment'}
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Title</label>
                            <input type="text" className="w-full mt-1 p-3 border rounded-xl text-sm outline-none focus:ring-2 ring-blue-50" placeholder="Assignment Title" />
                        </div>
                        
                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Instructions</label>
                            <textarea className="w-full mt-1 p-3 border rounded-xl text-sm h-24 outline-none focus:ring-2 ring-blue-50" placeholder="Instructions..." />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Due Date</label>
                                <input type="date" className="w-full mt-1 p-3 border rounded-xl text-sm outline-none focus:ring-2 ring-blue-50" />
                            </div>
                            <div className="w-24">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Marks</label>
                                <input type="number" className="w-full mt-1 p-3 border rounded-xl text-sm outline-none focus:ring-2 ring-blue-50" placeholder="10" />
                            </div>
                        </div>

                        <button className="w-full bg-[#002147] text-white font-black py-4 rounded-[5px] uppercase text-xs mt-2 hover:bg-[#003366] transition-all">
                            {modalMode === 'create' ? 'Create & Notify Students' : 'Update Assignment'}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Assignment Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex justify-between items-center group hover:border-[#fdb813] transition-all">
                <div>
                    <span className="text-[10px] font-black px-2 py-1 rounded-lg uppercase bg-amber-100 text-amber-700 inline-block mb-2">Pending</span>
                    <h3 className="text-lg font-black text-[#002147]">Big O Analysis Exercise</h3>
                    <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tight flex items-center gap-1.5">
                        <Clock size={14} /> Due Oct 24, 2024
                    </p>
                </div>
                
                {/* Edit Button triggers the handleEdit function */}
                <button 
                    onClick={handleEdit}
                    className="px-6 py-2.5 bg-slate-100 text-[#002147] rounded-xl font-black text-xs uppercase hover:bg-slate-200 transition-colors"
                >
                    Edit
                </button>
            </div>
        </div>
    );
}

// --- STUDENTS TAB COMPONENT ---
function StudentsTab() {

    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [blockOpen, setBlockOpen] = useState(false);


    const enrolledStudents = [
        { id: "190201", name: "Olawale Adeleke", email: "o.adeleke@stu.ui.edu.ng", level: "400L", matric: "190201", department: 'Computer Science', progress: "85%" },
        { id: "190452", name: "Amina Yusuf", email: "a.yusuf@stu.ui.edu.ng", level: "400L", matric: "190452", department: 'Computer Science', progress: "92%" },
        { id: "190331", name: "Chidi Okafor", email: "c.okafor@stu.ui.edu.ng", level: "400L", matric: "190331", department: 'Computer Science', progress: "40%" },
        { id: "190112", name: "Tunde Bakare", email: "t.bakare@stu.ui.edu.ng", level: "400L", matric: "190112", department: 'Computer Science', progress: "77%" },
    ];

    return (
        <div className="bg-white rounded-[10px] border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-black text-[#002147] uppercase tracking-wider text-sm">Enrolled Students ({enrolledStudents.length})</h3>
                <button className="flex items-center gap-2 text-xs font-black text-[#002147] bg-white border px-3 py-2 rounded-lg shadow-sm hover:bg-slate-50 transition-all">
                    <Mail size={14} /> Email All Students
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Matric No.</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Level</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {enrolledStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-[#002147] flex items-center justify-center font-bold text-xs border border-blue-100">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#002147] text-sm">{student.name}</p>
                                            <p className="text-[11px] text-slate-400 font-medium">{student.email}</p>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-xs font-bold text-slate-600">{student.matric}</td>
                                <td className="px-6 py-4 text-xs font-bold text-slate-600">{student.level}</td>
                                <td className="px-6 py-4 text-xs font-bold text-slate-600">
                                    {student.department}
                                </td>

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
                        ))}
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
                                <div className="w-15 h-15 bg-[#002147] text-[#fdb813] rounded-full flex items-center justify-center text-xl font-black">{selectedStudent.name.charAt(0)}</div>
                                <div>
                                    <h3 className="font-black text-[#002147]">{selectedStudent.name}</h3>
                                    <p className="text-xs font-bold text-slate-500 uppercase">{selectedStudent.email} <br /> {selectedStudent.matric}</p>
                                    {/* <p className="text-xs font-bold text-slate-500 uppercase"></p> */}
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
