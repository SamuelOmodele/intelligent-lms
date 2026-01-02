/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BookOpen, ChevronRight, Loader2 } from 'lucide-react';

const SelectCourse = ({ setSelectedCourse }: any) => {
    // Replace this with your specific "getEnrolledCourses" query if you have one

    const userId = localStorage.getItem('userId');
    const courses = useQuery(api.courses.getStudentCourses, 
        userId ? { studentId: userId as any } : "skip"
    );

    if (courses === undefined) {
        return (
            <div className="flex items-center justify-center py-10">
                <Loader2 className="animate-spin text-slate-300" />
            </div>
        );
    }

    return (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {courses.map((course: any) => (
                <button
                    key={course._id}
                    onClick={() => setSelectedCourse({ id: course._id, code: course.courseCode })}
                    className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 hover:border-[#fdb813] hover:bg-amber-50/50 transition-all group text-left"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-100 p-2 rounded-xl group-hover:bg-[#002147] group-hover:text-white transition-colors">
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <p className="font-black text-[#002147]">{course.courseCode}</p>
                            <p className="text-xs text-slate-500 font-medium">{course.courseName}</p>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-[#002147]" />
                </button>
            ))}
        </div>
    );
};

export default SelectCourse;