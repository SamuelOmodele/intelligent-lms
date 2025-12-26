"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    BookMarked,
    Search,
    FileEdit,
    GraduationCap,
    Sparkles,
    LogOut,
    Loader2
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import StudyModal from './StudyModal';

type TProps = {
    isSidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ isSidebarOpen, setSidebarOpen }: TProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const handleLogout = () => {
        setIsLoggingOut(true);
        // Simulate a delay for the logout process
        setTimeout(() => {
            router.push('/login');
        }, 1500);
    };

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/dashboard' },
        { name: 'My Courses', icon: <BookMarked size={20} />, href: '/dashboard/my-courses' },
        { name: 'Courses', icon: <Search size={20} />, href: '/dashboard/all-courses' },
        { name: 'Assignments', icon: <FileEdit size={20} />, href: '/dashboard/assignments' },
        // { name: 'Intelligent Assistant', icon: <Sparkles size={20} className="text-[#fdb813]" />, href: '/dashboard/assistant' },
    ];

    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#002147] text-white transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
            <div className="h-full flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-blue-900 flex items-center gap-3">
                    <div className="bg-[#fdb813] p-1.5 rounded">
                        <GraduationCap className="h-6 w-6 text-[#002147]" />
                    </div>
                    <div>
                        <span className="font-bold text-lg tracking-tight -mb-1 block leading-none">iLMS</span>
                        <small className='text-blue-300/60 text-[11px] font-bold uppercase tracking-wider'>University of Ibadan</small>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 mt-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-bold ${pathname === item.href ? 'bg-[#fdb813] text-[#002147]' : 'text-blue-100 hover:bg-blue-900/50'
                                }`}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}
                    <Link
                        onClick={() => setOpenModal(true)}
                        href={''}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-semibold 'text-blue-100 hover:bg-blue-900/50'
                            }`}
                    >
                        <Sparkles size={20} className="text-[#fdb813]" />
                        Intelligent Assistant
                    </Link>
                </nav>

                <StudyModal
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                />

                {/* Logout with Shadcn AlertDialog */}
                <div className="p-4 border-t border-blue-900">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:text-red-100 hover:bg-red-500/10 rounded-lg transition-all text-sm font-medium outline-none">
                                <LogOut size={20} />
                                Logout
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white border-2 border-slate-100 rounded-2xl max-w-[380px]">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-[#002147] font-black text-xl">Confirm Logout</AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-500 font-medium">
                                    Are you sure you want to end your session? You will need to login again to access your courses.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel className="rounded-xl font-bold border-slate-200 text-slate-500">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold flex items-center gap-2"
                                >
                                    {isLoggingOut ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Signing out...
                                        </>
                                    ) : (
                                        "Yes, Logout"
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar;