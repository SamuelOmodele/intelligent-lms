/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from 'react';
import { 
  Search, Plus, Building2, Users, BookOpen, UserCheck, 
  MoreVertical, Trash2, PieChart, Loader2 
} from 'lucide-react';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminDepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [open, setOpen] = useState(false);

  // Convex Hooks
  const departments = useQuery(api.departments.list);
  const createDept = useMutation(api.departments.create);
  const deleteDept = useMutation(api.departments.remove);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await createDept({
        name: formData.get("name") as string,
        code: (formData.get("code") as string).toUpperCase(),
      });
      setOpen(false); // Close modal
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (confirm("Are you sure you want to dissolve this department?")) {
      await deleteDept({ id });
    }
  };

  const filteredDepts = departments?.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    dept.code.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#002147]">Departmental Management</h1>
          <p className="text-slate-500 font-medium mt-1">Configure academic units and monitor resource allocation.</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 bg-[#002147] text-white px-6 py-3 rounded-[5px] font-black text-xs uppercase hover:bg-blue-900 transition-all">
              <Plus size={18} /> New Department
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-black text-[#002147]">Add Academic Department</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Department Name</label>
                  <input name="name" required type="text" className="w-full p-3 border rounded-xl text-sm outline-none focus:ring-2 ring-blue-50" placeholder="e.g. Microbiology" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Code</label>
                  <input name="code" required type="text" className="w-full p-3 border rounded-xl text-sm outline-none focus:ring-2 ring-blue-50" placeholder="MCB" />
                </div>
              </div>
              <button disabled={isCreating} type="submit" className="w-full bg-[#fdb813] text-[#002147] font-black py-4 rounded-xl uppercase text-xs mt-2 hover:opacity-90 flex items-center justify-center gap-2">
                {isCreating ? <Loader2 className="animate-spin" size={16}/> : "Create Department"}
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
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 text-sm outline-none focus:ring-2 ring-blue-50 font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Department Grid */}
      {!departments ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-300" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredDepts.map((dept) => (
            <div key={dept._id} className="bg-white rounded-[10px] border border-slate-200 p-5 hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#002147] group-hover:bg-[#002147] group-hover:text-white transition-colors">
                  <Building2 size={28} />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 hover:bg-slate-100 rounded-full outline-none">
                    <MoreVertical size={18} className="text-slate-400" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    <DropdownMenuItem 
                      onClick={() => handleDelete(dept._id)}
                      className="flex items-center gap-2 text-xs font-bold p-3 text-red-600 cursor-pointer"
                    >
                      <Trash2 size={16} /> Dissolve Unit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-[#fdb813] bg-[#002147] px-2 py-0.5 rounded italic tracking-widest">{dept.code}</span>
                  <h2 className="text-xl font-black text-[#002147]">{dept.name}</h2>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-slate-300 pt-6">
                <Stat icon={<Users size={14}/>} color="text-blue-600" val={dept.staffCount} label="Staff" />
                <Stat icon={<BookOpen size={14}/>} color="text-purple-600" val={dept.courseCount} label="Courses" border />
                <Stat icon={<PieChart size={14}/>} color="text-emerald-600" val={dept.studentCount} label="Students" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Reusable Stat Component for cleanliness
function Stat({ icon, color, val, label, border }: any) {
  return (
    <div className={`text-center ${border ? 'border-x border-slate-100 px-4' : ''}`}>
      <div className={`flex items-center justify-center gap-1.5 ${color} mb-1`}>
        {icon}
        <span className="text-sm font-black">{val}</span>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase">{label}</p>
    </div>
  );
}