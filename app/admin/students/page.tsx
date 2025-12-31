/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from 'react';
import {
  Search,
  MoreVertical,
  UserX,
  Download,
  Mail,
  Users,
  CheckCircle2,
  Building2,
  Loader2,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AdminStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

  // Convex Data
  const students = useQuery(api.students.listStudents);
  const departments = useQuery(api.departments.list);
  const stats = useQuery(api.students.getStudentStats);
  const toggleAccess = useMutation(api.students.toggleStudentAccess);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Access Toggle
  const handleToggleConfirm = async () => {
    if (!selectedStudent) return;
    setIsSubmitting(true);
    try {
      await toggleAccess({
        id: selectedStudent._id,
        isBlocked: !selectedStudent.isBlocked
      });
      setIsAccessModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = students?.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student as any).matricNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const studentDept = (student as any).department || "Computer Science";
    // Fixed logic: matches if "All Departments" is selected OR the strings match exactly
    const matchesDept = deptFilter === "All Departments" || studentDept === deptFilter;

    return matchesSearch && matchesDept;
  }) || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#002147]">Global Student Body</h1>
          <p className="text-slate-500 font-medium mt-1">Institutional record of all enrolled students.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 text-[#002147] px-5 py-3 rounded-lg font-bold text-xs uppercase hover:bg-slate-50 transition-all shadow-sm">
          <Download size={16} /> Export Records
        </button>
      </div>

      {/* Admin Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: "Total Registered", val: stats?.total, icon: <Users />, color: "bg-[#002147] text-white", iconBg: "bg-blue-900/50" },
          { label: "Registered This Week", val: stats?.thisWeek, icon: <CheckCircle2 />, color: "bg-white text-[#002147]", iconBg: "bg-emerald-50 text-emerald-600" },
          { label: "Registered Today", val: stats?.today, icon: <CheckCircle2 />, color: "bg-white text-[#002147]", iconBg: "bg-emerald-50 text-emerald-600" }
        ].map((stat, i) => (
          <div key={i} className={`${stat.color} p-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm`}>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${i === 0 ? 'text-blue-200' : 'text-slate-400'}`}>{stat.label}</p>
              <h2 className="text-3xl font-black">{stat.val ?? "..."}</h2>
            </div>
            <div className={`${stat.iconBg} p-3 rounded-2xl`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Table Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or matric number..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-blue-100 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto bg-slate-50 px-4 py-1 rounded-xl">
          <Building2 size={18} className="text-slate-400" />
          <select
            className="bg-transparent border-none py-3 text-sm font-bold text-[#002147] outline-none cursor-pointer"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            {/* Value must match the initial state string */}
            <option value="All Departments">All Departments</option>
            {departments?.map(dept => (
              <option key={dept._id} value={dept.name}>{dept.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Admin Students Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        {!students ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-[#002147]" size={40} />
            <p className="text-slate-400 font-black text-xs uppercase tracking-tighter">fetching records...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-24 text-center">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-300" size={30} />
            </div>
            <h3 className="font-black text-[#002147]">No Students Found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Information</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Matric No.</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department & Level</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <tr key={student._id} className={`hover:bg-slate-50/30 transition-colors group ${student.isBlocked ? 'bg-red-50/20' : ''}`}>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs border transition-transform group-hover:scale-110 ${student.isBlocked ? 'bg-red-100 text-red-600 border-red-200' : 'bg-slate-100 text-[#002147] border-slate-200'}`}>
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className={`font-black text-sm ${student.isBlocked ? 'text-red-900' : 'text-[#002147]'}`}>{student.name}</p>
                          <p className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                            <Mail size={12} /> {student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-600">
                      <span className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 tracking-wider font-mono">
                        {(student as any).matricNumber || "N/A"}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-black text-[#002147]">{(student as any).department || "Unassigned"}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase">{(student as any).level || "100L"}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${student.isBlocked ? 'bg-red-100 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {student.isBlocked ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 hover:bg-slate-100 rounded-lg outline-none transition-colors">
                          <MoreVertical size={18} className="text-slate-400" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1 shadow-xl border-slate-200">
                          <DropdownMenuItem
                            onClick={() => { setSelectedStudent(student); setIsAccessModalOpen(true); }}
                            className={`flex gap-2 font-bold text-xs p-3 cursor-pointer ${student.isBlocked ? 'text-emerald-600' : 'text-red-600'}`}
                          >
                            {student.isBlocked ? <UserCheck size={16} /> : <UserX size={16} />}
                            {student.isBlocked ? 'Restore Access' : 'Suspend Access'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: ACCESS CONTROL */}
      <Dialog open={isAccessModalOpen} onOpenChange={setIsAccessModalOpen}>
        <DialogContent className="max-w-sm text-center rounded-3xl">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-2 ${selectedStudent?.isBlocked ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {selectedStudent?.isBlocked ? <UserCheck size={32} /> : <AlertTriangle size={32} />}
          </div>
          <DialogHeader>
            <DialogTitle className="text-center font-black text-[#002147] text-xl">
              {selectedStudent?.isBlocked ? 'Restore Access?' : 'Suspend Access?'}
            </DialogTitle>
            <DialogDescription className="text-center font-medium">
              Are you sure you want to {selectedStudent?.isBlocked ? 'unblock' : 'suspend'} <b>{selectedStudent?.name}</b>?
              This will {selectedStudent?.isBlocked ? 'allow' : 'restrict'} their login access.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
            <button onClick={() => setIsAccessModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase cursor-pointer">Cancel</button>
            <button
              onClick={handleToggleConfirm}
              disabled={isSubmitting}
              className={`flex-1 py-3 text-white rounded-xl font-black text-xs uppercase cursor-pointer ${selectedStudent?.isBlocked ? 'bg-emerald-600' : 'bg-red-600'}`}
            >
              {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={14} /> : 'Confirm Action'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}