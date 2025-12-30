/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, Building2, GraduationCap, Loader2 } from 'lucide-react';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  // Use the manual mutation we created in convex/users.ts
  const registerUser = useMutation(api.users.register);
  const router = useRouter();
  
  const [role, setRole] = useState<'student' | 'staff'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [idNumber, setIdNumber] = useState(""); 
  const [department, setDepartment] = useState("Computer Science");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Call our manual Convex mutation
      const userId = await registerUser({
        name,
        email,
        password,
        role: role === 'student' ? 'student' : 'lecturer',
        department,
        // Map the single idNumber field to the correct schema field
        ...(role === 'student' ? { matricNumber: idNumber } : { staffId: idNumber }),
      });

      localStorage.setItem("userId", userId);
      
      // Redirect to login
      router.push('/login');
      
    } catch (err: any) {
      // Convex errors usually come back in the 'message' property
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-nunito min-h-screen grid place-items-center bg-[#EEF5FF] py-12 px-4 ">
      <div className="max-w-2xl w-full bg-white h-fit rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-[#002147] p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white uppercase">Account Registration</h2>
            <p className="text-blue-200 text-[10px] uppercase font-bold tracking-widest">Create your account today!</p>
          </div>
          <GraduationCap className="h-10 w-10 text-[#fdb813] opacity-50" />
        </div>

        <div className="p-8">
          {/* Role Switcher */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
            <button 
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === 'student' ? 'bg-white shadow-sm text-[#002147]' : 'text-slate-500'}`}
            >
              Student
            </button>
            <button 
              type="button"
              onClick={() => setRole('staff')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === 'staff' ? 'bg-white shadow-sm text-[#002147]' : 'text-slate-500'}`}
            >
              Staff
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Full Name (Surname First)</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text" 
                  placeholder="ADAMU Tunde Musa" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-blue-100 outline-none transition-all" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Institutional Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email" 
                  placeholder="t.adamu@ui.edu.ng" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-blue-100 outline-none transition-all" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {role === 'student' ? 'Matriculation Number' : 'Staff ID Number'}
              </label>
              <div className="relative">
                {/* Fixed the missing icon here for consistency */}
                <Building2 className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  required
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  type="text" 
                  placeholder={role === 'student' ? '218843' : 'UI/STF/2021'} 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-blue-100 outline-none transition-all" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Department</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <select 
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-blue-100 outline-none transition-all appearance-none"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Zoology">Zoology</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Physics">Physics</option>
                  <option value="Botany">Botany</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-blue-100 outline-none transition-all" 
                />
              </div>
            </div>

            <div className="md:col-span-2 mt-3">
              <button 
                disabled={isLoading}
                type="submit"
                className="w-full bg-[#fdb813] text-[15px] text-[#002147] font-black py-3 rounded-lg hover:bg-[#eab011] transition-all shadow-sm uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Complete Registration"}
              </button>
            </div>
          </form>

          <div className="mt-5 text-center">
            <p className="text-slate-500 text-[15px]">
              Already have an account? 
              <Link href="/login" className="ml-2 font-bold text-[#002147] hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}