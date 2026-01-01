/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from 'react';
import {
    ChevronLeft, User, FileText,
    BookText, Users, 
    Loader2, Pencil // Added Pencil
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import StudyModal from '@/components/shared/StudyModal';
import LessonsTab from '@/components/course/LessonsTab';
import AssignmentsTab from '@/components/course/AssignmentsTab';
import StudentsTab from '@/components/course/StudentsTab';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'sonner';

export default function InstructorCourseClassroom() {
    const params = useParams();
    const courseId = params.id as any; 

    const [activeTab, setActiveTab] = useState('Lessons');
    const [openStudyModal, setOpenStudyModal] = useState(false);
    const [activeLesson, setActiveLesson] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    
    // Fetch live data
    const courseData = useQuery(api.courses.getCourseClassroomDetails, { courseId });
    
    // Mutation for editing
    const updateDescription = useMutation(api.courses.updateCourseDescription);

    const handleEditDescription = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUpdating(true);
        const formData = new FormData(e.currentTarget);
        const newDescription = formData.get("description") as string;

        try {
            await updateDescription({ courseId, description: newDescription });
            toast.success("Description updated");
            setEditOpen(false);
        } catch (error) {
            console.log(error)
            toast.error("Failed to update description");
        } finally {
            setIsUpdating(false);
        }
    };

    if (courseData === undefined) return (
        <div className="h-[60vh] flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#002147]" size={40} />
            <p className="mt-4 text-slate-500 font-bold uppercase text-xs tracking-widest">Loading Classroom...</p>
        </div>
    );

    if (courseData === null) return <div className="p-20 text-center font-bold">Course not found.</div>;

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

            <div className="bg-white p-8 rounded-[10px] border border-slate-200 mb-4 shadow-sm relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex-1 w-full">
                        <h1 className="text-3xl font-black text-[#002147] mb-2">
                            {courseData.courseCode}: {courseData.courseName}
                        </h1>
                        
                        <div className="group flex items-start gap-2 mb-4">
                            <p className="text-slate-500 font-medium leading-relaxed">
                                {courseData.description}
                            </p>
                            
                            {/* Edit Description Dialog */}
                            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                                <DialogTrigger asChild>
                                    <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#002147] transition-all">
                                        <Pencil size={14} />
                                    </button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className="font-black text-[#002147]">Edit Course Description</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleEditDescription} className="space-y-4 mt-4">
                                        <textarea 
                                            name="description"
                                            defaultValue={courseData.description}
                                            className="w-full p-4 border rounded-xl h-32 outline-none focus:ring-1 ring-[#002147] text-sm"
                                            placeholder="Enter new course description..."
                                            required
                                        />
                                        <button 
                                            disabled={isUpdating}
                                            className="w-full bg-[#002147] text-white font-black py-3 rounded-[5px] uppercase text-xs flex items-center justify-center gap-2"
                                        >
                                            {isUpdating ? <Loader2 className="animate-spin" size={16}/> : "Save Changes"}
                                        </button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#002147] flex items-center justify-center">
                                <User size={16} className="text-[#fdb813]" />
                            </div>
                            <span className="text-sm font-bold text-[#002147]">{courseData.lecturerName}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs & Content remain the same */}
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
                {activeTab === 'Lessons' && (
                    <LessonsTab
                        lessons={courseData.lessons} 
                        courseId={courseId}
                        setOpenStudyModal={setOpenStudyModal} 
                        setActiveLesson={setActiveLesson}
                    />
                )}
                {activeTab === 'Assignments' && (
                    <AssignmentsTab
                        assignments={courseData.assignments} 
                        courseId={courseId} 
                    />
                )}
                {activeTab === 'Students' && (
                    <StudentsTab courseId={courseId} />
                )}
            </div>

            <StudyModal 
                openModal={openStudyModal} 
                setOpenModal={setOpenStudyModal} 
                initialCourseCode={courseData.courseCode} 
                activeLesson={activeLesson} 
            />
        </div>
    );
}