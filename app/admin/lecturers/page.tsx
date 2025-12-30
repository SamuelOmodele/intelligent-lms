/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from 'react';
import {
  Search,
  Mail,
  Building2,
  MoreVertical,
  Filter,
  BookOpen,
  Loader2,
  Ban,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Convex Hooks
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const DEPARTMENTS = ["All Departments", "Computer Science", "Mathematics", "Statistics"];

export default function AdminLecturersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State
  const [selectedLecturer, setSelectedLecturer] = useState<any>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  // Convex
  const lecturers = useQuery(api.lecturers.listLecturers);
  const toggleBlock = useMutation(api.lecturers.toggleBlockStatus);

  const handleBlockAction = async () => {
    if (!selectedLecturer) return;
    setIsSubmitting(true);
    try {
      await toggleBlock({
        id: selectedLecturer._id,
        status: !selectedLecturer.isBlocked
      });
      setIsBlockModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Action failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredLecturers = lecturers?.filter(lecturer => {
    const matchesSearch =
      lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const lecturerDept = (lecturer as any).dept || "Computer Science";
    const matchesDept = deptFilter === "All Departments" || lecturerDept === deptFilter;
    return matchesSearch && matchesDept;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#002147]">Lecturer Directory</h1>
          <p className="text-slate-500 font-medium mt-1">Manage academic staff access and roles.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-blue-100 font-medium transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter size={18} className="text-slate-400" />
          <select
            className="bg-slate-50 border-none px-4 py-3 rounded-xl text-sm font-bold text-[#002147] outline-none cursor-pointer"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        {!lecturers ? (
          // STATE 1: LOADING
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="animate-spin text-[#002147]" size={32} />
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Syncing Faculty Data...</p>
          </div>
        ) : filteredLecturers.length === 0 ? (
          // STATE 2: NO RESULTS FOUND (FILTERED OR EMPTY DB)
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search className="text-slate-300" size={28} />
            </div>
            <h3 className="text-[#002147] font-black text-lg">No Lecturers Found</h3>
            <p className="text-slate-500 font-medium max-w-xs mt-1">
              We couldn&apos;t find any staff matching &quot;{searchTerm}&quot; in {deptFilter}.
            </p>
            <button
              onClick={() => { setSearchTerm(""); setDeptFilter("All Departments"); }}
              className="mt-6 text-xs font-black uppercase tracking-wider text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          // STATE 3: DATA FOUND
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lecturer</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Workload</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredLecturers.map((lecturer) => (
                  <tr key={lecturer._id} className={`transition-colors ${lecturer.isBlocked ? 'bg-slate-50/50' : 'hover:bg-slate-50/30'}`}>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 border-white shadow-sm ${lecturer.isBlocked ? 'bg-slate-300 text-slate-500' : 'bg-[#002147] text-[#fdb813]'}`}>
                          {lecturer.name.charAt(0)}
                        </div>
                        <div>
                          <p className={`font-black text-sm ${lecturer.isBlocked ? 'text-slate-400 line-through' : 'text-[#002147]'}`}>{lecturer.name}</p>
                          <span className="text-[11px] font-bold text-slate-400">{lecturer.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-black text-[#002147]">
                      {lecturer.department}
                    </td>
                    <td className="px-8 py-5 text-sm font-black text-[#002147]">
                      {lecturer.workloadCount} Courses
                    </td>
                    <td className="px-8 py-5">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${lecturer.isBlocked ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {lecturer.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 hover:bg-slate-100 rounded-lg outline-none transition-colors">
                          <MoreVertical size={18} className="text-slate-400" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-xl border-slate-100">
                          <DropdownMenuItem 
                            onClick={() => { setSelectedLecturer(lecturer); setIsBlockModalOpen(true); }}
                            className={`flex items-center gap-2 text-xs font-bold p-3 cursor-pointer ${lecturer.isBlocked ? 'text-emerald-600' : 'text-red-600'}`}
                          >
                            {lecturer.isBlocked ? <CheckCircle2 size={16} /> : <Ban size={16} />}
                            {lecturer.isBlocked ? 'Unblock Staff' : 'Block Staff'}
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

      {/* Block Confirmation Modal */}
      <Dialog open={isBlockModalOpen} onOpenChange={setIsBlockModalOpen}>
        <DialogContent className="sm:max-w-[400px] text-center">
          <div className={`flex justify-center mb-2 ${selectedLecturer?.isBlocked ? 'text-emerald-500' : 'text-red-500'}`}>
            <div className={`p-4 rounded-full ${selectedLecturer?.isBlocked ? 'bg-emerald-50' : 'bg-red-50'}`}>
              {selectedLecturer?.isBlocked ? <CheckCircle2 size={40} /> : <AlertTriangle size={40} />}
            </div>
          </div>
          <DialogHeader>
            <DialogTitle className="font-black text-center text-[#002147] text-xl">
              {selectedLecturer?.isBlocked ? 'Unblock' : 'Block'} Staff Member?
            </DialogTitle>
            <DialogDescription className="text-center font-medium">
              Are you sure you want to {selectedLecturer?.isBlocked ? 'restore access for' : 'restrict access for'} <span className="font-bold text-[#002147]">{selectedLecturer?.name}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
            <button onClick={() => setIsBlockModalOpen(false)} className="w-full py-4 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase">Cancel</button>
            <button
              onClick={handleBlockAction}
              disabled={isSubmitting}
              className={`w-full py-4 text-white rounded-xl font-black text-xs uppercase flex justify-center items-center gap-2 ${selectedLecturer?.isBlocked ? 'bg-emerald-600' : 'bg-red-600'}`}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (selectedLecturer?.isBlocked ? 'Confirm Unblock' : 'Confirm Block')}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}