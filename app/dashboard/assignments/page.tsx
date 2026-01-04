"use client";
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2,
  Loader2,
  Inbox
} from 'lucide-react';
import Link from 'next/link';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function GeneralAssignmentsPage() {
  const [filter, setFilter] = useState<'Pending' | 'Submitted'>('Pending');
  const [studentId, setStudentId] = useState<Id<"users"> | null>(null);

  // 1. Get studentId from local storage
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (storedId) setStudentId(storedId as Id<"users">);
  }, []);

  // 2. Fetch all assignments for enrolled courses
  const assignments = useQuery(
    api.assignments.getEnrolledAssignments, 
    studentId ? { studentId } : "skip"
  );

  // 3. Filter data based on tab selection
  const filteredData = assignments?.filter(a => a.status === filter) || [];

  // Helper to determine if an assignment is "Urgent" (Due within 48 hours)
  const isUrgent = (dateString: string) => {
    const dueDate = new Date(dateString).getTime();
    const now = new Date().getTime();
    const diff = dueDate - now;
    return diff > 0 && diff < (48 * 60 * 60 * 1000); // 48 hours
  };

  if (assignments === undefined) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="font-black text-xs uppercase tracking-widest">Loading Assignments...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#002147]">My Assignments</h1>
          <p className="text-slate-500 font-medium">Keep track of your coursework across all enrolled modules.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200">
          <button 
            onClick={() => setFilter('Pending')}
            className={`px-8 py-2.5 cursor-pointer rounded-xl text-sm font-black transition-all ${
              filter === 'Pending' 
              ? 'bg-white text-[#002147] shadow-md' 
              : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter('Submitted')}
            className={`px-8 py-2.5 cursor-pointer rounded-xl text-sm font-black transition-all ${
              filter === 'Submitted' 
              ? 'bg-white text-[#002147] shadow-md' 
              : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Submitted
          </button>
        </div>
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((asgn) => (
            <div key={asgn._id} className="group bg-white border border-slate-200 rounded-lg p-5 hover:border-blue-300 transition-all hover:shadow-xl hover:shadow-blue-900/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl shrink-0 transition-colors ${
                    filter === 'Pending' 
                    ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-100' 
                    : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'
                  }`}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded uppercase tracking-wider">
                        {asgn.courseCode}
                      </span>
                      {filter === 'Pending' && isUrgent(new Date(asgn.dueDate).toLocaleDateString()) && (
                        <span className="flex items-center gap-1 text-[10px] font-black text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded uppercase tracking-wider">
                          <AlertCircle size={12} /> Urgent
                        </span>
                      )}
                    </div>
                    <h3 className="font-black text-[#002147] text-[18px] capitalize">
                      {asgn.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <p className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-tight ${
                        isUrgent(new Date(asgn.dueDate).toLocaleDateString()) && filter === 'Pending' ? 'text-red-500' : 'text-slate-400'
                      }`}>
                        <Clock size={14} /> 
                        Due: {new Date(asgn.dueDate).toLocaleDateString('en-GB', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </p>
                      <p className='text-[13px] font-bold'>
                        {filter === 'Pending' ? <span className='text-orange-400'>Pending</span> : <span className='text-green-700'>Submitted</span>}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {filter === 'Pending' ? (
                    <Link 
                      href={`/dashboard/my-courses/${asgn.courseId}`}
                      className="flex items-center gap-2 px-6 py-3 bg-[#002147] text-white rounded-[5px] font-black text-xs uppercase hover:bg-[#003366] transition-all shadow-lg shadow-blue-900/20"
                    >
                      Open Course <ChevronRight size={16} />
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-700 font-black text-xs uppercase bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-[5px]">
                      <CheckCircle2 size={18} /> Recorded
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
            <Inbox className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-400 font-bold italic">No {filter.toLowerCase()} assignments found.</p>
            <p className="text-slate-300 text-sm font-medium mt-1">Check back later for updates from your lecturers.</p>
          </div>
        )}
      </div>
    </div>
  );
}