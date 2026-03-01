
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const menuItems = [
        {
            group: 'Core Intelligence',
            items: [
                { path: '/dashboard', label: 'Overview', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg> },
                { path: '/resumes', label: 'Resumes', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg> },
                { path: '/linkedin', label: 'LinkedIn', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg> },
                { path: '/applications', label: 'Applications', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg> },
            ]
        },
        {
            group: 'Strategic Modules',
            items: [
                { path: '/skill-matrix', label: 'Skill Matrix', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4" /><path d="m16.2 7.8 2.9-2.9" /><path d="M18 12h4" /><path d="m16.2 16.2 2.9 2.9" /><path d="M12 18v4" /><path d="m4.9 19.1 2.9-2.9" /><path d="M2 12h4" /><path d="m4.9 4.9 2.9 2.9" /><circle cx="12" cy="12" r="3" /></svg> },
                { path: '/interview-prep', label: 'Interview Prep', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg> },
                { path: '/market-insights', label: 'Market Insights', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg> },
                { path: '/target-list', label: 'Target List', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="m19 19-7-7 7-7" /></svg> },
            ]
        }
    ];

    const SidebarContent = () => (
        <>
            <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 mb-4 group">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-[0_0_20px_rgba(255,0,0,0.2)]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase italic group-hover:text-red-500 transition-colors">Career OS</span>
            </Link>

            <div className="flex flex-col gap-6 flex-1">
                {menuItems.map((section, si) => (
                    <div key={si} className="flex flex-col gap-2">
                        <div className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase px-4">{section.group}</div>
                        <nav className="flex flex-col gap-1.5">
                            {section.items.map((item, i) => (
                                <Link
                                    key={i}
                                    to={item.path}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${location.pathname === item.path ? 'bg-red-600 text-white font-black shadow-[0_0_20px_rgba(255,0,0,0.1)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    {item.icon}
                                    <span className="text-[11px] uppercase tracking-[0.15em]">{item.label}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                ))}
            </div>

            <div className="mt-auto border-t border-white/5 pt-6 flex flex-col gap-2">
                <button className="flex items-center gap-3 px-4 py-3.5 text-gray-500 hover:text-white transition-all w-full">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                    <span className="text-[11px] uppercase tracking-[0.15em]">Terminal Settings</span>
                </button>
                <button onClick={logout} className="flex items-center gap-3 px-4 py-3.5 text-red-500/50 hover:text-red-500 transition-all w-full text-left">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                    <span className="text-[11px] uppercase tracking-[0.15em]">Disconnect</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* ── Desktop Sidebar ── */}
            <aside className="hidden lg:flex w-72 border-r border-white/5 bg-black p-6 flex-col gap-8 sticky top-0 h-screen overflow-y-auto">
                <SidebarContent />
            </aside>

            {/* ── Mobile Top Bar ── */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-black/95 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(255,0,0,0.2)]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                    <span className="text-lg font-black tracking-tighter uppercase italic">Career OS</span>
                </Link>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></svg>
                    )}
                </button>
            </div>

            {/* ── Mobile Drawer ── */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-40 flex">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    {/* Drawer */}
                    <aside className="relative w-72 max-w-[85vw] bg-black border-r border-white/5 p-6 flex flex-col gap-6 h-full overflow-y-auto z-50 pt-20">
                        <SidebarContent />
                    </aside>
                </div>
            )}
        </>
    );
};

export default Sidebar;
