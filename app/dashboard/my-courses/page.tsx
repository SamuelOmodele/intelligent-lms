"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ArrowRight, Loader2, BookX } from 'lucide-react';
import CourseCard from '@/components/shared/CourseCard';

export default function MyCourses() {
    const [studentId, setStudentId] = useState<Id<"users"> | null>(null);

    // 1. Get Student ID from Local Storage
    useEffect(() => {
        const storedId = localStorage.getItem("userId"); 
        if (storedId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setStudentId(storedId as Id<"users">);
        }
    }, []);

    // 2. Fetch Enrolled Courses
    const courses = useQuery(
        api.courses.getStudentCourses, 
        studentId ? { studentId } : "skip"
    );

    // 3. Loading State
    if (courses === undefined || !studentId) {
        return (
            <div className="h-96 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="font-bold text-xs uppercase tracking-widest">Loading your curriculum...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-[#002147]">My Enrolled Courses</h1>
                <p className="text-slate-500 text-sm">Access your active learning modules for the current semester.</p>
            </div>

            {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <CourseCard 
                            key={course?._id} 
                            // Mapping your schema fields to what CourseCard expects
                            course={{
                                id: course?._id,
                                code: course?.courseCode,
                                name: course?.courseName,
                                lecturerName: course?.lecturerName,
                                // unit: course?.unit,
                                dept: course?.department,
                                // level: "400L", // You could store this in the course table if needed
                                color: "bg-[#002147]" // Default brand color
                            }}
                        >
                            <Link
                                href={`/dashboard/my-courses/${course?._id}`}
                                className="w-full py-3 bg-[#002147] text-white rounded-lg font-bold text-center text-sm hover:bg-[#003366] transition-all flex items-center justify-center gap-2 group"
                            >
                                Open Course 
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </CourseCard>
                    ))}
                </div>
            ) : (
                // 4. Empty State
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                        <BookX className="text-slate-300" size={32} />
                    </div>
                    <h3 className="text-[#002147] font-black text-lg">No Courses Found</h3>
                    <p className="text-slate-500 text-sm max-w-xs mb-6">
                        You haven&apos;t been enrolled in any courses yet. Please contact the administrator or your department.
                    </p>
                    <Link 
                        href="/dashboard/browse-courses" 
                        className="text-sm font-bold text-blue-600 hover:underline"
                    >
                        Browse Course Catalog
                    </Link>
                </div>
            )}
        </div>
    );
}