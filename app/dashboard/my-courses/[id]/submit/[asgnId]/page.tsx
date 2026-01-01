"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Upload, FileText, X, CheckCircle, ShieldIcon, Loader2, Info, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function SubmitAssignment() {
  const router = useRouter();
  const params = useParams();
  
  // Extract IDs based on your local folder structure [id] and [asgnId]
  const courseId = params.id as Id<"courses">;
  const assignmentId = params.asgnId as Id<"assignments">;

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [studentId, setStudentId] = useState<Id<"users"> | null>(null);

  // Convex Hooks
  const generateUploadUrl = useMutation(api.assignments.generateUploadUrl);
  const saveSubmission = useMutation(api.submissions.createSubmission);
  
  // Fetch Course and Assignment details
  const courseData = useQuery(api.courses.getCourseDetails, courseId ? { courseId } : "skip");
  const assignmentInfo = useQuery(api.assignments.getAssignmentById, assignmentId ? { assignmentId } : "skip");

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) setStudentId(id as Id<"users">);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file || !studentId) return;
    setIsUploading(true);

    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const { storageId } = await result.json();

      await saveSubmission({
        studentId,
        assignmentId,
        storageId,
        fileUrl: "", 
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload assignment.");
    } finally {
      setIsUploading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h1 className="text-2xl font-black text-[#002147] mb-1">Submission Successful!</h1>
        <p className="text-slate-500 font-medium mb-5">Your work for {courseData?.courseCode} has been recorded.</p>
        <Link href={`/dashboard/my-courses/${courseId}`} className="px-8 py-3 bg-[#002147] text-white rounded-xl font-semibold text-sm">
          Return to Classroom
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 font-bold text-sm mb-4 hover:text-[#002147]">
        <ChevronLeft size={18} /> Back to Classroom
      </button>

      {/* Assignment Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-black text-[#002147] mb-2">Upload Submission</h1>
        <p className="text-slate-500 font-medium text-[15px]">
          Course: <span className="text-[#002147] font-bold">{courseData?.courseCode || "..."} — {courseData?.courseName}</span>
        </p>
      </div>

      {/* Assignment Brief Card */}
      <div className="bg-white border border-blue-100 rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-2 text-blue-700">
          <Info size={20} />
          <h2 className="font-black uppercase text-xs tracking-widest">Assignment Brief</h2>
        </div>
        
        {assignmentInfo ? (
          <>
            <h3 className="text-xl font-black text-[#002147] mb-1">{assignmentInfo.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-2 whitespace-pre-wrap">
              {assignmentInfo.instructions}
            </p>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg">
                  <Calendar size={14} />
                  Due: {assignmentInfo.dueDate}
               </div>
            </div>
          </>
        ) : (
          <div className="animate-pulse flex flex-col gap-2">
            <div className="h-6 w-1/3 bg-blue-100 rounded"></div>
            <div className="h-4 w-full bg-blue-100 rounded"></div>
          </div>
        )}
      </div>

      {/* File Drop Zone */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        {!file ? (
          <label className="border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#fdb813] hover:bg-amber-50/30 transition-all group">
            <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" disabled={isUploading} />
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
                <p className="font-black text-[#002147] text-sm truncate max-w-[200px] md:max-w-md">{file.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            {!isUploading && (
              <button onClick={() => setFile(null)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg">
                <X size={20} />
              </button>
            )}
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-slate-100">
          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl text-slate-500 mb-8 border border-slate-100">
            <ShieldIcon size={20} className="shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium leading-relaxed">
              I certify that this submission is my own original work. I understand that submitting work that is not my own or failing to properly cite sources is a violation of academic integrity.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!file || isUploading || !studentId}
            className={`w-full py-4 rounded-xl font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
              !file || isUploading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-[#fdb813] text-[#002147] hover:bg-[#eab011] shadow-[#fdb813]/20'
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Finalizing Submission...
              </>
            ) : (
              "Confirm & Submit Assignment"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}