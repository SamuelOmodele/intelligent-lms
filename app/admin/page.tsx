/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Building2, Plus, UserCircle, Users } from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h1 className="text-2xl font-black text-[#002147]">Institutional Overview</h1>
                    <p className="text-slate-500 font-medium">
                        Access institutional data, monitor students, and manage system-wide resources.
                    </p>
                </div>
                
                {/* GLOBAL COURSE CREATION */}
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="bg-[#fdb813] cursor-pointer text-[#002147] px-6 py-3 rounded-[5px] font-black text-xs uppercase flex items-center gap-2 hover:scale-105 transition-all shadow-xs">
                            <Plus size={18} /> Create New Course
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="font-black text-[#002147]">Global Course Creation</DialogTitle>
                        </DialogHeader>
                        <form className="space-y-4 mt-4">
                            <input className="w-full p-3 border rounded-xl" placeholder="Course Name (e.g. Intro to UI/UX)" />
                            <div className="flex gap-4">
                                <input className="flex-1 p-3 border rounded-xl" placeholder="Course Code" />
                                <select className="flex-1 p-3 border rounded-xl text-slate-500">
                                    <option>Select Lecturer</option>
                                    <option>Prof. Adeboye</option>
                                    <option>Dr. Sarah Idris</option>
                                </select>
                            </div>
                            <textarea className="w-full p-3 border rounded-xl h-24" placeholder="Course Description" />
                            <button className="w-full bg-[#002147] text-white py-4 rounded-xl font-black uppercase text-xs">Register Course</button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-10">
                <StatCard title="Total Students" count="12,450" growth="+12%" icon={<Users className="text-blue-600" />} />
                <StatCard title="Total Lecturers" count="148" growth="+3%" icon={<UserCircle className="text-purple-600" />} />
                <StatCard title="Active Courses" count="342" growth="0%" icon={<BookOpen className="text-emerald-600" />} />
                <StatCard title="Departments" count="12" growth="Stable" icon={<Building2 className="text-amber-600" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* RECENT COURSES TABLE */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="font-black text-[#002147] mb-6">Recently Created Courses</h3>
                    <div className="space-y-4">
                        {['CSC 401', 'MAT 211', 'STA 101'].map((code) => (
                            <div key={code} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-lg shadow-sm font-bold text-[#002147] text-xs">{code}</div>
                                    <div>
                                        <p className="font-bold text-sm text-[#002147]">Analysis of Algorithms</p>
                                        <p className="text-[11px] text-slate-400 font-bold uppercase">Lecturer: Prof. Adeboye</p>
                                    </div>
                                </div>
                                <button className="text-[10px] font-black uppercase text-[#002147] hover:underline">Manage</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ACTIVITY FEED */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="font-black text-[#002147] mb-6">System Logs</h3>
                    <div className="space-y-6">
                        <ActivityItem text="New Student Registered" time="2 mins ago" color="bg-blue-500" />
                        <ActivityItem text="Course 'MAT 111' Deleted" time="1 hour ago" color="bg-red-500" />
                        <ActivityItem text="New Lecturer Assigned" time="3 hours ago" color="bg-emerald-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-components for cleaner code
function StatCard({ title, count, growth, icon }: any) {
    return (
        <div className="bg-white p-6 rounded-[10px] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{growth}</span>
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
            <h2 className="text-2xl font-black text-[#002147]">{count}</h2>
        </div>
    );
}

function ActivityItem({ text, time, color }: any) {
    return (
        <div className="flex gap-4">
            <div className={`w-2 h-2 mt-1.5 rounded-full ${color}`} />
            <div>
                <p className="text-sm font-bold text-[#002147]">{text}</p>
                <p className="text-xs text-slate-400 font-medium">{time}</p>
            </div>
        </div>
    );
}