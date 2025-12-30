"use client";
import React, { useState } from 'react';
import {
  Search,
  Mail,
  Building2,
  MoreVertical,
  Filter,
  BookOpen,
  Trash2,
  ShieldCheck,
  Phone
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock Data
const LECTURERS = [
  { id: 1, name: "Prof. A. B. Adeboye", email: "ab.adeboye@ui.edu.ng", dept: "Computer Science", courses: 3, phone: "+234 802 123 4567", status: "Active" },
  { id: 2, name: "Dr. Sarah Idris", email: "s.idris@ui.edu.ng", dept: "Mathematics", courses: 2, phone: "+234 803 987 6543", status: "Active" },
  { id: 3, name: "Dr. O. Olumide", email: "o.olumide@ui.edu.ng", dept: "Computer Science", courses: 4, phone: "+234 805 444 2211", status: "On Leave" },
  { id: 4, name: "Prof. J. K. Zungeru", email: "jk.zungeru@ui.edu.ng", dept: "Statistics", courses: 1, phone: "+234 809 111 0000", status: "Active" },
];

const DEPARTMENTS = ["All Departments", "Computer Science", "Mathematics", "Statistics"];

export default function AdminLecturersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");

  const filteredLecturers = LECTURERS.filter(lecturer => {
    const matchesSearch = lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === "All Departments" || lecturer.dept === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#002147]">Lecturer Directory</h1>
          <p className="text-slate-500 font-medium mt-1">Manage academic staff, permissions, and departmental roles.</p>
        </div>

      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-blue-100 font-medium"
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

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
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
              <tr key={lecturer.id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#002147] text-[#fdb813] flex items-center justify-center font-black text-sm border-2 border-white shadow-sm">
                      {lecturer.name.split(' ').pop()?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-[#002147] text-sm">{lecturer.name}</p>
                      <div className="flex items-center gap-2 text-slate-400 mt-0.5">
                        <Mail size={12} />
                        <span className="text-[11px] font-bold">{lecturer.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-slate-300" />
                    <span className="text-sm font-bold text-slate-600">{lecturer.dept}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} className="text-blue-500" />
                    <span className="text-sm font-black text-[#002147]">{lecturer.courses} Courses</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${lecturer.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                    {lecturer.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 hover:bg-slate-100 rounded-lg outline-none">
                      <MoreVertical size={18} className="text-slate-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl p-1">
                      <DropdownMenuItem className="flex items-center gap-2 text-xs font-bold p-3 cursor-pointer">
                        <ShieldCheck size={16} /> Edit Permissions
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 text-xs font-bold p-3 cursor-pointer">
                        <Phone size={16} /> Contact Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 text-xs font-bold p-3 text-red-600 cursor-pointer focus:bg-red-50">
                        <Trash2 size={16} /> Offboard Staff
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}