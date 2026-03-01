
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'system'>('profile');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const tabs = [
        { id: 'profile', label: 'Profile' },
        { id: 'security', label: 'Security' },
        { id: 'notifications', label: 'Alerts' },
        { id: 'system', label: 'System' },
    ] as const;

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            <Sidebar />
            <main className="flex-1 overflow-y-auto pt-16 lg:pt-0 min-w-0">
                {/* Header */}
                <div className="p-4 sm:p-6 lg:p-10">
                    <div className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">System Configuration</div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black italic uppercase tracking-tighter mb-8 lg:mb-12">Terminal Settings</h1>

                    {/* Tabs */}
                    <div className="flex gap-1 p-1 bg-white/[0.03] rounded-2xl border border-white/5 mb-8 lg:mb-10 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 min-w-[80px] py-2.5 px-3 sm:px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(255,0,0,0.2)]'
                                        : 'text-gray-500 hover:text-white'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="flex flex-col gap-6 max-w-2xl">
                            <div className="p-6 lg:p-8 bg-white/[0.02] border border-white/5 rounded-[28px] lg:rounded-[40px]">
                                <div className="text-[10px] font-black text-gray-500 tracking-[0.25em] uppercase mb-6">Operative Identity</div>

                                {/* Avatar */}
                                <div className="flex items-center gap-5 mb-8">
                                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 border border-white/20 shadow-[0_0_20px_rgba(255,0,0,0.2)] flex items-center justify-center text-2xl lg:text-3xl font-black italic text-white">
                                        {user?.username?.[0]?.toUpperCase() || 'O'}
                                    </div>
                                    <div>
                                        <div className="font-black uppercase italic tracking-tight text-lg">{user?.username || 'Operative'}</div>
                                        <div className="text-[10px] text-red-500 font-black uppercase tracking-widest">Elite Status</div>
                                        <div className="text-[10px] text-gray-600 mt-1">{user?.email || 'No email set'}</div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Username</label>
                                        <input
                                            type="text"
                                            defaultValue={user?.username || ''}
                                            className="bg-black border border-white/10 rounded-2xl py-3.5 px-5 text-sm font-medium tracking-widest focus:outline-none focus:border-red-500 transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email</label>
                                        <input
                                            type="email"
                                            defaultValue={user?.email || ''}
                                            className="bg-black border border-white/10 rounded-2xl py-3.5 px-5 text-sm font-medium tracking-widest focus:outline-none focus:border-red-500 transition-all"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSave}
                                        className={`mt-2 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all ${saved ? 'bg-emerald-600 text-white' : 'bg-white text-black hover:bg-neutral-200'
                                            }`}
                                    >
                                        {saved ? '✓ Changes Committed' : 'Commit Changes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="flex flex-col gap-6 max-w-2xl">
                            <div className="p-6 lg:p-8 bg-white/[0.02] border border-white/5 rounded-[28px] lg:rounded-[40px]">
                                <div className="text-[10px] font-black text-gray-500 tracking-[0.25em] uppercase mb-6">Access Credentials</div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Current Password</label>
                                        <input type="password" placeholder="••••••••" className="bg-black border border-white/10 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:border-red-500 transition-all" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                                        <input type="password" placeholder="••••••••" className="bg-black border border-white/10 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:border-red-500 transition-all" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                                        <input type="password" placeholder="••••••••" className="bg-black border border-white/10 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:border-red-500 transition-all" />
                                    </div>
                                    <button onClick={handleSave} className="mt-2 py-4 bg-red-600 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-red-700 transition-all">
                                        {saved ? '✓ Access Updated' : 'Update Access Credentials'}
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 lg:p-8 bg-red-600/5 border border-red-600/20 rounded-[28px] lg:rounded-[40px]">
                                <div className="text-[10px] font-black text-red-500 tracking-[0.25em] uppercase mb-4">Danger Zone</div>
                                <p className="text-xs text-gray-500 mb-6 leading-relaxed">Permanently terminate this operative profile. This action is irreversible.</p>
                                <button className="py-3 px-6 border border-red-600/30 text-red-500 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-red-600/10 transition-all">
                                    Terminate Account
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="flex flex-col gap-6 max-w-2xl">
                            <div className="p-6 lg:p-8 bg-white/[0.02] border border-white/5 rounded-[28px] lg:rounded-[40px]">
                                <div className="text-[10px] font-black text-gray-500 tracking-[0.25em] uppercase mb-6">Intel Alerts</div>
                                <div className="flex flex-col gap-5">
                                    {[
                                        { label: 'Application Status Updates', desc: 'Notify when a target changes status' },
                                        { label: 'Interview Reminders', desc: 'Alert 24h before scheduled interviews' },
                                        { label: 'AI Analysis Complete', desc: 'Notify when resume scoring finishes' },
                                        { label: 'Weekly Mission Briefing', desc: 'Weekly summary of your pipeline progress' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                                            <div>
                                                <div className="text-sm font-black uppercase tracking-wide mb-0.5">{item.label}</div>
                                                <div className="text-[10px] text-gray-600 font-medium">{item.desc}</div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                                                <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                                                <div className="w-10 h-5 bg-white/10 rounded-full peer peer-checked:bg-red-600 transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* System Tab */}
                    {activeTab === 'system' && (
                        <div className="flex flex-col gap-6 max-w-2xl">
                            <div className="p-6 lg:p-8 bg-white/[0.02] border border-white/5 rounded-[28px] lg:rounded-[40px]">
                                <div className="text-[10px] font-black text-gray-500 tracking-[0.25em] uppercase mb-6">System Information</div>
                                <div className="flex flex-col gap-4">
                                    {[
                                        { label: 'Platform', value: 'Career OS v1.0.0' },
                                        { label: 'Backend', value: 'Django 6.0.2 + DRF' },
                                        { label: 'Frontend', value: 'React 18 + TypeScript + TailwindCSS' },
                                        { label: 'AI Engine', value: 'Groq LLM (openai/gpt-oss-120b)' },
                                        { label: 'Database', value: 'SQLite (dev) / PostgreSQL (prod)' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.label}</div>
                                            <div className="text-xs font-bold text-right">{item.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 lg:p-8 bg-white/[0.02] border border-white/5 rounded-[28px] lg:rounded-[40px]">
                                <div className="text-[10px] font-black text-gray-500 tracking-[0.25em] uppercase mb-6">Session Control</div>
                                <button
                                    onClick={logout}
                                    className="w-full py-4 bg-red-600/10 border border-red-600/20 text-red-500 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-red-600/20 transition-all"
                                >
                                    Disconnect All Sessions
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;
