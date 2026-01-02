/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '../ui/dialog';
import { FileText, Send, Sparkles, X, Loader2 } from 'lucide-react';
import { DialogOverlay } from '@radix-ui/react-dialog';
import SelectCourse from '../study-modal/SelectCourse';
import SelectLesson from '../study-modal/SelectLesson';

interface StudyModalProps {
    openModal: boolean;
    setOpenModal: (open: boolean) => void;
    initialCourseCode?: string;
    activeCourse?: any;
    activeLesson?: any;
}

const StudyModal = ({ openModal, setOpenModal, initialCourseCode, activeCourse, activeLesson }: StudyModalProps) => {
    const [step, setStep] = useState<'SELECT_COURSE' | 'SELECT_LESSON' | 'STUDY'>('SELECT_COURSE');
    
    // Initialize with props if provided, otherwise null
    const [selectedLesson, setSelectedLesson] = useState<any>(null);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [inputValue, setInputValue] = useState('');

    // Determine which lesson/storageId to use for the PDF
    const currentLesson = selectedLesson || activeLesson;
    
    const pdfUrl = useQuery(api.courses.getFileUrl, 
        currentLesson?.storageId ? { storageId: currentLesson.storageId } : "skip"
    );

    // Sync state with props and handle step transitions
    useEffect(() => {
        if (openModal) {
            // Use activeCourse/activeLesson from props if they exist, else use state
            const effectiveCourse = activeCourse || selectedCourse;
            const effectiveLesson = activeLesson || selectedLesson;

            if (!effectiveCourse) {
                setStep('SELECT_COURSE');
            } else if (!effectiveLesson) {
                setStep('SELECT_LESSON');
            } else {
                setStep('STUDY');
            }
        }
    }, [openModal, selectedCourse, selectedLesson, activeCourse, activeLesson]);

    const [messages, setMessages] = useState([
        { role: 'assistant', content: `Hello! I've loaded the materials. What part should we dive into first?` }
    ]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        setMessages([...messages, { role: 'user', content: inputValue }]);
        setInputValue('');
    };

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogOverlay className="fixed inset-0 z-50 bg-black/60 " />

            <DialogContent className={`${step === 'STUDY' ? 'max-w-[100vw]! w-screen h-screen' : 'max-w-md'} p-0 gap-0 border-none outline-none overflow-hidden transition-all duration-300`}>
                
                {step === 'SELECT_COURSE' && (
                    <div className="bg-white p-6 rounded-3xl">
                         <DialogTitle className="text-2xl font-black text-[#002147] mb-4">
                            Select a Course
                         </DialogTitle>
                         <SelectCourse selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} />
                    </div>
                )}

                {step === 'SELECT_LESSON' && (
                    <div className="bg-white p-6 rounded-3xl">
                         <DialogTitle className="text-2xl font-black text-[#002147] mb-4">
                            Select a Lesson
                         </DialogTitle>
                         <SelectLesson 
                            courseId={(activeCourse?._id || selectedCourse?._id || selectedCourse?.id)} 
                            selectedLesson={selectedLesson} 
                            setSelectedLesson={setSelectedLesson} 
                        />
                    </div>
                )}

                {step === 'STUDY' && (
                    <div className="flex h-full w-full overflow-hidden">
                        <DialogTitle className="sr-only">Studying {currentLesson?.title}</DialogTitle>
                        
                        {/* Left Side: PDF Viewer */}
                        <div className="flex-[1.5] bg-slate-800 flex flex-col">
                            <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="bg-red-50 p-2 rounded-lg">
                                        <FileText className="text-red-600" size={18} />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-[#002147] text-sm leading-tight">
                                            {currentLesson?.title}
                                        </h2>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                            Week {currentLesson?.week} • {initialCourseCode || activeCourse?.courseCode}
                                        </p>
                                    </div>
                                </div>
                                <DialogClose className="flex items-center text-[12px] gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full font-bold cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors uppercase tracking-wider">
                                    Exit <X size={16} />
                                </DialogClose>
                            </div>

                            <div className="flex-1 bg-slate-700 relative">
                                {!pdfUrl ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                        <Loader2 className="animate-spin mb-2" />
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-50">Loading Document...</p>
                                    </div>
                                ) : (
                                    <iframe 
                                        src={`${pdfUrl}#toolbar=0`} 
                                        className="w-full h-full border-none"
                                        title="Lesson Material"
                                    />
                                )}
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

                            {/* Chat Messages */}
                            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                            msg.role === 'user'
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
                                        className="absolute right-2 p-2 bg-[#002147] text-[#fdb813] rounded-xl hover:scale-105 transition-all"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default StudyModal;