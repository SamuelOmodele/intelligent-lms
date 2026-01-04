/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import CreateCourseModal from "@/components/modals/CreateCourseModal";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    BookOpen,
    Building2,
    Plus,
    UserCircle,
    Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {

    const router = useRouter();

    // Fetch live dashboard data
    const stats = useQuery(api.dashboard.getStats);

    // Helper to map log types to your existing CSS colors
    const getLogColor = (type: string) => {
        switch (type) {
            case "user": return "bg-blue-500";
            case "course": return "bg-red-500";
            case "system": return "bg-emerald-500";
            default: return "bg-slate-400";
        }
    };

    // Helper to format time ago (simple version)
    const formatTime = (ts: number) => {
        // eslint-disable-next-line react-hooks/purity
        const diff = Date.now() - ts;
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        return new Date(ts).toLocaleDateString();
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h1 className="text-2xl font-black text-[#002147]">Institutional Overview</h1>
                    <p className="text-slate-500 font-medium">
                        Access institutional data, monitor students, and manage system-wide resources.
                    </p>
                </div>

                <CreateCourseModal>
                    <button className="bg-[#fdb813] cursor-pointer text-[#002147] px-6 py-3 rounded-[5px] font-black text-xs uppercase flex items-center gap-2 hover:scale-105 transition-all shadow-xs">
                        <Plus size={18} /> Create New Course
                    </button>
                </CreateCourseModal>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-10">
                <StatCard
                    title="Total Students"
                    count={stats?.totalStudents ?? "..."}
                    growth="Live"
                    icon={<Users className="text-blue-600" />}
                />
                <StatCard
                    title="Total Lecturers"
                    count={stats?.totalLecturers ?? "..."}
                    growth="Live"
                    icon={<UserCircle className="text-purple-600" />}
                />
                <StatCard
                    title="Active Courses"
                    count={stats?.totalCourses ?? "..."}
                    growth="Stable"
                    icon={<BookOpen className="text-emerald-600" />}
                />
                <StatCard
                    title="Departments"
                    count={stats?.totalDepartments ?? "..."}
                    growth="Stable"
                    icon={<Building2 className="text-amber-600" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* RECENT COURSES TABLE */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="font-black text-[#002147] mb-6">Recently Created Courses</h3>
                    <div className="space-y-4">
                        {stats?.recentCourses.map((course) => (
                            <div key={course.courseCode} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-lg shadow-sm font-bold text-[#002147] text-xs">{course.courseCode}</div>
                                    <div>
                                        <p className="font-bold text-sm text-[#002147]">{course.courseName}</p>
                                        <p className="text-[11px] text-slate-400 font-bold uppercase">{course.lecturerName}</p>
                                    </div>
                                </div>
                                <button className="text-[10px] font-black uppercase text-[#002147] hover:underline" onClick={() => router.push('/admin/courses')}>View</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ACTIVITY FEED - NOW FUNCTIONAL */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="font-black text-[#002147] mb-6">System Logs</h3>
                    <div className="space-y-6">
                        {stats?.logs.length === 0 && (
                            <p className="text-xs text-slate-400">No recent activity.</p>
                        )}
                        {stats?.logs.map((log: any) => (
                            <ActivityItem
                                key={log._id}
                                text={log.action}
                                time={formatTime(log.timestamp)}
                                color={getLogColor(log.type)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, count, growth, icon }: any) {
    return (
        <div className="bg-white p-6 rounded-[10px] border border-slate-200 shadow-sm hover:border-[#fdb813] transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-[#fdb813]/10 transition-colors">{icon}</div>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Live</span>
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