
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-red-500/30">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                        <span className="text-xl font-bold tracking-tighter uppercase italic text-white">Career OS</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400 uppercase tracking-widest">
                        <a href="#features" className="hover:text-red-500 transition-colors">Intelligence</a>
                        <a href="#dashboard" className="hover:text-red-500 transition-colors">Performance</a>
                        <a href="#pricing" className="hover:text-red-500 transition-colors">Membership</a>
                    </div>
                    <Link to="/signup" className="px-6 py-2.5 bg-red-600 text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(255,0,0,0.2)]">
                        Join Elite
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-widest mb-8">
                        Next-Gen Career Intelligence
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] elite-gradient-text">
                        WIN THE <br /> JOB MARKET.
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                        The world’s first AI Career Execution Operating System. Not a resume builder. A systematic engine for professional dominance.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/dashboard" className="group relative px-10 py-5 bg-red-600 rounded-2xl flex items-center gap-3 transition-all hover:bg-red-700 font-bold uppercase tracking-widest text-lg">
                            Execute Journey
                        </Link>
                        <button className="px-10 py-5 border border-white/10 rounded-2xl text-lg font-medium hover:bg-white/5 transition-all">
                            Watch Intelligence
                        </button>
                    </div>
                </div>
            </section>

            {/* Metrics Section */}
            <section className="py-20 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    {[
                        { label: 'RESUME SCORE', value: '98' },
                        { label: 'HIRE RATE', value: '4.5X' },
                        { label: 'DAILY DATA', value: '12PB' },
                        { label: 'MEMBERS', value: '10K+' },
                    ].map((stat, i) => (
                        <div key={i}>
                            <div className="text-4xl font-black mb-2 italic tracking-tighter">{stat.value}</div>
                            <div className="text-[10px] font-bold text-red-500 tracking-[0.2em]">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-20 items-end mb-24">
                        <div className="max-w-xl text-left">
                            <h2 className="text-5xl font-bold mb-6 tracking-tight">Category-Defining Intelligence.</h2>
                            <p className="text-gray-400 text-lg leading-relaxed text-left">
                                We've built an infrastructure that renders traditional job seeking obsolete. Our AI doesn't just write; it predicts, optimizes, and secures.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "ATS Resume Engine",
                                desc: "Proprietary scoring against 1,000+ Fortune 500 hiring patterns."
                            },
                            {
                                title: "LinkedIn Dominance",
                                desc: "Algorithmic profile optimization to build unstoppable authority."
                            },
                            {
                                title: "Application OS",
                                desc: "Real-time conversion tracking from initial click to signed offer."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group p-10 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-red-500/50 hover:bg-white/[0.04] transition-all text-left">
                                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 bg-red-600 rounded-[64px] mx-6 mb-20 text-center">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter italic text-center">READY TO DOMINATE?</h2>
                    <Link to="/dashboard" className="px-12 py-6 bg-white text-black rounded-2xl text-xl font-black uppercase tracking-[0.2em] transform transition-transform hover:scale-105 inline-block">
                        START EXECUTION
                    </Link>
                </div>
            </section>

            <footer className="py-20 border-t border-white/5 text-center text-gray-400 text-xs uppercase tracking-[0.3em] font-medium">
                &copy; 2026 CAREER EXECUTION ECOSYSTEM. ALL RIGHTS RESERVED.
            </footer>
        </div>
    );
};

export default LandingPage;
