'use client'
import React from 'react';
import {
  LayoutDashboard,
  FileText,
  UserCheck,
  Library,
  Globe,
  Bell,
  ChevronRight,
  GraduationCap,
  Lock
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UniversityLMS() {

  const router = useRouter();
  return (
    <div className="font-nunito min-h-screen bg-white text-slate-900">
      {/* --- Top Utility Bar --- */}
      <div className="bg-[#002147] text-white py-2 border-b border-blue-900/30">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
          <span>University of Ibadan • Learning Management System</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#fdb813]">University Home</a>
            <a href="#" className="hover:text-[#fdb813]">Contact Support</a>
          </div>
        </div>
      </div>

      {/* --- Main Navigation --- */}
      <nav className="font-nunito sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-20 items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#002147] p-2 rounded">
              <GraduationCap className="h-8 w-8 text-[#fdb813]" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#002147] leading-none uppercase">PremierLms</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">University of Ibadan</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-700">
            <a href="#" className="hover:text-[#002147]">Courses</a>
            <a href="#" className="hover:text-[#002147]">Departments</a>
            <a href="#" className="hover:text-[#002147]">E-Library</a>
            <button onClick={() => router.push('/login')} className="cursor-pointer flex items-center gap-2 px-6 py-2.5 bg-[#002147] text-white rounded hover:bg-[#003366] transition-all shadow-md">
              <Lock size={14} />
              Login to Portal
            </button>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="relative bg-[#EEF5FF] pt-16 pb-24 border-b border-slate-100">
        <div className=" mx-auto max-w-[700px] px-4 sm:px-6 lg:px-8">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl lg:text-6xl font-extrabold text-center text-[#002147] leading-tight mb-6">
              Advancing the Frontiers of <span className="text-[#FDB813] italic">Learning.</span>
            </h2>
            <p className="text-center text-lg text-slate-600 mb-8 mx-auto lg:mx-0 leading-relaxed">
              The centralized digital gateway for the University of Ibadan. Access your lecture materials,
              submit assignments, and track your academic performance in one unified platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-10 py-4 bg-[#002147] text-white rounded-md font-bold hover:shadow-lg transition-all">
                Access My Courses
              </button>
              <button className="px-10 py-4 bg-white border-2 border-[#002147] text-[#002147] rounded-md font-bold hover:bg-slate-50 transition-all">
                Staff Directory
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- Key Modules Section --- */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-[#002147]">Academic Support Modules</h3>
            <div className="w-20 h-1 bg-[#fdb813] mx-auto mt-4"></div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <ModuleCard
              icon={<LayoutDashboard size={28} />}
              title="Dashboard"
              desc="Comprehensive overview of registered courses and schedules."
            />
            <ModuleCard
              icon={<FileText size={28} />}
              title="Course Content"
              desc="Download lecture notes, slides, and supplementary materials."
            />
            <ModuleCard
              icon={<UserCheck size={28} />}
              title="Assessments"
              desc="Take quizzes, submit assignments, and view grading history."
            />
            <ModuleCard
              icon={<Library size={28} />}
              title="Digital Library"
              desc="Access global academic journals and UI's local archives."
            />
          </div>
        </div>
      </section>

      {/* --- Announcements / News Section --- */}
      <section className="py-20 bg-[#002147] text-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4 text-[#fdb813]">
              <Bell size={20} />
              <span className="font-bold tracking-widest uppercase text-sm">Announcements</span>
            </div>
            <h3 className="text-3xl font-bold mb-6">Stay updated with University Academic Calendars.</h3>
            <div className="space-y-6">
              <NewsItem date="24 Oct" text="Release of Second Semester Continuous Assessment schedules." />
              <NewsItem date="18 Oct" text="Faculty of Science: Guidelines for Post-Graduate research submissions." />
              <NewsItem date="10 Oct" text="System Maintenance: The LMS will be offline for 2 hours this Sunday." />
            </div>
          </div>
          <div className="bg-blue-900/40 p-10 rounded-2xl border border-blue-800">
            <h4 className="text-xl font-bold mb-4">Quick Statistics</h4>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-3xl font-black text-[#fdb813]">450+</p>
                <p className="text-sm opacity-70">Available Courses</p>
              </div>
              <div>
                <p className="text-3xl font-black text-[#fdb813]">2,000+</p>
                <p className="text-sm opacity-70">Faculty Members</p>
              </div>
              <div>
                <p className="text-3xl font-black text-[#fdb813]">15</p>
                <p className="text-sm opacity-70">Faculties</p>
              </div>
              <div>
                <p className="text-3xl font-black text-[#fdb813]">24/7</p>
                <p className="text-sm opacity-70">Platform Access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Institutional Footer --- */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-6 w-6 text-[#002147]" />
              <span className="font-bold text-[#002147] tracking-tight">University of Ibadan</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Nigeria&apos;s premier university. Founded in 1948, the University of Ibadan is the oldest and most prestigious degree-awarding institution in Nigeria.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 mb-4">Helpful Links</h5>
            <ul className="text-sm text-slate-600 space-y-2">
              <li><a href="#" className="hover:text-[#002147]">IT Helpdesk</a></li>
              <li><a href="#" className="hover:text-[#002147]">Registrar&apos;s Office</a></li>
              <li><a href="#" className="hover:text-[#002147]">MIS Unit</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 mb-4">Location</h5>
            <p className="text-sm text-slate-600 leading-relaxed">
              Oduduwa Road, University of Ibadan,<br />
              Ibadan, Oyo State, Nigeria.
            </p>
          </div>
        </div>
        <div className="text-center border-t border-slate-200 pt-8 mt-8">
          <p className="text-xs text-slate-400">© 2025 University of Ibadan LMS. Developed for Academic Research Purposes.</p>
        </div>
      </footer>
    </div>
  );
}

function ModuleCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 border border-slate-200 rounded-xl hover:border-[#002147] hover:shadow-lg transition-all group">
      <div className="text-slate-400 group-hover:text-[#002147] mb-6 transition-colors">
        {icon}
      </div>
      <h4 className="text-lg font-bold text-slate-900 mb-3">{title}</h4>
      <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function NewsItem({ date, text }: { date: string, text: string }) {
  return (
    <div className="flex gap-4 items-start group cursor-pointer">
      <div className="bg-[#fdb813] text-[#002147] font-black p-2 min-w-[60px] text-center rounded text-xs uppercase">
        {date}
      </div>
      <p className="text-sm text-blue-100 group-hover:text-white transition-colors">{text}</p>
    </div>
  );
}