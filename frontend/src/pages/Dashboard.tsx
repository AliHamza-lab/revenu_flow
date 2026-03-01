
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

interface StatusBreakdown {
    WISHLIST: number;
    APPLIED: number;
    INTERVIEWING: number;
    OFFER: number;
    REJECTED: number;
}

interface WeeklyActivity {
    day: string;
    date: string;
    count: number;
}

interface RecentApplication {
    id: number;
    company: string;
    job_title: string;
    status: string;
    match_score: number;
    applied_at: string | null;
    created_at: string;
}

interface Stats {
    resumeCount: number;
    applicationCount: number;
    interviewCount: number;
    intelligenceScore: number;
    topResumeScore: number;
    successRate: number;
    statusBreakdown: StatusBreakdown;
    weeklyActivity: WeeklyActivity[];
    recentApplications: RecentApplication[];
}

const STATUS_STYLE: Record<string, string> = {
    'INTERVIEWING': 'bg-red-600/10 border-red-600/30 text-red-500',
    'OFFER': 'bg-emerald-600/10 border-emerald-600/30 text-emerald-400',
    'APPLIED': 'bg-blue-600/10 border-blue-600/30 text-blue-400',
    'REJECTED': 'bg-white/5 border-white/10 text-gray-500',
    'WISHLIST': 'bg-white/5 border-white/10 text-gray-400',
};

