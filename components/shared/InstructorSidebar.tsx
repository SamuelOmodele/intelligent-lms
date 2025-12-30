'use client'
import React, { useState } from 'react';
import {
    BookOpen,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    Users,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

const InstructorSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);

    const handleLogout = () => {
        // Add your logout logic here (e.g., clearing cookies/local storage)
        console.log("Logging out...");
        router.push('/login');
    };

    return (
        <>
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="bg-[#002147] p-1.5 rounded-lg text-[#fdb813]">
                            <GraduationCap size={24} />
                        </div>
                        <div>
                            <span className="font-black text-xl text-[#002147] tracking-tight">PremierLms</span>
                            <p className='text-xs text-slate-500'>UNIVERSITY OF IBADAN</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        <Link href={'/instructor'} className={`w-full flex items-center gap-3 px-4 py-3 ${pathname === '/instructor' || pathname === '/instructor/' ? 'bg-[#002147] text-white' : 'bg-white text-slate-500 hover:bg-[#fafafa]'} rounded-[10px] font-bold text-sm transition-all`}>
                            <LayoutDashboard size={18} /> Dashboard
                        </Link>
                        <Link href={'/instructor/courses'} className={`w-full flex items-center gap-3 px-4 py-3 ${pathname.includes('/instructor/courses') ? 'bg-[#002147] text-white' : 'bg-white text-slate-500 hover:bg-[#fafafa]'} rounded-[10px] font-bold text-sm transition-all`}>
                            <BookOpen size={18} /> Courses
                        </Link>
                        <Link href={'/instructor/students'} className={`w-full flex items-center gap-3 px-4 py-3 ${pathname.includes('/instructor/students') ? 'bg-[#002147] text-white' : 'bg-white text-slate-500 hover:bg-[#fafafa]'} rounded-[10px] font-bold text-sm transition-all`}>
                            <Users size={18} /> Students
                        </Link>
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-slate-100">
                    <button
                        onClick={() => setIsLogoutOpen(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold text-sm transition-all"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Logout Confirmation Modal */}
            <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
                <DialogContent className="sm:max-w-[500px] p-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle size={32} />
                        </div>

                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black text-[#002147] text-center">
                                Sign Out
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium text-center pt-2 text-[16px]">
                                Are you sure you want to log out? You will need to sign back in to manage your courses.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex w-full gap-3 mt-8">
                            <button
                                onClick={handleLogout}
                                className="w-full py-3 bg-red-500 text-white rounded-[12px] font-black uppercase hover:bg-red-400 transition-all shadow-red-100 text-[13px]"
                            >
                                Yes, Sign Me Out
                            </button>
                            <button
                                onClick={() => setIsLogoutOpen(false)}
                                className="w-full py-3 bg-slate-100 text-[#002147] rounded-[12px] font-black uppercase hover:bg-slate-200 transition-all text-[13px]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default InstructorSidebar;