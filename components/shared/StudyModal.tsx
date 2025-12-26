"use client";
import React, { useState, useEffect } from 'react';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '../ui/dialog';
import { Bot, FileText, Send, Sparkles, X, ChevronRight, BookOpen, GraduationCap } from 'lucide-react';

interface StudyModalProps {
    openModal: boolean;
    setOpenModal: (open: boolean) => void;
    initialCourseCode?: string;
    initialLessonTopic?: string;
}

const COURSES = [
    { code: "CSC 401", name: "Analysis of Algorithms" },
    { code: "CSC 415", name: "Machine Learning" },
    { code: "MAT 211", name: "Linear Algebra" }
];

const LESSONS: Record<string, string[]> = {
    "CSC 401": ["Big O Notation", "Sorting Algorithms", "Dynamic Programming", "Algorithmic Complexity"],
    "CSC 415": ["Linear Regression", "Neural Networks", "Decision Trees"],
    "MAT 211": ["Matrix Multiplication", "Eigenvalues", "Vector Spaces"]
};

const StudyModal = ({ openModal, setOpenModal, initialCourseCode, initialLessonTopic }: StudyModalProps) => {
    const [step, setStep] = useState<'SELECT_COURSE' | 'SELECT_LESSON' | 'STUDY'>('SELECT_COURSE');
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

    // Sync state when modal opens or props change
    useEffect(() => {
        if (openModal) {
            if (initialCourseCode && initialLessonTopic) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setSelectedCourse(initialCourseCode);
                setSelectedLesson(initialLessonTopic);
                setStep('STUDY');
            } else if (initialCourseCode) {
                setSelectedCourse(initialCourseCode);
                setStep('SELECT_LESSON');
            } else {
                setStep('SELECT_COURSE');
            }
        }
    }, [openModal, initialCourseCode, initialLessonTopic]);

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogContent className={`${step === 'STUDY' ? 'max-w-[100vw]! w-screen h-screen' : 'max-w-md'} p-0 gap-0 border-none outline-none overflow-hidden transition-all duration-300`}>
                
                {/* STEP 1: SELECT COURSE */}
                {step === 'SELECT_COURSE' && (
                    <div className="bg-white p-6 rounded-3xl">
                        <DialogTitle className="text-2xl font-black text-[#002147] mb-4">Select a Course</DialogTitle>
                        <div className="space-y-3">
                            {COURSES.map((c) => (
                                <button key={c.code} onClick={() => { setSelectedCourse(c.code); setStep('SELECT_LESSON'); }} className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 hover:border-[#fdb813] hover:bg-amber-50 transition-all group">
                                    <div className="flex items-center gap-3 text-left">
                                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white text-[#002147]"><GraduationCap size={20} /></div>
                                        <div><p className="font-bold text-[#002147]">{c.code}</p><p className="text-xs text-slate-500 font-medium">{c.name}</p></div>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-300 group-hover:text-[#002147]" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 2: SELECT LESSON */}
                {step === 'SELECT_LESSON' && (
                    <div className="bg-white p-6 rounded-3xl">
                        <DialogTitle className="text-2xl font-black text-[#002147] mb-1">Select Topic</DialogTitle>
                        <p className="text-sm text-slate-400 font-bold uppercase mb-4 tracking-wider">{selectedCourse}</p>
                        <div className="space-y-3">
                            {(selectedCourse ? LESSONS[selectedCourse] : []).map((topic) => (
                                <button key={topic} onClick={() => { setSelectedLesson(topic); setStep('STUDY'); }} className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 hover:border-[#fdb813] hover:bg-amber-50 transition-all group text-left">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white text-[#002147]"><BookOpen size={20} /></div>
                                        <p className="font-bold text-[#002147]">{topic}</p>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-300 group-hover:text-[#002147]" />
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setStep('SELECT_COURSE')} className="mt-4 w-full text-xs font-black text-slate-400 uppercase hover:text-[#002147]">Back</button>
                    </div>
                )}

                {/* STEP 3: STUDY VIEW */}
                {step === 'STUDY' && (
                    <div className="flex h-full w-full overflow-hidden">
                        <DialogTitle className="sr-only">Studying {selectedLesson}</DialogTitle>
                        {/* Left Side: PDF */}
                        <div className="flex-[1.5] bg-slate-800 flex flex-col">
                            <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <FileText className="text-red-600" size={18} />
                                    <div>
                                        <h2 className="font-bold text-[#002147] text-sm">{selectedLesson}</h2>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{selectedCourse}</p>
                                    </div>
                                </div>
                                <DialogClose className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                    Exit <X size={16} />
                                </DialogClose>
                            </div>
                            <div className="flex-1 bg-slate-700">
                                <embed src="/material.pdf#toolbar=0" type="application/pdf" width="100%" height="100%" />
                            </div>
                        </div>
                        {/* Right Side: AI Chat */}
                        <div className="flex-1 bg-white flex flex-col shadow-xl z-10">
                            <div className="p-4 border-b bg-slate-50 flex items-center gap-3">
                                <div className="bg-[#002147] p-2 rounded-lg"><Sparkles size={18} className="text-[#fdb813]" /></div>
                                <p className="font-black text-sm text-[#002147]">Study Assistant</p>
                            </div>
                            <div className="flex-1 p-4"><div className="bg-slate-100 p-4 rounded-2xl text-sm leading-relaxed text-slate-700">How can I help you understand <b>{selectedLesson}</b>?</div></div>
                            <div className="p-4 border-t"><input type="text" placeholder="Ask anything..." className="w-full p-4 bg-slate-100 rounded-xl text-sm outline-none border-2 border-transparent focus:border-[#fdb813]" /></div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default StudyModal;