const Dashboard = () => {
    const { user, token } = useAuth();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/v1/users/stats/', {
                    headers: { 'Authorization': `Token ${token}` },
                });
                const data = await response.json();
                if (response.ok) {
                    setStats(data);
                } else {
                    setError('Failed to load dashboard data.');
                }
            } catch {
                setError('Network error — could not reach the server.');
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchStats();
    }, [token]);

    // Derive chart heights from weeklyActivity (max bar = 100%)
    const maxActivity = stats
        ? Math.max(...stats.weeklyActivity.map(d => d.count), 1)
        : 1;

    const advisorMessage = loading
        ? 'INITIALIZING INTELLIGENCE NETWORK...'
        : stats && stats.applicationCount === 0
            ? 'No applications tracked yet. Add your first target to activate strategic analysis.'
            : stats
                ? `SUCCESS RATE: ${stats.successRate}% · TOP RESUME SCORE: ${stats.topResumeScore}/100. ${stats.statusBreakdown.INTERVIEWING > 0
                    ? `You have ${stats.statusBreakdown.INTERVIEWING} active interview(s). Prepare your talking points.`
                    : 'Add AI/startup targets to your pipeline — our data shows 22% higher offer probability.'
                }`
                : 'AWAITING DATA...';

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(255,0,0,0.03)_0%,transparent_50%)]">
                <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-black/50 backdrop-blur-xl sticky top-0 z-10">
                    <div className="relative w-96">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        <input
                            type="text"
                            placeholder="QUERY CAREER DATABASE..."
                            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-6 text-xs font-medium tracking-widest focus:outline-none focus:border-red-500/50 transition-all uppercase"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative text-gray-400 hover:text-white transition-all p-2 bg-white/5 rounded-lg border border-white/5">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-black"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                            <div className="text-right">
                                <div className="text-xs font-black uppercase tracking-widest text-white italic">{user?.username || 'Elite Operative'}</div>
                                <div className="text-[10px] text-red-500 font-black uppercase tracking-widest text-right">ELITE OPERATIVE</div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-900 border border-white/20 shadow-[0_0_15px_rgba(255,0,0,0.2)]"></div>
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto flex flex-col gap-10">
                    {/* Welcome Area */}
                    <section className="flex items-end justify-between">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1 text-left">
                                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                                {loading ? 'Loading...' : error ? 'Error' : 'System Authorized'}
                            </div>
                            <h1 className="text-5xl font-black tracking-tighter mb-2 uppercase italic leading-none text-left">COMMAND CENTER</h1>
                            <p className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase text-left">
                                {stats?.applicationCount
                                    ? `${stats.applicationCount} Applications Tracked · ${stats.statusBreakdown?.INTERVIEWING || 0} Interviewing`
                                    : 'Target: Full-Stack Architect @ Silicon Valley'}
                            </p>
                        </div>
                        <button className="px-8 py-4 bg-red-600 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all transform hover:scale-[1.05] shadow-[0_0_30px_rgba(255,0,0,0.2)]">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                            Execute New Application
                        </button>
                    </section>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Intelligence Score', value: loading ? '...' : `${stats?.intelligenceScore ?? 0}`, unit: '/100', trend: stats?.intelligenceScore ? 'From Resume Analysis' : 'Upload a Resume', color: 'text-red-500' },
                            { label: 'Resumes Optimized', value: loading ? '...' : `${stats?.resumeCount ?? 0}`, unit: '', trend: stats?.topResumeScore ? `Top Score: ${stats.topResumeScore}` : 'No Resumes Yet', color: 'text-white' },
                            { label: 'Active Targets', value: loading ? '...' : `${stats?.applicationCount ?? 0}`, unit: '', trend: stats?.statusBreakdown ? `${stats.statusBreakdown.APPLIED} Applied` : 'High Priority', color: 'text-red-600' },
                            { label: 'Interview Queue', value: loading ? '...' : `${stats?.interviewCount ?? 0}`, unit: '', trend: stats?.successRate ? `${stats.successRate}% Success Rate` : 'Next: Pending', color: 'text-red-500' },
                        ].map((metric, i) => (
                            <div key={i} className="group p-7 rounded-[32px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-red-500/20 transition-all text-left relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 blur-[40px] rounded-full translate-x-12 -translate-y-12"></div>
                                <div className="text-[10px] font-black text-gray-500 tracking-[0.25em] uppercase mb-5">{metric.label}</div>
                                <div className={`text-4xl font-black italic mb-2 tracking-tighter ${metric.color}`}>
                                    {metric.value}<span className="text-lg text-gray-600">{metric.unit}</span>
                                </div>
                                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-red-500 transition-colors">{metric.trend}</div>
                            </div>
                        ))}
                    </div>

                    {/* Status Breakdown Bar */}
                    {stats && stats.applicationCount > 0 && (
                        <div className="p-6 rounded-[28px] bg-white/[0.02] border border-white/5 text-left">
                            <div className="text-[10px] font-black text-gray-500 tracking-[0.25em] uppercase mb-4">Pipeline Status Breakdown</div>
                            <div className="flex gap-2 h-3 rounded-full overflow-hidden">
                                {(['WISHLIST', 'APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED'] as const).map(s => {
                                    const count = stats.statusBreakdown[s];
                                    const pct = (count / stats.applicationCount) * 100;
                                    const colors: Record<string, string> = {
                                        WISHLIST: 'bg-gray-700', APPLIED: 'bg-blue-600',
                                        INTERVIEWING: 'bg-red-600', OFFER: 'bg-emerald-500', REJECTED: 'bg-gray-600'
                                    };
                                    return pct > 0 ? (
                                        <div key={s} title={`${s}: ${count}`} className={`${colors[s]} transition-all`} style={{ width: `${pct}%` }} />
                                    ) : null;
                                })}
                            </div>
                            <div className="flex gap-5 mt-4 flex-wrap">
                                {(['WISHLIST', 'APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED'] as const).map(s => {
                                    const colors: Record<string, string> = {
                                        WISHLIST: 'bg-gray-700', APPLIED: 'bg-blue-600',
                                        INTERVIEWING: 'bg-red-600', OFFER: 'bg-emerald-500', REJECTED: 'bg-gray-600'
                                    };
                                    return (
                                        <div key={s} className="flex items-center gap-1.5">
                                            <div className={`w-2 h-2 rounded-full ${colors[s]}`} />
                                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{s} ({stats.statusBreakdown[s]})</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-left">
                        {/* Main Intelligence Feed */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-8 pb-5 border-b border-white/5">
                                    <h3 className="text-xl font-black tracking-tight uppercase italic text-left">Operational Targets</h3>
                                    <button className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">View All Intelligence</button>
                                </div>
                                <div className="flex flex-col gap-5">
                                    {loading ? (
                                        <div className="p-10 text-center">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 animate-pulse">Syncing intel feed...</p>
                                        </div>
                                    ) : !stats || stats.recentApplications.length === 0 ? (
                                        <div className="p-10 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">No active surveillance data</p>
                                            <p className="text-[9px] text-gray-700 mt-2 uppercase tracking-widest">Add your first job application to begin tracking</p>
                                        </div>
                                    ) : stats.recentApplications.map((app) => (
                                        <div key={app.id} className="group flex items-center justify-between p-5 rounded-3xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center font-black text-2xl italic group-hover:border-red-500/30 transition-all text-red-600">
                                                    {app.company[0].toUpperCase()}
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-black uppercase tracking-widest text-sm mb-0.5">{app.company}</div>
                                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{app.job_title}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-10">
                                                <div className="text-right hidden sm:block">
                                                    <div className="text-[9px] font-black text-red-500 tracking-[0.2em] mb-1">SCORE</div>
                                                    <div className="font-black italic text-lg">{app.match_score || '—'}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest border ${STATUS_STYLE[app.status] || 'bg-white/5 border-white/10 text-gray-400'}`}>
                                                        {app.status}
                                                    </div>
                                                    <div className="text-[8px] text-gray-600 font-bold mt-2 tracking-widest">
                                                        {app.applied_at || new Date(app.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* AI Advisor Panel */}
                        <div className="flex flex-col gap-8">
                            <div className="p-8 rounded-[40px] bg-red-600/5 border border-red-600/20 relative overflow-hidden group hover:bg-red-600/10 transition-all">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[50px] rounded-full translate-x-16 -translate-y-16"></div>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,0,0,0.3)]">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
                                    </div>
                                    <h3 className="text-xs font-black tracking-[0.3em] uppercase italic">Strategic Advisor</h3>
                                </div>
                                <p className="text-[13px] text-gray-300 leading-relaxed mb-8 italic text-left border-l-2 border-red-600/30 pl-4 font-medium">
                                    {advisorMessage}
                                </p>
                                <button className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-neutral-200 transition-all group-hover:scale-[1.02] transform">
                                    GENERATE FULL REPORT
                                </button>
                            </div>

                            {/* Market Velocity — driven by real weeklyActivity data */}
                            <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 text-left h-full">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500">Weekly Activity</h3>
                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                                        {stats ? `${stats.weeklyActivity.reduce((a, d) => a + d.count, 0)} apps` : '—'}
                                    </span>
                                </div>
                                <div className="h-40 flex items-end gap-3 px-2">
                                    {stats
                                        ? stats.weeklyActivity.map((d, i) => {
                                            const heightPct = Math.max((d.count / maxActivity) * 100, 4);
                                            return (
                                                <div
                                                    key={i}
                                                    className="flex-1 bg-white/10 rounded-full hover:bg-red-600 transition-all pointer-events-auto cursor-pointer group relative"
                                                    style={{ height: `${heightPct}%` }}
                                                >
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                        {d.count} app{d.count !== 1 ? 's' : ''}
                                                    </div>
                                                </div>
                                            );
                                        })
                                        : [40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                            <div key={i} className="flex-1 bg-white/10 rounded-full" style={{ height: `${h}%` }} />
                                        ))}
                                </div>
                                <div className="flex justify-between mt-5 text-[9px] font-black text-gray-600 tracking-widest uppercase px-1">
                                    {stats
                                        ? stats.weeklyActivity.map((d, i) => <span key={i}>{d.day[0]}</span>)
                                        : ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((l, i) => <span key={i}>{l}</span>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
