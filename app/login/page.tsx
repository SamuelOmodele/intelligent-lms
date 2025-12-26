"use client";
import React from 'react';
import Link from 'next/link';
import { Lock, Mail, GraduationCap, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="font-nunito min-h-screen bg-[#EEF5FF] flex items-center justify-center p-20">
      <div className="max-w-[600px] w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        {/* Logo/Header Section */}
        <div className="bg-[#002147] p-8 text-center">
          <div className="inline-flex p-3 bg-white/10 rounded-full mb-4">
            <GraduationCap className="h-8 w-8 text-[#fdb813]" />
          </div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Student Login</h2>
          <p className="text-blue-200 text-xs mt-2 uppercase tracking-widest">University of Ibadan LMS</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Institutional Email / Matric No.</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="e.g. 210943 or student@stu.ui.edu.ng"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#002147] focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <a href="#" className="text-[13px] font-semibold text-[#002147] hover:underline">Forgot Password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#002147] focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
            </div>

            <button className="w-full bg-[#002147] text-white font-medium py-3 rounded-lg hover:bg-[#003366] transition-all shadow-lg flex items-center justify-center gap-2">
              Sign In to Portal <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-[15px]">
              New to the platform? 
              <Link href="/register" className="ml-2 font-bold text-[#002147] hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}