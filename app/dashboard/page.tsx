/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from 'react';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Book, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import DeadlineItem from '@/components/dashboard/DeadlineItem';
import CourseActivityRow from '@/components/dashboard/CourseActivityRow';
import StatCard from '@/components/dashboard/StatCard';

export default function StudentOverview() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userId");
    if (storedUser) setUserId(storedUser);
  }, []);

  // Fetch specialized dashboard stats
  const stats = useQuery(api.courses.getStudentDashboardData, 
    userId ? { studentId: userId } : "skip"
  );

  // Fetch courses for the activity list
  const enrolledCourses = useQuery(api.courses.getStudentCourses, 
    userId ? { studentId: userId as any } : "skip"
  );

  if (!stats || !enrolledCourses) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-[#002147] opacity-20" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-[#002147]">Welcome back!</h1>
        <p className="text-slate-500">Here is what is happening with your courses today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
        <StatCard
          icon={<Book className="text-blue-600" />}
          label="Enrolled Courses"
          value={stats.courseCount.toString()}
          color="bg-blue-50"
        />

        <StatCard
          icon={<Clock className="text-amber-600" />}
          label="Pending Assignments"
          value={stats.pendingCount.toString()}
          color="bg-amber-50"
        />

        <StatCard
          icon={<CheckCircle className="text-emerald-600" />}
          label="Submitted Assignments"
          value={stats.submittedCount.toString()}
          color="bg-emerald-50"
        />

        <StatCard
          icon={<AlertCircle className="text-rose-600" />}
          label="Missed Assignments"
          value={stats.missedCount.toString()}
          color="bg-rose-50"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-lg font-bold text-[#002147]">Recent Course Activity</h3>
          {enrolledCourses.map((course: any) => (
            <CourseActivityRow 
              key={course._id}
              id={course._id}
              code={course.courseCode} 
              name={course.courseName} 
              lessonTopic="Continue Learning" 
            />
          ))}
        </div>

        {/* Upcoming Deadlines Sidebar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-[#002147] mb-6">Upcoming Deadlines</h3>
          <div className="space-y-4">
            {stats.upcomingDeadlines.length > 0 ? (
              stats.upcomingDeadlines.map((item: any) => (
                <DeadlineItem 
                  key={item._id}
                  title={item.title} 
                  date={new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
                  urgent={item.dueDate - Date.now() < 86400000} 
                />
              ))
            ) : (
              <p className="text-xs text-slate-400 font-bold uppercase text-center py-4">All caught up!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}