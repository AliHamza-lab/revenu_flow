
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const LinkedInPage = () => {
    const { token } = useAuth();
    const [profileText, setProfileText] = useState('');
    const [optimizing, setOptimizing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleOptimize = async () => {
        if (!profileText) return;
        setOptimizing(true);
        setResult(null);

        try {
            const response = await fetch('/api/v1/ai/linkedin-optimize/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ current_profile: profileText })
            });
            const data = await response.json();
            if (response.ok) {
                setResult(data);
            }
        } catch (err) {
            console.error('Optimization failed');
        } finally {
            setOptimizing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            <Sidebar />
            <main className="flex-1 p-10 overflow-y-auto">
                <header className="text-left mb-12">
                    <div className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Network Influence</div>
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter">LinkedIn Architect</h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="flex flex-col gap-6">
                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] text-left">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] italic mb-6">Current Profile Intelligence</h3>
                            <textarea
                                value={profileText}
                                onChange={(e) => setProfileText(e.target.value)}
                                placeholder="PASTE YOUR CURRENT LINKEDIN 'ABOUT' OR EXPERIENCE DATA..."
                                className="w-full bg-black border border-white/10 rounded-2xl p-6 text-sm font-medium tracking-widest focus:outline-none focus:border-red-500 transition-all h-64 uppercase"
                            />
                            <button
                                onClick={handleOptimize}
                                disabled={optimizing || !profileText}
                                className="w-full mt-6 py-5 bg-red-600 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-red-700 transition-all transform hover:scale-[1.02] shadow-[0_0_30px_rgba(255,0,0,0.2)] disabled:opacity-50"
                            >
                                {optimizing ? 'Recalculating Influence...' : 'Execute Profile Optimization'}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        {result ? (
                            <div className="p-8 bg-red-600/5 border border-red-600/20 rounded-[40px] text-left animate-in fade-in slide-in-from-right-4">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.3)]">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                                    </div>
                                    <h3 className="text-xl font-black italic uppercase tracking-tight">Optimized Perspective</h3>
                                </div>

                                <div className="space-y-8">
                                    <section>
                                        <div className="text-[10px] text-red-500 font-black uppercase tracking-[0.2em] mb-4">Headline Command</div>
                                        <div className="bg-black/40 p-5 rounded-2xl border border-white/5 font-bold italic tracking-tight text-white">
                                            {result.headline || 'Generating High-Impact Headline...'}
                                        </div>
                                    </section>

                                    <section>
                                        <div className="text-[10px] text-red-500 font-black uppercase tracking-[0.2em] mb-4">Strategic Summary</div>
                                        <p className="text-sm text-gray-300 leading-relaxed italic font-medium border-l-2 border-red-600/30 pl-5">
                                            {result.summary || 'Executing summary synthesis for maximum network resonance.'}
                                        </p>
                                    </section>

                                    <section>
                                        <div className="text-[10px] text-red-500 font-black uppercase tracking-[0.2em] mb-4">Operational Experience Update</div>
                                        <div className="space-y-4">
                                            {(result.bullet_points || []).map((point: string, i: number) => (
                                                <div key={i} className="flex gap-4 items-start">
                                                    <div className="mt-1.5 w-1.5 h-1.5 bg-red-600 rounded-full shrink-0"></div>
                                                    <p className="text-xs text-gray-400 font-medium tracking-wide">{point}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full border-2 border-dashed border-white/5 rounded-[40px] flex flex-center items-center justify-center p-12 text-center">
                                <p className="text-gray-600 uppercase font-black tracking-[0.2em] text-[10px] leading-relaxed">
                                    Await Command. <br /> Input profile data to generate optimized network presence.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LinkedInPage;
