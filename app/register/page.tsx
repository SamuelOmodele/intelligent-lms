"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, Building2, GraduationCap } from 'lucide-react';

export default function RegisterPage() {
  const [role, setRole] = useState('student');

  return (
    <div className="font-nunito min-h-screen bg-[#EEF5FF] py-12 px-4 flex justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
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
              onClick={() => setRole('student')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === 'student' ? 'bg-white shadow-sm text-[#002147]' : 'text-slate-500'}`}
            >
              Student
            </button>
            <button 
              onClick={() => setRole('staff')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === 'staff' ? 'bg-white shadow-sm text-[#002147]' : 'text-slate-500'}`}
            >
              Staff
            </button>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Full Name (Surname First)</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input type="text" placeholder="ADAMU Tunde Musa" className="input-style pl-10 w-full" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Institutional Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input type="email" placeholder="t.adamu@ui.edu.ng" className="input-style pl-10 w-full" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {role === 'student' ? 'Matriculation Number' : 'Staff ID Number'}
              </label>
              <div className="relative">
                {/* <IdentificationCard className="absolute left-3 top-3 h-5 w-5 text-slate-400" /> */}
                <input type="text" placeholder={role === 'student' ? '218843' : 'UI/STF/2021'} className="input-style pl-10 w-full" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Faculty</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <select className="input-style pl-10 w-full appearance-none">
                  <option>Science</option>
                  <option>Arts</option>
                  <option>Technology</option>
                  <option>Social Sciences</option>
                  <option>Medicine</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input type="password" placeholder="••••••••" className="input-style pl-10 w-full" />
              </div>
            </div>

            <div className="md:col-span-2 mt-3">
              <button className="w-full bg-[#fdb813] text-[15px] text-[#002147] font-black py-3 rounded-lg hover:bg-[#eab011] transition-all shadow-sm uppercase tracking-wide">
                Complete Registration
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

// Custom CSS class for inputs to keep code clean
const inputStyle = "py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#002147] outline-none transition-all text-sm";