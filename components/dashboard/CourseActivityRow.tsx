import Link from "next/link";

type TCourseActivityRow = {
    lessonTopic: string
    code: string;
    name: string;
    id: string
}

const CourseActivityRow = ({ lessonTopic, code, name, id}: TCourseActivityRow) => {
    return (
        <div className=" bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:opacity-80">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#002147] rounded-lg flex items-center justify-center text-[#fdb813] font-bold text-xs">
                    {code.split(' ')[0]}
                </div>
                <div>
                    <p className="text-sm font-black text-[#002147]">{lessonTopic}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{code} : {name}</p>
                </div>
            </div>
            <div className=" hidden sm:block">
                <Link href={`/dashboard/my-courses/${id}`} className="text-[13px] text-[#fdb813] font-medium cursor-pointer">Visit course</Link>
            </div>
        </div>
    );
}

export default CourseActivityRow