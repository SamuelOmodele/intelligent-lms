/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
// import { toast } from "sonner"; // Or your preferred toast library

type TProps = { children: React.ReactNode };

const CreateCourseModal = ({ children }: TProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Data fetching
  const lecturers = useQuery(api.courses.getLecturers);
  const createCourse = useMutation(api.courses.create);

  // Form State
  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    lecturerId: "" as Id<"users"> | "",
    department: "Computer Science",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lecturerId) return alert("Please select a lecturer");
    
    setLoading(true);
    try {
      await createCourse({
        courseName: formData.courseName,
        courseCode: formData.courseCode,
        lecturerId: formData.lecturerId as Id<"users">,
        department: formData.department,
        description: formData.description,
      });
      setOpen(false); // Close modal on success
      setFormData({ courseName: "", courseCode: "", lecturerId: "", department: "Computer Science", description: "" });
      alert("Course registered successfully!");
    } catch (error: any) {
      alert(error.data || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-lg uppercase font-black text-[#002147]">
            Create New Course
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-0">
          <input
            required
            className="w-full p-3 border rounded-xl outline-[#002147]"
            placeholder="Course Name (e.g. Intro to UI/UX)"
            value={formData.courseName}
            onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
          />
          <div className="flex gap-4">
            <input
              required
              className="flex-1 p-3 border rounded-xl outline-[#002147]"
              placeholder="Course Code"
              value={formData.courseCode}
              onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
            />
            <select
              required
              className="flex-1 p-3 border rounded-xl bg-white"
              value={formData.lecturerId}
              onChange={(e) => setFormData({ ...formData, lecturerId: e.target.value as Id<"users"> })}
            >
              <option value="">Select Lecturer</option>
              {lecturers?.map((l) => (
                <option key={l._id} value={l._id}>{l.name}</option>
              ))}
            </select>
          </div>
          <select
            className="w-full p-3 border rounded-xl bg-white"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          >
            <option>Computer Science</option>
            <option>Mathematics</option>
            <option>Statistics</option>
          </select>
          <textarea
            required
            className="w-full p-3 border rounded-xl h-24 outline-[#002147]"
            placeholder="Course Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <button
            disabled={loading}
            className="w-full bg-[#002147] text-white py-4 rounded-xl font-black uppercase text-xs flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Register Course"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseModal;