"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {
    ChevronLeft,
    CheckCircle2,
    User,
    BookOpen,
    GraduationCap,
    ShieldCheck
} from 'lucide-react';

export default function CourseDetails() {
    const [isEnrolled, setIsEnrolled] = useState(false);

    // Example course data - in a real app, you'd fetch this based on the ID
    const course = {
        code: "CSC 401",
        name: "Analysis of Algorithms",
        description: "This course provides an exhaustive exploration of the design and analysis of efficient algorithms. It covers fundamental techniques including divide-and-conquer, dynamic programming, and greedy approaches. Students will learn to evaluate algorithmic complexity using asymptotic notation and apply these principles to solve complex computational problems relevant to modern software engineering and data science.",
        units: "3.0 Units",
        level: "400 Level",
        lecturer: "Prof. A. B. Adeboye",
        designation: "Senior Lecturer, Computer Science Dept"
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Navigation Header */}
            <Link
                href="/dashboard/all-courses"
                className="inline-flex items-center gap-2 text-slate-500 hover:text-[#002147] font-bold text-sm mb-8 transition-colors group"
            >
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to Course Catalog
            </Link>

            <div className="bg-white rounded-[10px] border border-slate-200 overflow-hidden shadow-sm">
                {/* Course Header Banner */}
                <div className="bg-[#002147] p-8 md:p-12 text-white relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
                        <GraduationCap size={240} />
                    </div>

                    <div className="relative z-10">
                        <span className="bg-[#fdb813] text-[#002147] px-3 py-1 rounded-md text-xs font-black uppercase tracking-widest mb-4 inline-block">
                            {course.level}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black mb-2">{course.code}</h1>
                        <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl">
                            {course.name}
                        </p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-8 md:p-12">
                    <div className="grid md:grid-cols-3 gap-12">

                        {/* Left: Description */}
                        <div className="md:col-span-2">
                            <h3 className="text-[#002147] font-black uppercase tracking-tight text-sm mb-4 flex items-center gap-2">
                                <BookOpen size={18} className="text-[#fdb813]" />
                                Course Description
                            </h3>
                            <p className="text-slate-600 leading-relaxed text-lg italic">
                                &quot;{course.description}&quot;
                            </p>

                        </div>

                        {/* Right: Lecturer & Action */}
                        <div className="space-y-8">
                            {/* Lecturer Info */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Instructor</h4>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#002147] flex items-center justify-center border-2 border-[#fdb813]">
                                        <User size={24} className="text-[#fdb813]" />
                                    </div>
                                    <div>
                                        <p className="font-black text-[#002147] text-sm">{course.lecturer}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">{course.designation}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Enrollment Box */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <span className="text-slate-500 font-bold text-sm">Course Credits</span>
                                    <span className="text-[#002147] font-black">{course.units}</span>
                                </div>

                                <button
                                    onClick={() => setIsEnrolled(true)}
                                    disabled={isEnrolled}
                                    className={`w-full py-4 rounded-xl font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${isEnrolled
                                        ? 'bg-emerald-500 text-white cursor-default'
                                        : 'bg-[#002147] text-white hover:bg-[#003366] shadow-blue-900/20'
                                        }`}
                                >
                                    {isEnrolled ? (
                                        <><CheckCircle2 size={18} /> Course Enrolled</>
                                    ) : (
                                        'Enroll Now'
                                    )}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <footer className="mt-8 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    University of Ibadan Learning Management System • Session 2024/2025
                </p>
            </footer>
        </div>
    );
}