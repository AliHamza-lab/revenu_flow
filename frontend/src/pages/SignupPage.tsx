
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/v1/users/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    firstName,
                    lastName
                }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.token, data.user);
                navigate('/dashboard');
            } else {
                setError(data.error || 'Provisioning failed. Check identifiers.');
            }
        } catch (err) {
            setError('Connection refused. Ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.05)_0%,transparent_70%)]">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(255,0,0,0.3)]">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight uppercase italic mb-2">NETWORK ENTRY</h1>
                    <p className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase">Provision New Career OS Node</p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] backdrop-blur-xl">
                    {error && (
                        <div className="bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] font-bold uppercase tracking-widest p-4 rounded-xl mb-6 text-center">
                            {error}
                        </div>
                    )}

                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase ml-4">Given Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="FIRST"
                                    className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium tracking-widest focus:outline-none focus:border-red-500/50 transition-all uppercase"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase ml-4">Surname</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="LAST"
                                    className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium tracking-widest focus:outline-none focus:border-red-500/50 transition-all uppercase"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase ml-4">Identifier (Username)</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="OPERATIVE-ID"
                                required
                                className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium tracking-widest focus:outline-none focus:border-red-500/50 transition-all uppercase"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase ml-4">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="USER@CAREER-OS.COM"
                                required
                                className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium tracking-widest focus:outline-none focus:border-red-500/50 transition-all uppercase"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase ml-4">Secret (Password)</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                required
                                className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium tracking-widest focus:outline-none focus:border-red-500/50 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 bg-red-600 rounded-2xl font-black uppercase tracking-[0.2em] text-center transition-all transform hover:scale-[1.02] shadow-[0_0_30px_rgba(255,0,0,0.2)] mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
                        >
                            {loading ? 'PROVISIONING...' : 'EXECUTE PROVISIONING'}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-white/5 pt-6">
                        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                            ALREADY REGISTERED? <Link to="/login" className="text-red-500 hover:underline">LOGIN TO TERMINAL</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
