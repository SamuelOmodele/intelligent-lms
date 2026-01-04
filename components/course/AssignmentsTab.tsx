'use client'
import React, { useState, useRef } from 'react'
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Clock, Plus, Loader2, Trash2, FileText, Paperclip, X } from "lucide-react";
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';

function AssignmentsTab({ assignments, courseId }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [loading, setLoading] = useState(false);

    const getUrl = useMutation(api.assignments.getDownloadUrl); // We'll create this mutation/query next

    const handleViewDocument = async (storageId: string) => {
        try {
            const url = await getUrl({ storageId });
            if (url) {
                window.open(url, '_blank'); // Opens the document in a new tab
            } else {
                toast.error("Could not retrieve file URL");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error opening document");
        }
    };

    // File upload states
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        instructions: '',
        dueDate: '',
        attachmentId: '' // Convex storage ID
    });

    const generateUploadUrl = useMutation(api.assignments.generateUploadUrl);
    const createAssignment = useMutation(api.assignments.createAssignment);
    const updateAssignment = useMutation(api.assignments.updateAssignment);
    const deleteAssignment = useMutation(api.assignments.deleteAssignment);

    const handleOpenModal = (mode: 'create' | 'edit', assignment?: any) => {
        setModalMode(mode);
        setSelectedFile(null);
        if (mode === 'edit' && assignment) {
            setSelectedAssignmentId(assignment._id);
            setFormData({
                title: assignment.title,
                instructions: assignment.instructions,
                dueDate: assignment.dueDate,
                attachmentId: assignment.attachmentId || ''
            });
        } else {
            setSelectedAssignmentId(null);
            setFormData({ title: '', instructions: '', dueDate: '', attachmentId: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let storageId = formData.attachmentId;

            // Handle file upload if a new file is selected
            if (selectedFile) {
                const postUrl = await generateUploadUrl();
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": selectedFile.type },
                    body: selectedFile,
                });
                const { storageId: newId } = await result.json();
                storageId = newId;
            }

            if (modalMode === 'create') {
                await createAssignment({
                    courseId,
                    ...formData,
                    attachmentId: storageId,
                    status: 'Open'
                });
                toast.success("Assignment created with document!");
            } else {
                await updateAssignment({
                    assignmentId: selectedAssignmentId as any,
                    ...formData,
                    attachmentId: storageId
                });
                toast.success("Assignment updated!");
            }
            setIsModalOpen(false);
        } catch (error) {
            console.log(error);
            toast.error("An error occurred during upload.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedAssignmentId) return;
        setLoading(true);
        try {
            await deleteAssignment({ assignmentId: selectedAssignmentId as any });
            toast.success("Assignment deleted");
            setIsDeleteOpen(false);
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <button
                    onClick={() => handleOpenModal('create')}
                    className="flex items-center gap-2 bg-[#002147] text-white px-5 py-2.5 rounded-[5px] font-black text-xs uppercase hover:bg-[#003366] transition-all"
                >
                    <Plus size={18} /> Create Assignment
                </button>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle className="font-black text-[#002147]">
                            {modalMode === 'create' ? 'New Assignment' : 'Edit Assignment'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Title</label>
                            <input
                                type="text" required value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder='Assignment title'
                                className="w-full mt-1 p-3 border rounded-xl text-sm outline-none focus:ring-2 ring-blue-50"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Instructions</label>
                            <textarea
                                required value={formData.instructions}
                                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                className="w-full mt-1 p-3 border rounded-xl text-sm h-24 outline-none focus:ring-2 ring-blue-50"
                                placeholder="Describe the assignment or refer to the attached document..."
                            />
                        </div>

                        {/* Document Upload Section */}
                        <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                            <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Attached Document (PDF/Docx)</label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            />

                            {selectedFile ? (
                                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-blue-100">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <FileText size={16} className="text-blue-600 shrink-0" />
                                        <span className="text-xs font-bold truncate text-slate-600">{selectedFile.name}</span>
                                    </div>
                                    <button type="button" onClick={() => setSelectedFile(null)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full py-3 flex items-center justify-center gap-2 text-xs font-black uppercase text-[#002147] hover:bg-white transition-all"
                                >
                                    <Paperclip size={16} /> {formData.attachmentId ? 'Replace Document' : 'Attach Document'}
                                </button>
                            )}
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Due Date</label>
                            <input
                                type="date" required value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                className="w-full mt-1 p-3 border rounded-xl text-sm outline-none focus:ring-2 ring-blue-50"
                            />
                        </div>
                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-[#002147] text-white font-black py-4 rounded-[5px] uppercase text-xs mt-2 hover:bg-[#003366] transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : (modalMode === 'create' ? 'Create & Notify' : 'Update Assignment')}
                        </button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Modal (Same as before) */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader><DialogTitle className="font-black text-red-600">Delete Assignment?</DialogTitle></DialogHeader>
                    <p className='text-sm text-slate-600'>Are you sure you want to delete this assignment?</p>
                    <div className="flex gap-3 mt-2">
                        <button onClick={() => setIsDeleteOpen(false)} className="flex-1 py-3 text-xs font-black text-slate-500 bg-slate-100 rounded-xl">Cancel</button>
                        <button onClick={handleDelete} disabled={loading} className="flex-1 py-3 text-xs flex items-center justify-center font-black text-white bg-red-600 rounded-xl">
                            {loading ? <Loader2 className="animate-spin" size={14} /> : "Confirm Delete"}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {assignments.map((assignment: any) => {
                const today = new Date().getTime();
                // assignment.dueDate is now a timestamp (number)
                const isExpired = today > assignment.dueDate;
                const statusText = isExpired ? 'Closed' : 'Open';

                // Format the timestamp for display
                const displayDate = new Date(assignment.dueDate).toLocaleDateString();

                return (
                    <div key={assignment._id} className="bg-white rounded-[10px] border border-slate-200 p-6 flex justify-between items-center group hover:border-[#fdb813] transition-all shadow-sm">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${isExpired
                                    ? 'bg-red-100 text-red-700'   // Closed styling
                                    : 'bg-green-100 text-green-700' // Open styling (Changed from Amber for better contrast)
                                    }`}>
                                    {statusText}
                                </span>
                                {assignment.attachmentId && (
                                    <span onClick={() => handleViewDocument(assignment.attachmentId)} className="cursor-pointer text-[10px] font-black px-2 py-1 rounded-lg uppercase bg-blue-100 text-blue-700 flex items-center gap-1">
                                        <FileText size={10} /> Document Attached
                                    </span>
                                )}
                            </div>
                            <h3 className="text-lg font-black text-[#002147]">{assignment.title}</h3>
                            <p className="text-xs text-slate-400 font-bold mt-1 uppercase flex items-center gap-1.5">
                                <Clock size={14} /> Due {displayDate}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleOpenModal('edit', assignment)} className="px-6 py-2.5 bg-slate-100 text-[#002147] rounded-xl font-black text-xs uppercase hover:bg-slate-200 transition-colors">Edit</button>
                            <button onClick={() => { setSelectedAssignmentId(assignment._id); setIsDeleteOpen(true); }} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"><Trash2 size={18} /></button>
                        </div>
                    </div>
                )
            })}
            {assignments.length === 0 &&
                <div className='text-center text-sm bg-white p-10 rounded-[21px] text-slate-500'>
                    No Assignment Available
                </div>
            }
        </div>
    );
}

export default AssignmentsTab;