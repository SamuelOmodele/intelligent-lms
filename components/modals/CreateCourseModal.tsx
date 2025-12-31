/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
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

type TProps = { children: React.ReactNode };

const CreateCourseModal = ({ children }: TProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Data fetching
  const lecturers = useQuery(api.courses.getLecturers);
  const departments = useQuery(api.departments.list);
  const createCourse = useMutation(api.courses.create);

  // Form State
  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    lecturerId: "" as Id<"users"> | "",
    department: "", // Changed to empty string for enforcement
    description: "",
  });

  // Reset lecturer if department changes to prevent cross-dept assignment
  useEffect(() => {
    setFormData((prev) => ({ ...prev, lecturerId: "" }));
  }, [formData.department]);

  // Filtered lecturers based on selected department
  const filteredLecturers = lecturers?.filter(
    (l) => l.department === formData.department
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.department) return alert("Please select a department first");
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

      setOpen(false);
      setFormData({
        courseName: "",
        courseCode: "",
        lecturerId: "",
        department: "",
        description: ""
      });
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
          
          {/* 1. Department Selection (Enforced First) */}
          <div className="space-y-1">
            <select
              required
              className="w-full p-3 border rounded-xl outline-[#002147]"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              <option value="">-- Choose department --</option>
              {!departments && <option>Loading departments...</option>}
              {departments?.map((dept) => (
                <option key={dept._id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

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

            {/* 2. Lecturer Selection (Filtered by Dept) */}
            <select
              required
              disabled={!formData.department}
              className="flex-1 p-3 border rounded-xl bg-white disabled:bg-slate-50 disabled:cursor-not-allowed"
              value={formData.lecturerId}
              onChange={(e) => setFormData({ ...formData, lecturerId: e.target.value as Id<"users"> })}
            >
              <option value="">
                Select Lecturer
              </option>
              {filteredLecturers?.map((l) => (
                <option key={l._id} value={l._id}>{l.name}</option>
              ))}
            </select>
          </div>

          <textarea
            required
            className="w-full p-3 border rounded-xl h-24 outline-[#002147]"
            placeholder="Course Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          
          <button
            disabled={loading || !formData.lecturerId}
            className="w-full bg-[#002147] text-white py-4 rounded-xl font-black uppercase text-xs flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Register Course"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseModal;