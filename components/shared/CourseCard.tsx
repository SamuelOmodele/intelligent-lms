// components/shared/CourseCard.tsx
import { BookOpen } from 'lucide-react';
import React from 'react';

// This matches your Convex "courses" table structure + UI extras
export type TCourseData = {
  id: string;
  code: string;
  name: string;
  dept: string;
  lecturerName: string;
  color?: string; // Optional: fallback provided in component
};

type TProps = {
  course: TCourseData;
  children: React.ReactNode;
};

const CourseCard = ({ course, children }: TProps) => {
  // Fallback color if none is provided by the DB/Props
  const bannerColor = course.color || "bg-[#002147]";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full">
      
      {/* Visual Header */}
      <div className={`${bannerColor} h-32 flex items-center justify-center relative overflow-hidden transition-transform group-hover:scale-105 duration-500`}>
        {/* Background Decorative Text */}
        <span className="text-white/10 font-black text-6xl absolute -right-4 -bottom-4 rotate-12 select-none uppercase">
          {course.dept}
        </span>
        
        {/* Icon Overlay */}
        <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30 shadow-inner">
          <BookOpen className="text-white" size={32} />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-[#002147] font-black text-xl leading-tight tracking-tight">
            {course.code}
          </h3>
          <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md tracking-widest uppercase">
            Active
          </span>
        </div>

        <p className="text-slate-600 font-bold text-sm line-clamp-2 mb-4 ">
          {course.name}
        </p>

        {/* Stats Row */}
        <div className="border-t border-slate-300 py-4 text-xs font-bold text-slate-600">
          LECTURER: {course.lecturerName}
        </div>

        {/* Actions Slot (Where your Link/Button goes) */}
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;