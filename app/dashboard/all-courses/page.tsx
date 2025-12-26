"use client";
import React, { useState } from 'react';
import { Search, Filter, ChevronRight } from 'lucide-react';
import CourseCard from '@/components/shared/CourseCard';
import Link from 'next/link';

// Mock Data for UI Courses
const COURSE_DATA = [
    { id: 'csc401', code: 'CSC 401', name: 'Analysis of Algorithms', units: 3, level: '400L', semester: 'First', faculty: 'Science', dept: 'CSC', color: 'bg-blue-600' },
    { id: 'csc415', code: 'CSC 415', name: 'Machine Learning', units: 4, level: '400L', semester: 'First', faculty: 'Science', dept: 'CSC', color: 'bg-indigo-600' },
    { id: 'mat321', code: 'MAT 321', name: 'Linear Algebra II', units: 3, level: '300L', semester: 'Second', faculty: 'Science', dept: 'MAT', color: 'bg-emerald-600' },
    { id: 'ges101', code: 'GES 101', name: 'Use of English', units: 2, level: '100L', semester: 'First', faculty: 'Arts', dept: 'CLA', color: 'bg-amber-600' },
];

export type TCourseData = typeof COURSE_DATA[0];

export default function AllCourses() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCourses = COURSE_DATA.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-[#002147]">Course Catalog</h1>
                    <p className="text-slate-500">Browse and explore available courses in the University.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search code or name..."
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#002147] outline-none text-sm w-full md:w-64"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses.map((course, index) => (
                    <CourseCard key={index} course={course}>
                        <Link href={`/dashboard/all-courses/${course.id}`} className="w-full py-3 bg-[#002147] text-white rounded-lg font-bold text-center text-sm hover:bg-[#003366] transition-all flex items-center justify-center gap-2">
                            View Course Details <ChevronRight size={16} />
                        </Link>
                    </CourseCard>
                ))}
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
                <div className="text-center py-20">
                    <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-[#002147]">No courses found</h3>
                    <p className="text-slate-500">Try adjusting your search or filter settings.</p>
                </div>
            )}
        </div>
    );
}