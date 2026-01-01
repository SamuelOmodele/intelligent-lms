/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowDownToLine, BookText } from "lucide-react";
import { toast } from "sonner";

function StudentLessonsTab({ lessons, setOpenStudyModal, setActiveLesson }: any) {

    // For downloading, we need a way to get the file URL
    const getDownloadUrl = useMutation(api.courses.getDownloadUrl);

    const handleDownload = async (storageId: string, fileName: string) => {
        try {
            const url = await getDownloadUrl({ storageId });
            if (!url) throw new Error("Could not generate download link");
            
            // Create a temporary link to trigger the download
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

    return (
        <div className="space-y-4">
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
                                Open Material
                            </button>
                            
                            <div className="flex items-center gap-2 border-l pl-3 border-slate-100">
                                <button 
                                    onClick={() => handleDownload(lesson.storageId, lesson.title)}
                                    title="Download Material"
                                >
                                    <ArrowDownToLine size={18} className='text-slate-400 hover:text-[#002147] cursor-pointer transition-colors' />
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default StudentLessonsTab;