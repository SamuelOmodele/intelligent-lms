"use client";
import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2,
  Filter
} from 'lucide-react';
import Link from 'next/link';

const ALL_ASSIGNMENTS = [
  {
    id: "asgn-1",
    courseCode: "CSC 401",
    title: "Big O Analysis Exercise",
    dueDate: "2024-10-24T23:59:00",
    status: "Pending",
    priority: "High",
  },
  {
    id: "asgn-2",
    courseCode: "CSC 415",
    title: "Linear Regression Model",
    dueDate: "2024-10-28T23:59:00",
    status: "Pending",
    priority: "Medium",
  },
  {
    id: "asgn-3",
    courseCode: "CSC 401",
    title: "Sorting Algorithm Implementation",
    dueDate: "2024-10-15T23:59:00",
    status: "Submitted",
    priority: "Low",
  }
];

export default function GeneralAssignmentsPage() {
  const [filter, setFilter] = useState<'Pending' | 'Submitted'>('Pending');

  const filteredData = ALL_ASSIGNMENTS.filter(a => a.status === filter);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#002147]">Assignments</h1>
          <p className="text-slate-500 font-medium">Keep track of your coursework across all enrolled modules.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setFilter('Pending')}
            className={`px-6 py-2 rounded-lg text-sm font-black transition-all ${filter === 'Pending' ? 'bg-white text-[#002147] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter('Submitted')}
            className={`px-6 py-2 rounded-lg text-sm font-black transition-all ${filter === 'Submitted' ? 'bg-white text-[#002147] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Submitted
          </button>
        </div>
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((asgn) => (
            <div key={asgn.id} className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#fdb813] transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl shrink-0 ${filter === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-[#002147] bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">
                        {asgn.courseCode}
                      </span>
                      {asgn.priority === 'High' && filter === 'Pending' && (
                        <span className="flex items-center gap-1 text-[10px] font-black text-red-600 uppercase">
                          <AlertCircle size={12} /> Urgent
                        </span>
                      )}
                    </div>
                    <h3 className="font-black text-[#002147] text-lg group-hover:text-[#003366] transition-colors">{asgn.title}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-tight">
                        <Clock size={14} /> Due: {new Date(asgn.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {filter === 'Pending' ? (
                    <Link 
                      href={`/dashboard/my-courses/${asgn.courseCode.toLowerCase().replace(' ', '')}`}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#002147] text-white rounded-xl font-black text-xs uppercase hover:bg-[#003366] transition-all shadow-lg shadow-blue-900/10"
                    >
                      Open Course <ChevronRight size={16} />
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase bg-emerald-50 px-4 py-2 rounded-lg">
                      <CheckCircle2 size={16} /> Submitted
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold italic">No {filter.toLowerCase()} assignments found.</p>
          </div>
        )}
      </div>
    </div>
  );
}