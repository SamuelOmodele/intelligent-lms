import React from 'react'

const InstructorNavbar = () => {
    return (
        <div className="bg-white border border-slate-200 h-20 flex justify-between items-center p-3">
            <div>
                <h1 className="text-xl font-black text-[#002147]">Dashboard</h1>
                <p className="text-slate-500 font-medium">Welcome back, Prof. Adeyemi</p>
            </div>
            <div className="bg-white p-2 rounded-[5px] border border-slate-200 flex items-center gap-3 pr-5">
                <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-[#002147] font-bold">I</div>
                <span className="text-sm font-black text-[#002147]">Instructor Panel</span>
            </div>
        </div>
    )
}

export default InstructorNavbar