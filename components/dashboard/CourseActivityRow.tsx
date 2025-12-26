type TCourseActivityRow = {
    lessonTopic: string
    code: string;
    name: string;
    progress: number;
    lastAccessed: string;
}

const CourseActivityRow = ({ lessonTopic, code, name, progress, lastAccessed }: TCourseActivityRow) => {
    return (
        <div className="cursor-pointer bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:opacity-80">
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
                {/* <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#fdb813]" style={{ width: `${progress}%` }}></div>
                </div> */}
                <p className="text-[13px] text-[#fdb813] font-medium ">Last seen: {lastAccessed}</p>

            </div>
        </div>
    );
}

export default CourseActivityRow