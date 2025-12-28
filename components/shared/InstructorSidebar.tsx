'use client'
import {
    BookOpen,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const InstructorSidebar = () => {

    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <div className="bg-[#002147] p-1.5 rounded-lg text-[#fdb813]">
                        <GraduationCap size={24} />
                    </div>
                    <span className="font-black text-xl text-[#002147] tracking-tight text-nowrap">PremierLMS</span>
                </div>

                <nav className="space-y-1">
                    <Link href={'/instructor'} className={`w-full flex items-center gap-3 px-4 py-3 ${pathname === '/instructor' || pathname === '/instructor/' ? 'bg-[#002147] text-white' : 'bg-white text-slate-500'} rounded-[10px] font-bold text-sm transition-all`}>
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link href={'/instructor/courses'} className={`w-full flex items-center gap-3 px-4 py-3 ${pathname.includes('/instructor/courses') ? 'bg-[#002147] text-white' : 'bg-white text-slate-500'} rounded-[10px] font-bold text-sm transition-all`}>
                        <BookOpen size={18} className="group-hover:text-[#002147]" /> Courses
                    </Link>
                    <Link href={'/instructor/students'} className={`w-full flex items-center gap-3 px-4 py-3 ${pathname.includes('/instructor/students') ? 'bg-[#002147] text-white' : 'bg-white text-slate-500'} rounded-[10px] font-bold text-sm transition-all`}>
                        <Users size={18} className="group-hover:text-[#002147]" /> Students
                    </Link>
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-slate-100">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold text-sm transition-all">
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </aside>
    )
}

export default InstructorSidebar