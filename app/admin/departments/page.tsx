"use client";
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Building2, 
  Users, 
  BookOpen, 
  UserCheck, 
  MoreVertical, 
  ChevronRight,
  Settings2,
  Trash2,
  PieChart
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock Data
const DEPARTMENTS_DATA = [
  { id: 1, name: "Computer Science", hod: "Prof. A. B. Adeboye", staffCount: 24, courseCount: 42, studentCount: 1200, code: "CSC" },
  { id: 2, name: "Mathematics", hod: "Dr. Sarah Idris", staffCount: 18, courseCount: 35, studentCount: 850, code: "MAT" },
  { id: 3, name: "Statistics", hod: "Prof. J. K. Zungeru", staffCount: 12, courseCount: 22, studentCount: 600, code: "STA" },
  { id: 4, name: "Physics", hod: "Dr. Micheal Chen", staffCount: 15, courseCount: 28, studentCount: 450, code: "PHY" },
];

export default function AdminDepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDepts = DEPARTMENTS_DATA.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    dept.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#002147]">Departmental Management</h1>
          <p className="text-slate-500 font-medium mt-1">Configure academic units, assign HODs, and monitor resource allocation.</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 bg-[#002147] text-white px-6 py-3 rounded-[5px] font-black text-xs uppercase hover:bg-blue-900 transition-all shadow-xs shadow-blue-900/10">
              <Plus size={18} /> New Department
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-black text-[#002147]">Add Academic Department</DialogTitle>
            </DialogHeader>
            <form className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Name</label>
                  <input type="text" className="w-full p-3 border rounded-xl text-sm" placeholder="e.g. Microbiology" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Code</label>
                  <input type="text" className="w-full p-3 border rounded-xl text-sm" placeholder="MCB" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Appoint HOD</label>
                <select className="w-full p-3 border rounded-xl text-sm bg-white">
                  <option>Select a Senior Lecturer...</option>
                  <option>Prof. Adeboye</option>
                  <option>Dr. Sarah Idris</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-[#fdb813] text-[#002147] font-black py-4 rounded-xl uppercase text-xs mt-2 hover:opacity-90 transition-all">
                Create Department
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Global Search */}
      <div className="relative w-full md:w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search by name or code..." 
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 text-sm outline-none focus:ring-2 ring-blue-50 font-medium shadow-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Department Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredDepts.map((dept) => (
          <div key={dept.id} className="bg-white rounded-[10px] border border-slate-200 p-5 hover:shadow-xl hover:shadow-slate-200/50 transition-all ">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#002147] group-hover:bg-[#002147] group-hover:text-white transition-colors">
                <Building2 size={28} />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 hover:bg-slate-100 rounded-full outline-none">
                  <MoreVertical size={18} className="text-slate-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                  <DropdownMenuItem className="flex items-center gap-2 text-xs font-bold p-3 text-red-600 cursor-pointer">
                    <Trash2 size={16} /> Dissolve Unit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-[#fdb813] bg-[#002147] px-2 py-0.5 rounded italic tracking-widest">{dept.code}</span>
                <h2 className="text-xl font-black text-[#002147]">{dept.name}</h2>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <UserCheck size={14} />
                <p className="text-xs font-bold uppercase tracking-tight">HOD: <span className="text-slate-600">{dept.hod}</span></p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-slate-50 pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-blue-600 mb-1">
                  <Users size={14} />
                  <span className="text-sm font-black">{dept.staffCount}</span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Staff</p>
              </div>
              <div className="text-center border-x border-slate-100 px-4">
                <div className="flex items-center justify-center gap-1.5 text-purple-600 mb-1">
                  <BookOpen size={14} />
                  <span className="text-sm font-black">{dept.courseCount}</span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Courses</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-emerald-600 mb-1">
                  <PieChart size={14} />
                  <span className="text-sm font-black">{dept.studentCount}</span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Students</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}