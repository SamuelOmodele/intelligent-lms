/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowDownToLine, BookText, Plus, Upload, Loader2, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

function LessonsTab({ lessons, courseId, setOpenStudyModal, setActiveLesson }: any) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Mutations
    const generateUploadUrl = useMutation(api.courses.generateUploadUrl);
    const createLesson = useMutation(api.courses.createLesson);
    const deleteLesson = useMutation(api.courses.deleteLesson);

    // For downloading
    const getDownloadUrl = useMutation(api.courses.getDownloadUrl);

    const handlePublishLesson = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUploading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const week = parseInt(formData.get("week") as string);
        const fileInput = (e.currentTarget.elements.namedItem("file") as HTMLInputElement);
        const file = fileInput.files?.[0];

        const lecturerIdForExternal = 1; // REPLACE THIS with actual lecturer integer ID

        if (!title || isNaN(week) || !file) {
            toast.error("Please fill all fields and select a valid file");
            setIsUploading(false);
            return;
        }

        // Detect Format (DOCX or PDF)
        const fileExtension = file.name.split('.').pop()?.toUpperCase() || "PDF";

        try {
            // --- STEP 1: EXTERNAL ENDPOINT UPLOAD ---
            const externalFormData = new FormData();
            externalFormData.append("lecturer_id", lecturerIdForExternal.toString());
            externalFormData.append("file", file);

            const externalResponse = await fetch("https://jerold-unsuperior-fonda.ngrok-free.dev/bot/embed-lecture-note/", {
                method: "POST",
                body: externalFormData, 
            });

            if (!externalResponse.ok) throw new Error("AI Embedding service failed, Please try again.");

            const { lecture_id } = await externalResponse.json();

            // --- STEP 2: CONVEX STORAGE UPLOAD ---
            const postUrl = await generateUploadUrl();
            const convexResult = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });
            const { storageId } = await convexResult.json();

            // --- STEP 3: CREATE LESSON IN CONVEX ---
            await createLesson({
                title,
                week,
                courseId,
                storageId,
                format: fileExtension, // Dynamically set to DOCX, DOC, or PDF
                lecture_id: lecture_id,
            });

            toast.success("Lesson published successfully!");
            setOpen(false);
        } catch (error: any) {
            console.error(error);
            setError(error.message || "An unexpected error occurred");
            toast.error("Failed to upload lesson.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (lessonId: any, storageId: string) => {
        if (!confirm("Are you sure you want to delete this lesson? This cannot be undone.")) return;

        setIsDeleting(lessonId);
        try {
            await deleteLesson({ lessonId, storageId });
            toast.success("Lesson deleted");
        } catch (error) {
            console.log(error)
            toast.error("Failed to delete lesson");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleDownload = async (storageId: string, fileName: string) => {
        try {
            const url = await getDownloadUrl({ storageId });
            if (!url) throw new Error("Could not generate download link");

            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch {
            toast.error("Error downloading file");
        }
    };

    useEffect(() => {
        if (!open) {
            setError(null);
        }
    }, [open])

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <button className="flex items-center gap-2 bg-[#002147] text-white px-5 py-2.5 rounded-[5px] cursor-pointer font-black text-xs uppercase hover:bg-[#003366] transition-all">
                            <Plus size={18} /> Create New Lesson
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                            <DialogTitle className="font-black text-[#002147]">Create New Lesson</DialogTitle>
                        </DialogHeader>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-in fade-in zoom-in duration-200">
                                <AlertCircle size={18} className="shrink-0" />
                                <p className="font-medium">{error}</p>
                            </div>
                        )}
                        <form onSubmit={handlePublishLesson} className={`space-y-4 ${error ? 'mt-0' : 'mt-4'}`}>
                            <div>
                                <label className="text-xs font-semibold uppercase text-slate-600">Lesson Title</label>
                                <input
                                    name="title"
                                    type="text"
                                    required
                                    className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-1 ring-[#002147]"
                                    placeholder="e.g. Graph Theory Part 1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase text-slate-600">Week Number</label>
                                <input
                                    name="week"
                                    type="number"
                                    required
                                    className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-1 ring-[#002147]"
                                    placeholder="4"
                                />
                            </div>
                            <label htmlFor="upload_element" className="block my-6">
                                <div className="cursor-pointer border-2 border-dashed border-slate-200 p-6 rounded-2xl text-center relative">
                                    <Upload className="mx-auto text-slate-300 mb-2" />
                                    <p className="text-xs font-bold text-slate-500 mb-2">Upload Lesson Material (PDF, DOC, DOCX)</p>
                                    <input
                                        name="file"
                                        id="upload_element"
                                        type="file"
                                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        required
                                        className="text-xs text-slate-400 ml-auto"
                                    />
                                </div>
                            </label>
                            <button
                                type="submit"
                                disabled={isUploading}
                                className="w-full bg-[#fdb813] text-[#002147] font-black py-3 rounded-[5px] uppercase text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isUploading ? (
                                    <><Loader2 className="animate-spin" size={16} /> Uploading...</>
                                ) : (
                                    "Publish Lesson"
                                )}
                            </button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {lessons.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 font-bold text-sm">No lessons uploaded yet.</div>
            ) : (
                lessons.map((lesson: any) => (
                    <div key={lesson._id} className="bg-white px-4 py-5 rounded-[10px] border border-slate-200 flex items-center justify-between hover:border-[#fdb813] transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><BookText size={20} /></div>
                            <div>
                                <p className="font-black text-[#002147]">Week {lesson.week}: {lesson.title}</p>
                                <p className="text-xs text-slate-400 font-bold uppercase">{lesson.format || 'PDF'} Material</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-3'>
                            <button
                                onClick={() => { setActiveLesson(lesson); setOpenStudyModal(true); }}
                                className="text-[10px] font-black uppercase text-[#002147] bg-[#fdb813] px-3 py-2 rounded-lg hover:brightness-95 transition-all"
                            >
                                Preview
                            </button>

                            <div className="flex items-center gap-2 border-l pl-3 border-slate-100">
                                <button
                                    onClick={() => handleDownload(lesson.storageId, lesson.title)}
                                    title="Download Material"
                                >
                                    <ArrowDownToLine size={18} className='text-slate-400 hover:text-[#002147] cursor-pointer transition-colors' />
                                </button>

                                <button
                                    onClick={() => handleDelete(lesson._id, lesson.storageId)}
                                    disabled={isDeleting === lesson._id}
                                    className="text-slate-400 cursor-pointer hover:text-red-600 transition-colors"
                                    title="Delete Lesson"
                                >
                                    {isDeleting === lesson._id ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <Trash2 size={18} />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default LessonsTab;