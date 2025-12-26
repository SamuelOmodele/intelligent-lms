"use client";
import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import CourseCard from '@/components/shared/CourseCard';

const MY_COURSES = [
  { id: 'csc401', code: 'CSC 401', name: 'Analysis of Algorithms', units: 3, dept: 'CSC', color: 'bg-blue-600', level: '400L', semester: 'First', faculty: 'Science', },
  { id: 'csc415', code: 'CSC 415', name: 'Machine Learning', units: 4, dept: 'CSC', color: 'bg-indigo-600', level: '400L', semester: 'First', faculty: 'Science', },
];

export default function MyCourses() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#002147]">My Enrolled Courses</h1>
        <p className="text-slate-500 text-sm">Access your active learning modules for the current semester.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MY_COURSES.map((course, index) => (
          <CourseCard course={course} key={index}>
            <Link
              href={`/dashboard/my-courses/${course.id}`}
              className="w-full py-3 bg-[#002147] text-white rounded-lg font-bold text-center text-sm hover:bg-[#003366] transition-all flex items-center justify-center gap-2"
            >
              Open Classroom <ArrowRight size={16} />
            </Link>
          </CourseCard>
          
        ))
        }
      </div >
    </div >
  );
}