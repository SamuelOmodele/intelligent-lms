"use client";
import React, { useState } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  UserX,
  Download,
  GraduationCap,
  Mail,
  Users,
  CheckCircle2,
  Building2,
  Hash
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock Data for Admin Student View
const ALL_STUDENTS = [
  { id: "1", name: "Olawale Adeleke", email: "o.adeleke@stu.ui.edu.ng", matric: "190201", department: "Computer Science", level: "400L", status: "Active" },
  { id: "2", name: "Amina Yusuf", email: "a.yusuf@stu.ui.edu.ng", matric: "190452", department: "Computer Science", level: "400L", status: "Active" },
  { id: "3", name: "Chidi Okafor", email: "c.okafor@stu.ui.edu.ng", matric: "190331", department: "Mathematics", level: "200L", status: "Suspended" },
  { id: "4", name: "Tunde Bakare", email: "t.bakare@stu.ui.edu.ng", matric: "190112", department: "Computer Science", level: "400L", status: "Active" },
  { id: "5", name: "Sarah Idibia", email: "s.idibia@stu.ui.edu.ng", matric: "201442", department: "Statistics", level: "300L", status: "Inactive" },
];

const DEPARTMENTS = ["All Departments", "Computer Science", "Mathematics", "Statistics"];

export default function AdminStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");

  const filteredStudents = ALL_STUDENTS.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.matric.includes(searchTerm);
    const matchesDept = deptFilter === "All Departments" || student.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#002147]">Global Student Body</h1>
          <p className="text-slate-500 font-medium mt-1">Institutional record of all enrolled students across all departments.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-[#002147] px-5 py-3 rounded-[5px] font-bold text-xs uppercase hover:bg-slate-50 transition-all shadow-sm">
            <Download size={16} /> Export Records
          </button>
          <button className="flex items-center gap-2 bg-[#002147] text-white px-5 py-3 rounded-[5px] font-black text-xs uppercase hover:bg-blue-900 transition-all shadow-sm shadow-blue-900/10">
            <CheckCircle2 size={16} /> Verify Matriculants
          </button>
        </div>
      </div>

      {/* Admin Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#002147] p-6 rounded-[10px] text-white flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-blue-200 tracking-widest mb-1">Total Enrolled</p>
            <h2 className="text-3xl font-black">12,450</h2>
          </div>
          <div className="bg-blue-900/50 p-3 rounded-2xl text-[#fdb813]">
            <Users size={28} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-[10px] border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Active This Week</p>
            <h2 className="text-3xl font-black text-[#002147]">8,920</h2>
          </div>
          <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
            <CheckCircle2 size={28} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-[10px] border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Pending Clearance</p>
            <h2 className="text-3xl font-black text-[#002147]">124</h2>
          </div>
          <div className="bg-amber-50 p-3 rounded-2xl text-amber-600">
            <Hash size={28} />
          </div>
        </div>
      </div>

      {/* Table Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or matric number..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 ring-blue-50 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Building2 size={18} className="text-slate-400" />
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

      {/* Admin Students Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
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
                <tr key={student.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#002147] flex items-center justify-center font-black text-xs border border-slate-200 transition-transform group-hover:scale-110">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-[#002147] text-sm">{student.name}</p>
                        <p className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                          <Mail size={12} /> {student.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600">
                    <span className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 tracking-wider">
                      {student.matric}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-black text-[#002147]">{student.department}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase">{student.level}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${student.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                        student.status === 'Suspended' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-2 hover:bg-slate-100 rounded-lg outline-none transition-colors">
                        <MoreVertical size={18} className="text-slate-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1 shadow-xl border-slate-200">
                        <DropdownMenuItem className="flex items-center gap-2 text-xs font-bold p-3 cursor-pointer">
                          <Eye size={16} /> View Academic File
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 text-xs font-bold p-3 cursor-pointer">
                          <GraduationCap size={16} /> Edit Level/Dept
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 text-xs font-bold p-3 text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-600">
                          <UserX size={16} /> Suspend Access
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
    </div>
  );
}