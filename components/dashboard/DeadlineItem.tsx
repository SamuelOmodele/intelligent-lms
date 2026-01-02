import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

type TDeadlineItem = {
  title: string;
  date: string;
  urgent?: boolean;
}

const DeadlineItem = ({ title, date, urgent }: TDeadlineItem) => {
    return (
        <div className={`group p-3 rounded-[3px] border-l-4 transition-all hover:shadow-sm cursor-pointer flex justify-between items-start gap-2 ${
            urgent ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-slate-50'
        }`}>
            <div className="flex-1">
                <p className="text-xs font-bold text-slate-800 line-clamp-1">{title}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{date}</p>
            </div>
            
            <Link href={'/dashboard/assignments'} className={`shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                urgent ? 'text-red-500' : 'text-slate-400'
            }`}>
                <ArrowUpRight size={18} strokeWidth={3} />
            </Link>
        </div>
    );
}

export default DeadlineItem;