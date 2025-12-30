"use client";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    UserCircle,
    LogOut,
    GraduationCap,
    Building2,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import LogoutModal from './AdminLogoutModal';
import useLogout from '@/app/lib/useLogout';

const AdminSidebar = () => {
    const pathname = usePathname();

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { handleLogout } = useLogout({ setIsLoggingOut });

    const menuItems = [
        { name: 'Overview', icon: <LayoutDashboard size={18} />, path: '/admin' },
        { name: 'Courses', icon: <BookOpen size={18} />, path: '/admin/courses' },
        { name: 'Lecturers', icon: <UserCircle size={18} />, path: '/admin/lecturers' },
        { name: 'Students', icon: <Users size={18} />, path: '/admin/students' },
        { name: 'Departments', icon: <Building2 size={18} />, path: '/admin/departments' },
    ];

    const [showLogout, setShowLogout] = useState(false);

    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-50">
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
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[10px] font-bold text-sm transition-all ${pathname === item.path ? 'bg-[#002147] text-white shadow-lg shadow-blue-900/20' : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            {item.icon} {item.name}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-slate-100">
                <button onClick={() => setShowLogout(true)} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold text-sm transition-all">
                    <LogOut size={18} /> Logout
                </button>
            </div>
            <LogoutModal
                isLoggingOut={isLoggingOut}
                isOpen={showLogout}
                onClose={() => setShowLogout(false)}
                onConfirm={handleLogout}
            />
        </aside>
    );
};

export default AdminSidebar;


