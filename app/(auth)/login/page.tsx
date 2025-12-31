/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, Mail, GraduationCap, ArrowRight, Loader2 } from 'lucide-react';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const loginUser = useMutation(api.users.login);

  // States
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const user = await loginUser({ identifier, password });

      // If we reach here, login was successful
      localStorage.setItem("userId", user._id);
      localStorage.setItem("userRole", user.role);

      switch (user.role) {
        case "admin": router.push("/admin"); break;
        case "lecturer": router.push("/instructor"); break;
        case "student": router.push("/dashboard"); break;
        default: router.push("/");
      }
    } catch (err: any) {
      // 1. Check if it's a ConvexError (clean message)
      // 2. Fallback to the generic message if it's a system crash
      const message = err.data || err.message || "An unexpected error occurred";

      // If for some reason it still has the "Uncaught Error" prefix, strip it:
      const cleanMessage = typeof message === "string" && message.includes("Uncaught Error:")
        ? message.split("Uncaught Error:")[1].split("at handler")[0].trim()
        : message;

      setError(cleanMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-nunito min-h-screen bg-[#EEF5FF] flex items-center justify-center p-6 md:p-20">
      <div className="max-w-[600px] w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-[#002147] p-8 text-center">
          <div className="inline-flex p-3 bg-white/10 rounded-full mb-4">
            <GraduationCap className="h-8 w-8 text-[#fdb813]" />
          </div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Portal Login</h2>
          <p className="text-blue-200 text-xs mt-2 tracking-widest">PremierLMS Platform</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Institutional Email / Matric No.</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#002147] focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full bg-[#002147] text-white font-medium py-3 rounded-lg hover:bg-[#003366] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ?
                <div className='flex items-center justify-center gap-2'>
                  <Loader2 className="animate-spin" size={18} />
                  loading...
                </div> : (
                  <>Sign In to Portal <ArrowRight size={18} /></>
                )}
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