"use client";
import React, { useState } from 'react';
import { Search, Filter, ChevronRight, Loader2 } from 'lucide-react';
import CourseCard from '@/components/shared/CourseCard';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function AllCourses() {
    const [searchTerm, setSearchTerm] = useState("");
    const courses = useQuery(api.courses.getAllCourses);

    // Handle Loading State
    if (courses === undefined) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-[#002147]" size={40} />
                <p className="mt-4 text-slate-500 font-bold uppercase text-xs tracking-widest">Loading Catalog...</p>
            </div>
        );
    }

    const filteredCourses = courses.filter(course =>
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-[#002147]">Course Catalog</h1>
                    <p className="text-slate-500 font-medium">Browse and explore available courses in the University.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search code or name..."
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#002147] outline-none text-sm w-full md:w-64 transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                    <CourseCard
                        key={course._id}
                        course={{
                            id: course._id,
                            code: course.courseCode,
                            name: course.courseName,
                            lecturerName: course.lecturerName,
                            dept: course.department,
                            color: "bg-blue-600",
                        }}
                    >
                        <Link
                            href={`/dashboard/all-courses/${course._id}`}
                            className="w-full py-3 bg-[#002147] text-white rounded-lg font-black uppercase text-[10px] tracking-widest text-center hover:bg-[#003366] transition-all flex items-center justify-center gap-2"
                        >
                            View Course Details <ChevronRight size={14} />
                        </Link>
                    </CourseCard>
                ))}
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="text-slate-300" size={30} />
                    </div>
                    <h3 className="text-lg font-black text-[#002147]">No courses found</h3>
                    <p className="text-slate-500 text-sm font-medium">Try adjusting your search for &quot;{searchTerm}&quot;</p>
                </div>
            )}
        </div>
    );
}