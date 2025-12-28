import { TCourseData } from '@/app/dashboard/all-courses/page';
import { BookOpen, Clock, } from 'lucide-react';

type TProps = {
    course: TCourseData;
    children: React.ReactNode
}

const CourseCard = ({ course, children }: TProps) => {


    return (
        <div key={course.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-all group flex flex-col">
            {/* Course Placeholder Image */}
            <div className={`${course.color} h-32 flex items-center justify-center relative overflow-hidden`}>
                <span className="text-white/20 font-black text-6xl absolute -right-4 -bottom-4 rotate-12">{course.dept}</span>
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30">
                    <BookOpen className="text-white" size={32} />
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-[#002147] font-black text-xl leading-tight">{course.code}</h3>
                    <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-2 py-1 rounded tracking-widest">{course.level}</span>
                </div>
                <p className="text-slate-600 font-bold text-sm mb-4 line-clamp-2">{course.name}</p>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between mb-6 text-slate-500 font-bold text-xs">
                    <span className="flex items-center gap-1"><Clock size={14} /> {course.units} Units</span>
                    <span>{course.semester} Sem.</span>
                </div>
                {/* --- FOR THE BUTTON TO BE DISPLAYED --- */}
                {children}
            </div>
        </div>
    )
}

export default CourseCard