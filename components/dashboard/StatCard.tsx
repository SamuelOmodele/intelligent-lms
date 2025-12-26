import React from 'react'

type TStatCard = {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string
}

const StatCard = ({ icon, label, value, color }: TStatCard) => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-[#cac9d9] flex items-center gap-4">
            <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
                <p className="text-xl font-black text-[#002147]">{value}</p>
            </div>
        </div>
    );
}

export default StatCard