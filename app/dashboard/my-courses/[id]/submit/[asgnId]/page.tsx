"use client";
import React, { useState } from 'react';
import { ChevronLeft, Upload, FileText, X, CheckCircle, ShieldIcon } from 'lucide-react';
import Link from 'next/link';

export default function SubmitAssignment() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      setSubmitted(true);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h1 className="text-3xl font-black text-[#002147] mb-2">Submission Successful!</h1>
        <p className="text-slate-500 font-medium mb-8">Your assignment has been recorded. You can now view it in your dashboard.</p>
        <Link href="/dashboard/my-courses/csc401" className="px-8 py-3 bg-[#002147] text-white rounded-xl font-black text-sm">
          Return to Classroom
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/dashboard/my-courses/csc401" className="flex items-center gap-2 text-slate-500 font-bold text-sm mb-8">
        <ChevronLeft size={18} /> Back to Classroom
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#002147] mb-2">Submit Assignment</h1>
        <p className="text-slate-500 font-medium tracking-tight">Assignment: <span className="text-[#002147] font-bold">Big O Analysis Exercise</span></p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        {/* File Drop Zone */}
        {!file ? (
          <label className="border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#fdb813] hover:bg-amber-50/30 transition-all group">
            <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center group-hover:text-[#fdb813] group-hover:bg-white transition-all shadow-sm">
              <Upload size={28} />
            </div>
            <div className="text-center">
              <p className="text-[#002147] font-black">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-400 font-bold mt-1 uppercase">PDF, DOCX (Max 10MB)</p>
            </div>
          </label>
        ) : (
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm text-[#002147]">
                <FileText size={24} />
              </div>
              <div>
                <p className="font-black text-[#002147] text-sm truncate max-w-[200px]">{file.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button onClick={() => setFile(null)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-slate-100">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl text-blue-700 mb-8">
             <ShieldIcon size={20} className="shrink-0 mt-0.5" />
             <p className="text-xs font-medium leading-relaxed">
               By submitting, you agree that this is your original work and follows the <strong>University of Ibadan Academic Integrity Policy</strong>. Plagiarism will be automatically detected.
             </p>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={!file || isUploading}
            className={`w-full py-4 rounded-xl font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
              !file || isUploading
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-[#fdb813] text-[#002147] hover:bg-[#eab011] shadow-[#fdb813]/20'
            }`}
          >
            {isUploading ? "Uploading Securely..." : "Submit My Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
}