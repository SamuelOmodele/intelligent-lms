/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
    ChevronLeft,
    CheckCircle2,
    User,
    BookOpen,
    GraduationCap,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function CourseDetails() {
    const params = useParams();
    const courseId = params.id as any;

    // Inside your CourseDetails component
    const [userId, setUserId] = React.useState<string | null>(null);

    React.useEffect(() => {
        // Sync localStorage to state on mount
        setUserId(localStorage.getItem('userId'));
    }, []);

    const course = useQuery(api.courses.getCourseDetails, { courseId });

    // Only run the enrollment query if we actually have a userId
    const enrollment = useQuery(
        api.courses.checkEnrollment,
        userId ? { courseId, studentId: userId } : "skip"
    );

    const enroll = useMutation(api.courses.enrollInCourse);

    const handleEnrollment = async () => {
        if (!userId) {
            toast.error("User session not found. Please login.");
            return;
        }
        try {
            await enroll({ courseId, studentId: userId });
            toast.success(`Successfully enrolled in ${course?.courseCode}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to enroll in course");
        }
    };

    if (course === undefined || enrollment === undefined) return (
        <div className="h-[60vh] flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#002147]" size={40} />
            <p className="mt-4 text-slate-500 font-bold uppercase text-xs tracking-widest">Loading Course Details...</p>
        </div>
    );

    if (course === null) return <div className="p-20 text-center font-bold">Course not found.</div>;

    const isEnrolled = !!enrollment;

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
                            {course.department}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black mb-2">{course.courseCode}</h1>
                        <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl">
                            {course.courseName}
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
                                        <p className="font-black text-[#002147] text-sm">{course.lecturerName}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Enrollment Box */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <span className="text-slate-500 font-bold text-sm">Course Credits</span>
                                    <span className="text-[#002147] font-black">{course.unit} Units</span>
                                </div>

                                <button
                                    onClick={handleEnrollment}
                                    disabled={isEnrolled}
                                    className={`w-full py-4 rounded-xl font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${isEnrolled
                                        ? 'bg-emerald-500 text-white cursor-default shadow-emerald-900/10'
                                        : 'bg-[#002147] text-white hover:bg-[#003366] shadow-blue-900/20 active:scale-[0.98]'
                                        }`}
                                >
                                    {isEnrolled ? (
                                        <><CheckCircle2 size={18} /> Course Enrolled</>
                                    ) : (
                                        'Enroll Now'
                                    )}
                                </button>

                                {isEnrolled && (
                                    <p className="text-center text-[10px] font-bold text-emerald-600 uppercase tracking-tight">
                                        You are currently a student in this course
                                    </p>
                                )}
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