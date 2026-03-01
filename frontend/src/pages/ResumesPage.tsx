
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

interface Resume {
    id: number;
    title: string;
    file: string;
    last_score: number;
    created_at: string;
}

const ResumesPage = () => {
    const { token } = useAuth();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showAnalyze, setShowAnalyze] = useState<number | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const response = await fetch('/api/v1/resumes/', {
                headers: { 'Authorization': `Token ${token}` }
            });
            const data = await response.json();
            if (response.ok) setResumes(data);
        } catch (err) {
            console.error('Failed to fetch resumes');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name);

        try {
            const response = await fetch('/api/v1/resumes/', {
                method: 'POST',
                headers: { 'Authorization': `Token ${token}` },
                body: formData
            });
            if (response.ok) {
                fetchResumes();
            }
        } catch (err) {
            console.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleAnalyze = async (id: number) => {
        setAnalyzing(true);
        try {
            const response = await fetch(`/api/v1/resumes/${id}/analyze/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ job_description: jobDescription })
            });
            const data = await response.json();
            if (response.ok) {
                setAnalysisResult(data);
                fetchResumes();
            }
        } catch (err) {
            console.error('Analysis failed');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            <Sidebar />
            <main className="flex-1 overflow-y-auto pt-16 lg:pt-0 min-w-0">
                <div className="p-4 sm:p-6 lg:p-10">
                    <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 lg:mb-12">
                        <div className="text-left">
                            <div className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Intelligence Assets</div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black italic uppercase tracking-tighter">Resume Treasury</h1>
                        </div>
                        <label className="self-start sm:self-auto px-5 sm:px-8 py-3 sm:py-4 bg-red-600 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all cursor-pointer shadow-[0_0_30px_rgba(255,0,0,0.2)] whitespace-nowrap">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5v14" /></svg>
                            {uploading ? 'Uploading...' : 'Deploy New Asset'}
                            <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx" />
                        </label>
                    </header>

                    {loading ? (
                        <div className="text-center py-20 opacity-50 uppercase tracking-[0.3em] text-xs">Accessing Encrypted Vault...</div>
                    ) : resumes.length === 0 ? (
                        <div className="p-20 border-2 border-dashed border-white/5 rounded-[40px] text-center">
                            <p className="text-gray-500 uppercase font-black tracking-widest text-sm">No tactical assets detected in vault.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {resumes.map(resume => (
                                <div key={resume.id} className="p-5 sm:p-8 bg-white/[0.02] border border-white/5 rounded-[24px] sm:rounded-[32px] hover:bg-white/[0.04] transition-all group">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 sm:gap-6">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 bg-red-600/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all">
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                            </div>
                                            <div className="text-left min-w-0">
                                                <h3 className="text-base sm:text-lg font-black uppercase italic tracking-tight truncate">{resume.title}</h3>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Added: {new Date(resume.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 sm:gap-8 justify-between sm:justify-end">
                                            <div className="text-left sm:text-right">
                                                <div className="text-[10px] text-red-500 font-black uppercase tracking-widest mb-1">Last Intel Score</div>
                                                <div className="text-2xl sm:text-3xl font-black italic">{resume.last_score || 'N/A'}</div>
                                            </div>
                                            <button
                                                onClick={() => setShowAnalyze(resume.id)}
                                                className="shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-black rounded-xl font-black uppercase tracking-[0.15em] text-[10px] hover:bg-neutral-200 transition-all"
                                            >
                                                Analyze
                                            </button>
                                        </div>
                                    </div>

                                    {showAnalyze === resume.id && (
                                        <div className="mt-8 pt-8 border-t border-white/5 animate-in fade-in slide-in-from-top-4">
                                            <div className="flex flex-col gap-4">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-left">Target Job Description</label>
                                                <textarea
                                                    value={jobDescription}
                                                    onChange={(e) => setJobDescription(e.target.value)}
                                                    placeholder="PASTE TARGET INTELLIGENCE HERE..."
                                                    className="w-full bg-black border border-white/10 rounded-2xl p-6 text-sm font-medium tracking-widest focus:outline-none focus:border-red-500 transition-all h-32 uppercase"
                                                />
                                                <div className="flex justify-between items-center">
                                                    <button
                                                        onClick={() => setShowAnalyze(null)}
                                                        className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white"
                                                    >
                                                        Abort Operation
                                                    </button>
                                                    <button
                                                        onClick={() => handleAnalyze(resume.id)}
                                                        disabled={analyzing}
                                                        className="px-8 py-4 bg-red-600 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(255,0,0,0.2)]"
                                                    >
                                                        {analyzing ? 'Processing...' : 'Execute Analysis'}
                                                    </button>
                                                </div>
                                            </div>

                                            {analysisResult && (
                                                <div className="mt-8 p-8 bg-red-600/5 border border-red-600/20 rounded-3xl text-left">
                                                    <div className="flex items-center gap-3 mb-6">
                                                        <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
                                                        <h4 className="text-sm font-black uppercase tracking-[0.2em] italic">Intelligence Briefing</h4>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <div>
                                                            <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-4">Tactical Match Score</div>
                                                            <div className="text-6xl font-black italic text-red-500">{analysisResult.score}%</div>
                                                        </div>
                                                        <div className="flex flex-col gap-4">
                                                            <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Strategy Recommendations</div>
                                                            <p className="text-sm text-gray-300 italic font-medium">"{analysisResult.feedback || 'Intelligence data processed. Match probability calculated based on keyword density and semantic alignment.'}"</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ResumesPage;
