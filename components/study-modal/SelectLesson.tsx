/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PlayCircle, Loader2, } from 'lucide-react';

const SelectLesson = ({ setSelectedLesson, courseId }: any) => {
    const lessons = useQuery(api.lessons.getLessonsByCourse, { courseId });
    const courseData = useQuery(api.courses.getCourseDetails, { courseId });

    if (lessons === undefined) {
        return (
            <div className="flex items-center justify-center py-10">
                <Loader2 className="animate-spin text-slate-300" />
            </div>
        );
    }

    return (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            <p className='text-sm font-bold text-slate-600'>{courseData?.courseCode} - {courseData?.courseName}</p>
            
            {lessons.length === 0 ? (
                <p className="text-center py-10 text-slate-400 text-sm font-medium italic">No lessons found for this course.</p>
            ) : (
                lessons.map((lesson: any) => (
                    <button
                        key={lesson._id}
                        onClick={() => setSelectedLesson(lesson)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-[#002147] transition-all group text-left"
                    >
                        <div className="relative">
                            <PlayCircle size={32} className="text-slate-200 group-hover:text-[#fdb813] transition-colors" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="bg-slate-100 text-[10px] font-black px-1.5 py-0.5 rounded text-slate-500 uppercase">
                                    Week {lesson.week}
                                </span>
                            </div>
                            <p className="font-black text-[#002147] leading-tight">{lesson.title}</p>
                        </div>
                    </button>
                ))
            )}
        </div>
    );
};

export default SelectLesson;