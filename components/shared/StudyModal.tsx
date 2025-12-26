"use client";
import React, { useState, useEffect } from 'react';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '../ui/dialog';
import { FileText, Send, Sparkles, X, ChevronRight, BookOpen, GraduationCap } from 'lucide-react';

// React PDF Viewer Imports
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { DialogOverlay } from '@radix-ui/react-dialog';


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

    const [messages, setMessages] = useState([
        { role: 'assistant', content: `Hello! I've loaded the materials for **${selectedLesson}**. What part should we dive into first?` },
        { role: 'user', content: "Can you explain the difference between O(n) and O(n log n) in simple terms?" },
        { role: 'assistant', content: "Think of O(n) like reading a book page by page—it takes longer as the book gets bigger. O(n log n) is more like sorting that book using a smart strategy (like Merge Sort). It's slightly more complex than linear, but way faster than checking every page against every other page!" }
    ]);
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (!inputValue.trim()) return;
        setMessages([...messages, { role: 'user', content: inputValue }]);
        setInputValue('');
    };

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogOverlay
                className="fixed inset-0 z-50 bg-black/65 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
            />

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
                        <DialogTitle className="text-2xl font-bold text-[#002147] mb-1">Select Topic</DialogTitle>
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
                        {/* <button onClick={() => setStep('SELECT_COURSE')} className="mt-4 w-full text-xs font-black text-slate-400 uppercase hover:text-[#002147]">Back</button> */}
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
                                        <p className="text-[12px] font-medium text-slate-400 uppercase ">{selectedCourse}</p>
                                    </div>
                                </div>
                                <DialogClose className="flex items-center text-[12px] gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-full font-bold cursor-pointer uppercase tracking-wider">
                                    Exit <X size={16} />
                                </DialogClose>
                            </div>
                            <div className="flex-1 bg-slate-700">
                                <embed src="/material.pdf#toolbar=0" type="application/pdf" width="100%" height="100%" />
                            </div>
                        </div>
                        {/* Right Side: AI Chat */}
                        <div className="flex-1 bg-white flex flex-col shadow-xl z-10 border-l border-slate-200">
                            <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#002147] p-2 rounded-lg">
                                        <Sparkles size={18} className="text-[#fdb813]" />
                                    </div>
                                    <p className="font-black text-sm text-[#002147]">Study Assistant</p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">AI Online</span>
                                </div>
                            </div>

                            {/* Chat Messages Area */}
                            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                            ? 'bg-[#002147] text-white rounded-tr-none'
                                            : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white border-t">
                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Ask a question about this lesson..."
                                        className="w-full p-4 pr-12 bg-slate-100 rounded-2xl text-sm outline-none border-2 border-transparent focus:border-[#fdb813] transition-all"
                                    />
                                    <button
                                        onClick={handleSend}
                                        className="absolute right-2 p-2 bg-[#002147] text-[#fdb813] rounded-xl hover:scale-105 active:scale-95 transition-all"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                                <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">
                                    AI can make mistakes. Verify important formulas.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};



export default StudyModal;