import React from 'react';
import { Book, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import DeadlineItem from '@/components/dashboard/DeadlineItem';
import CourseActivityRow from '@/components/dashboard/CourseActivityRow';
import StatCard from '@/components/dashboard/StatCard';

export default function StudentOverview() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-[#002147]">Welcome back, Tunde!</h1>
        <p className="text-slate-500">Here is what is happening with your courses today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
        {/* Primary Info: Blue for stability/info */}
        <StatCard
          icon={<Book className="text-blue-600" />}
          label="Enrolled Courses"
          value="6"
          color="bg-blue-50"
        />

        {/* Warning/Pending: Amber/Orange for "Attention Needed" */}
        <StatCard
          icon={<Clock className="text-amber-600" />}
          label="Pending Assignments"
          value="4"
          color="bg-amber-50"
        />

        {/* Success: Emerald/Green for "Completed" */}
        <StatCard
          icon={<CheckCircle className="text-emerald-600" />}
          label="Submitted Assignments"
          value="12"
          color="bg-emerald-50"
        />

        {/* Alert/Critical: Rose/Red for "Missed/Danger" */}
        <StatCard
          icon={<AlertCircle className="text-rose-600" />}
          label="Missed Assignments"
          value="1"
          color="bg-rose-50"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent Courses List */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-lg font-bold text-[#002147]">Recent Course Activity</h3>
          <CourseActivityRow lessonTopic="Search Algorithms" code="CSC 401" name="Analysis of Algorithms" progress={75} lastAccessed="2 hours ago" />
          <CourseActivityRow lessonTopic="Linear Regression" code="CSC 415" name="Machine Learning" progress={40} lastAccessed="Yesterday" />
          <CourseActivityRow lessonTopic="Matrix" code="MAT 321" name="Linear Algebra II" progress={90} lastAccessed="3 days ago" />
        </div>

        {/* Upcoming Deadlines Sidebar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-[#002147] mb-6">Upcoming Deadlines</h3>
          <div className="space-y-4">
            <DeadlineItem title="CSC 401 Assignment 2" date="Oct 28" urgent />
            <DeadlineItem title="MAT 321 Quiz" date="Oct 30" />
            <DeadlineItem title="Project Proposal" date="Nov 05" />
          </div>
        </div>
      </div>
    </div>
  );
}
