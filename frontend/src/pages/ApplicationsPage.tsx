
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

interface Application {
    id: number;
    company: string;
    job_title: string;
    status: string;
    applied_at: string;
    salary_range: string;
}

const ApplicationsPage = () => {
    const { token } = useAuth();
    const [apps, setApps] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [formData, setFormData] = useState({
        company: '',
        job_title: '',
        status: 'APPLIED',
        salary_range: ''
    });

    useEffect(() => {
        fetchApps();
    }, []);

    const fetchApps = async () => {
        try {
            const response = await fetch('/api/v1/tracking/', {
                headers: { 'Authorization': `Token ${token}` }
            });
            const data = await response.json();
            if (response.ok) setApps(data);
        } catch (err) {
            console.error('Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/v1/tracking/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setShowAdd(false);
                setFormData({ company: '', job_title: '', status: 'APPLIED', salary_range: '' });
                fetchApps();
            }
        } catch (err) {
            console.error('Add failed');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'INTERVIEWING': return 'text-red-500 border-red-500/30 bg-red-500/10';
            case 'OFFER': return 'text-white border-white/30 bg-white/10';
            case 'REJECTED': return 'text-gray-600 border-gray-600/30 bg-gray-600/5';
            default: return 'text-gray-400 border-white/10 bg-white/5';
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            <Sidebar />
            <main className="flex-1 overflow-y-auto pt-16 lg:pt-0 min-w-0">
                <div className="p-4 sm:p-6 lg:p-10">

                    {/* Header */}
                    <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 lg:mb-12">
                        <div className="text-left">
                            <div className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Target Acquisition</div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black italic uppercase tracking-tighter">Tactical Applications</h1>
                        </div>
                        <button
                            onClick={() => setShowAdd(!showAdd)}
                            className="self-start sm:self-auto px-5 sm:px-8 py-3 sm:py-4 bg-red-600 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-[0_0_30px_rgba(255,0,0,0.2)] whitespace-nowrap"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5v14" /></svg>
                            <span className="hidden sm:inline">LOG NEW MISSION</span>
                            <span className="sm:hidden">Add</span>
                        </button>
                    </header>

                    {/* Add Form */}
                    {showAdd && (
                        <div className="mb-8 lg:mb-12 p-5 sm:p-8 bg-white/[0.02] border border-white/5 rounded-[28px] lg:rounded-[40px]">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Target Company</label>
                                    <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} required placeholder="EX: GOOGLE" className="bg-black border border-white/10 rounded-2xl py-4 px-6 text-xs font-bold tracking-widest focus:outline-none focus:border-red-500 transition-all uppercase" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Objective (Role)</label>
                                    <input type="text" value={formData.job_title} onChange={(e) => setFormData({ ...formData, job_title: e.target.value })} required placeholder="EX: STAFF ARCHITECT" className="bg-black border border-white/10 rounded-2xl py-4 px-6 text-xs font-bold tracking-widest focus:outline-none focus:border-red-500 transition-all uppercase" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Mission Status</label>
                                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="bg-black border border-white/10 rounded-2xl py-4 px-6 text-xs font-bold tracking-widest focus:outline-none focus:border-red-500 transition-all uppercase appearance-none">
                                        <option value="APPLIED">APPLIED</option>
                                        <option value="INTERVIEWING">INTERVIEWING</option>
                                        <option value="OFFER">OFFER</option>
                                        <option value="REJECTED">REJECTED</option>
                                    </select>
                                </div>
                                <button type="submit" className="py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-neutral-200 transition-all">EXECUTE LOGGING</button>
                            </form>
                        </div>
                    )}

                    {/* Mobile card list */}
                    <div className="flex flex-col gap-3 md:hidden">
                        {loading ? (
                            <div className="p-12 text-center opacity-30 uppercase tracking-[0.3em] text-[10px]">Interrogating Mission Logs...</div>
                        ) : apps.length === 0 ? (
                            <div className="p-12 text-center opacity-30 uppercase tracking-[0.3em] text-[10px]">No ongoing operations detected.</div>
                        ) : apps.map(app => (
                            <div key={app.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-[20px] hover:bg-white/[0.04] transition-all">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="font-black italic uppercase tracking-tighter text-base">{app.company}</div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">{app.job_title}</div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-[0.2em] border uppercase shrink-0 ${getStatusColor(app.status)}`}>{app.status}</span>
                                </div>
                                <div className="text-[9px] text-gray-600 uppercase tracking-widest font-bold mt-3">{new Date(app.applied_at).toLocaleDateString()}</div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block bg-white/[0.01] border border-white/5 rounded-[40px] overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
                                    <th className="p-6 lg:p-8">Target Entity</th>
                                    <th className="p-6 lg:p-8">Primary Objective</th>
                                    <th className="p-6 lg:p-8">Operational Status</th>
                                    <th className="p-6 lg:p-8">Commencement</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium">
                                {loading ? (
                                    <tr><td colSpan={4} className="p-20 text-center opacity-30 uppercase tracking-[0.3em] text-[10px]">Interrogating Mission Logs...</td></tr>
                                ) : apps.length === 0 ? (
                                    <tr><td colSpan={4} className="p-20 text-center opacity-30 uppercase tracking-[0.3em] text-[10px]">No ongoing operations detected.</td></tr>
                                ) : apps.map(app => (
                                    <tr key={app.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-all group">
                                        <td className="p-6 lg:p-8">
                                            <div className="font-black italic uppercase tracking-tighter text-lg">{app.company}</div>
                                        </td>
                                        <td className="p-6 lg:p-8 opacity-60 uppercase tracking-widest text-xs font-bold">{app.job_title}</td>
                                        <td className="p-6 lg:p-8">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] border uppercase ${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="p-6 lg:p-8 opacity-40 uppercase tracking-widest text-[10px] font-bold">
                                            {new Date(app.applied_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default ApplicationsPage;
