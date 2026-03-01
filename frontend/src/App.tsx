
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ResumesPage from './pages/ResumesPage';
import LinkedInPage from './pages/LinkedInPage';
import ApplicationsPage from './pages/ApplicationsPage';
import Sidebar from './components/Sidebar';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

// Strategic Module Placeholders
const SkillMatrix = () => (
  <DashboardLayout>
    <div className="p-10">
      <div className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-left">Internal Assessment</div>
      <h1 className="text-5xl font-black italic uppercase tracking-tighter text-left mb-12">Skill Matrix</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Python', 'React', 'Django', 'AI Architecture', 'System Design'].map((skill, i) => (
          <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] hover:bg-white/[0.05] transition-all group">
            <div className="flex justify-between items-center mb-6">
              <span className="font-black italic uppercase tracking-tighter text-lg">{skill}</span>
              <span className="text-red-500 font-black text-[10px] uppercase tracking-widest italic">ELITE</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 shadow-[0_0_15px_rgba(255,0,0,0.4)] transition-all duration-1000" style={{ width: `${80 + i * 4}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

const InterviewPrep = () => (
  <DashboardLayout>
    <div className="p-10">
      <div className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-left">Tactical Simulation</div>
      <h1 className="text-5xl font-black italic uppercase tracking-tighter text-left mb-12">Interview Prep</h1>
      <div className="space-y-6">
        {[
          "How do you handle massive scale in a distributed AI system?",
          "Explain the trade-offs between REST and GraphQL in a SaaS environment.",
          "Design a real-time notification system for a Career OS."
        ].map((q, i) => (
          <div key={i} className="p-10 bg-white/[0.01] border border-white/5 rounded-[40px] hover:bg-white/[0.03] transition-all relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-600/20 group-hover:bg-red-600 transition-all"></div>
            <div className="text-red-500 font-black text-[10px] uppercase tracking-widest mb-4 italic">SCENARIO {i + 1}</div>
            <p className="text-xl italic font-black tracking-tight text-left">"{q}"</p>
          </div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

const MarketInsights = () => (
  <DashboardLayout>
    <div className="p-10 text-center">
      <div className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Global Surveillance</div>
      <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-20">Market Insights</h1>
      <div className="w-24 h-24 border-8 border-red-600 border-t-white rounded-full animate-spin mx-auto mt-20 shadow-[0_0_50px_rgba(255,0,0,0.2)]"></div>
      <p className="mt-12 text-gray-500 uppercase font-bold tracking-[0.3em] text-[10px]">Analyzing Workforce Displacement Vectors...</p>
    </div>
  </DashboardLayout>
);

const TargetList = () => (
  <DashboardLayout>
    <div className="p-10">
      <div className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-left">Priority Strike Zones</div>
      <h1 className="text-5xl font-black italic uppercase tracking-tighter text-left mb-12">Target List</h1>
      <div className="bg-white/[0.01] border border-white/5 rounded-[40px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">
              <th className="p-8">Entity</th>
              <th className="p-8 text-center">Probability</th>
              <th className="p-8 text-right">Intel Status</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium">
            {['OpenAI', 'Google', 'Meta', 'Netflix', 'Amazon'].map((company, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                <td className="p-8 font-black uppercase italic tracking-tighter text-lg">{company}</td>
                <td className="p-8 text-center font-black italic text-red-500 text-2xl">{90 - i * 5}%</td>
                <td className="p-8 text-right text-[10px] uppercase tracking-widest font-black opacity-30 group-hover:opacity-100 transition-all">Strike Execution Ready</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </DashboardLayout>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          <Route path="/resumes" element={<ProtectedRoute><ResumesPage /></ProtectedRoute>} />
          <Route path="/linkedin" element={<ProtectedRoute><LinkedInPage /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><ApplicationsPage /></ProtectedRoute>} />

          <Route path="/skill-matrix" element={<ProtectedRoute><SkillMatrix /></ProtectedRoute>} />
          <Route path="/interview-prep" element={<ProtectedRoute><InterviewPrep /></ProtectedRoute>} />
          <Route path="/market-insights" element={<ProtectedRoute><MarketInsights /></ProtectedRoute>} />
          <Route path="/target-list" element={<ProtectedRoute><TargetList /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
