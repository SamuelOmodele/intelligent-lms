/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import CourseCard from '@/components/shared/CourseCard';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function Courses() {
  const [userId, setUserId] = useState<string | null>(null);

  // 1. Grab the ID from storage
  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  // 2. Fetch live data from Convex
  const courses = useQuery(api.courses.getLecturerCourses, {
    lecturerId: userId as any
  });

  // 3. Loading State
  if (courses === undefined) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#002147] mb-4" size={32} />
        <p className="text-slate-500 font-medium">Loading your curriculum...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#002147]">Assigned Courses</h1>
        <p className="text-slate-500 text-sm">Access your active learning modules for the current semester.</p>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="text-slate-300" size={32} />
          </div>
          <h3 className="text-[#002147] font-black text-lg">No Courses Assigned</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">
            You currently don&apos;t have any courses assigned to your profile. Contact the administrator if this is an error.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
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
                href={`/instructor/courses/${course._id}`}
                className="w-full py-3 bg-[#002147] text-white rounded-lg font-bold text-center text-sm hover:bg-[#003366] transition-all flex items-center justify-center gap-2"
              >
                View Course <ArrowRight size={16} />
              </Link>
            </CourseCard>
          ))}
        </div>
      )}
    </div>
  );
}