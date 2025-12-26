"use client";
import React, { useState } from 'react';
import {
    ChevronLeft,
    User,
    PlayCircle,
    FileText,
    Sparkles,
    MessageCircle,
    ArrowDownToLine,
    Clock,
    CheckCircle2,
    ArrowUpToLine,
} from 'lucide-react';
import Link from 'next/link';
import StudyModal from '@/components/shared/StudyModal';

export default function CourseClassroom() {
    const [activeTab, setActiveTab] = useState('Lessons');

    const [openModal, setOpenModal] = useState(false);

    const course = {
        code: "CSC 401",
        name: "Analysis of Algorithms",
        lecturer: "Prof. A. B. Adeboye",
        description: "A deep dive into computational complexity and algorithmic efficiency."
    };

    const tabs = [
        { name: 'Lessons', icon: <PlayCircle size={18} /> },
        { name: 'Assignments', icon: <FileText size={18} /> },
        { name: 'Intelligent Assistant', icon: <Sparkles size={18} className="text-[#fdb813]" /> },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <Link href="/dashboard/my-courses" className="flex items-center gap-2 text-slate-500 font-bold text-sm mb-6">
                <ChevronLeft size={18} /> Back to My Courses
            </Link>

            {/* Course Identity Header */}
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

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar">
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

            {/* Tab Content Rendering */}
            <div className="">
                {activeTab === 'Lessons' && <LessonsTab openModal={openModal} setOpenModal={setOpenModal} />}
                {activeTab === 'Assignments' && <AssignmentsTab />}
                {activeTab === 'Intelligent Assistant' && <AssistantPreview />}
            </div>
        </div>
    );
}

// --- Sub-components for Tabs ---

function LessonsTab({ openModal, setOpenModal }: { openModal: boolean, setOpenModal: React.Dispatch<React.SetStateAction<boolean>> }) {
    // Local state to know which topic was clicked
    const [activeTopic, setActiveTopic] = useState("Algorithmic Complexity");

    const handleOpen = (topic: string) => {
        setActiveTopic(topic);
        setOpenModal(true);
    };

    return (
        <div className="space-y-2">
            {[1, 2, 3].map((i) => {
                const topicName = i === 1 ? "Algorithmic Complexity" : i === 2 ? "Big O Notation" : "Sorting Algorithms";
                return (
                    <div key={i} className="bg-white px-3 py-4 rounded-xl border border-slate-100 flex items-center justify-between hover:border-[#fdb813] transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-50 p-3 rounded-lg text-blue-600 group-hover:bg-[#002147] group-hover:text-white transition-colors">
                                <PlayCircle size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-[#002147]">Week {i}: {topicName}</p>
                                <p className="text-xs text-slate-400 font-semibold uppercase">PDF Material • 2.4 MB</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-4 mr-1'>
                            <button
                                onClick={() => handleOpen(topicName)}
                                className="text-[10px] cursor-pointer hover:opacity-80 font-black uppercase text-[#002147] bg-[#fdb813] px-3 py-2 rounded"
                            >
                                Open Material
                            </button>
                            <ArrowDownToLine size={18} className='text-[#002147]' />
                        </div>
                    </div>
                );
            })}

            {/* ONLY ONE MODAL INSTANCE OUTSIDE THE LOOP */}
            <StudyModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                initialCourseCode='CSC 401'
                initialLessonTopic={activeTopic}
            />
        </div>
    );
}

function AssistantPreview() {
    return (
        <div className="bg-slate-900 rounded-3xl p-8 text-center text-white border-4 border-slate-800">
            <Sparkles size={48} className="text-[#fdb813] mx-auto mb-6" />
            <h3 className="text-xl font-black mb-2 tracking-tight text-white">Need Contextual Help?</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 font-medium leading-relaxed">
                My Intelligent Assistant can help you explain difficult concepts from this course&apos;s specific lecture notes.
            </p>
            <button className="px-8 py-3 bg-[#fdb813] text-[#002147] rounded-xl font-black text-sm hover:scale-105 transition-transform flex items-center gap-2 mx-auto">
                <MessageCircle size={18} /> Launch Course Tutor
            </button>
        </div>
    );
}

function AssignmentsTab() {
    const assignments = [
        {
            id: "asgn-1",
            title: "Big O Analysis Exercise",
            dueDate: "Oct 24, 2024",
            status: "Pending",
            marks: "10",
            description: "Analyze the time complexity of the provided Python functions. Submit as a PDF."
        },
        {
            id: "asgn-2",
            title: "Sorting Algorithm Implementation",
            dueDate: "Nov 02, 2024",
            status: "Submitted",
            marks: "20",
            description: "Implement Merge Sort and Quick Sort. Compare their performance on random arrays."
        }
    ];

    return (
        <div className="space-y-6">
            {assignments.map((asgn) => (
                <div key={asgn.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${asgn.status === 'Submitted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {asgn.status}
                                </span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Worth {asgn.marks} Marks
                                </span>
                            </div>
                            <h3 className="text-lg font-black text-[#002147] mb-2">{asgn.title}</h3>
                            <p className="text-sm text-slate-500 font-medium mb-4">{asgn.description}</p>

                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                <span className="flex items-center gap-1.5"><Clock size={14} /> Due {asgn.dueDate}</span>
                                <span className="flex items-center gap-1.5"><FileText size={14} /> PDF / DOCX Only</span>
                            </div>
                        </div>

                        <div className="w-full md:w-auto shrink-0">
                            {asgn.status === 'Submitted' ? (
                                <button className="w-full md:w-auto px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 cursor-default">
                                    <CheckCircle2 size={16} /> Already Submitted
                                </button>
                            ) : (
                                <Link
                                    href={`/dashboard/my-courses/csc401/submit/${asgn.id}`}
                                    className="w-full md:w-auto px-6 py-3 bg-[#002147] text-white rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 hover:bg-[#003366] transition-all"
                                >
                                    <ArrowUpToLine size={16} /> Submit Assignment
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ContentPlaceholder({ title }: { title: string }) {
    return (
        <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl">
            <p className="text-slate-400 font-bold italic">{title} module coming soon...</p>
        </div>
    );
}


