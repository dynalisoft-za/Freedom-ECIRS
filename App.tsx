
import React, { useState, useEffect, useRef } from 'react';
import {
  Database, LayoutDashboard, Briefcase, Menu, X,
  ChevronRight, Zap, CheckCircle2, Lock, Terminal, Radio,
  FileJson, Server, FileText, Shield, Eye, Users, Receipt as ReceiptIcon, BarChart3,
  Settings, LogOut, Plus, TrendingUp,
  Clock, CheckCircle, AlertCircle, MoreVertical, Smartphone,
  CreditCard, Banknote, Calendar, Repeat,
  ShieldEllipsis, UserPlus, ShieldCheck as ShieldCheckIcon,
  Wifi, WifiOff, MessageSquare, Send, Check, CheckCheck, Phone, Languages,
  ArrowDownToLine, Cpu, BookOpen, Code2, FileSpreadsheet, UploadCloud, Table,
  AlertTriangle, Home, Building2, MapPin, Search, Filter, Hash, Fingerprint, Layers,
  Printer, Globe, Percent, QrCode, Save, Trash2, Edit3, FolderOpen, Play, HelpCircle, Sparkles, Loader2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { AppView, Client, Contract, StaffMember, Language } from './types';
import { STATIONS as INITIAL_STATIONS, EBRS_SQL_SCHEMA } from './constants';
import { translations } from './translations';
import {
  getFastAPIImplementation, getAPIDocsCode, getSDKCode
} from './services/geminiService';
import { useAuth } from './contexts/AuthContext';
import { RegisterPage } from './components/RegisterPage';
import { UsersPage } from './components/UsersPage';

// Fix: Augment Window interface correctly
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

// --- MOCK DATA ---
const MOCK_CLIENTS: Client[] = [
  { id: '1', company_name: 'Dangote Cement PLC', contact_person: 'Alhaji Musa', email: 'musa@dangote.com', phone: '+234 803 111 2222', tin: 'TIN-DG-001', type: 'direct', balance: 145000000 },
  { id: '2', company_name: 'MTN Nigeria', contact_person: 'Ibrahim Bala', email: 'ib@mtn.ng', phone: '+234 803 333 4444', tin: 'TIN-MT-099', type: 'agency', balance: 8900000 },
  { id: '3', company_name: 'BUA Group', contact_person: 'Sani Adamu', email: 'sani@bua.com', phone: '+234 803 555 6666', tin: 'TIN-BU-777', type: 'direct', balance: 0 },
];

const MOCK_STAFF: StaffMember[] = [
  { id: 'S1', name: 'Sadiq Ibrahim', phone: '+234 803 000 0001', role: 'super_admin', stations: ['FRG-HQ', 'FR-KAN'], status: 'active' },
  { id: 'S2', name: 'Aisha Bello', phone: '+234 803 000 0002', role: 'accountant', stations: ['FR-KAN'], status: 'active' },
  { id: 'S3', name: 'Musa Lawal', phone: '+234 803 000 0003', role: 'sales_executive', stations: ['FR-KAD'], status: 'active' },
];

// --- SMALL HELPER COMPONENTS ---

const StatCard: React.FC<{ label: string; value: string; trend: string; icon: React.ReactNode; color: string }> = ({ label, value, trend, icon, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2.5 rounded-xl bg-${color}-50 text-${color}-600`}>{icon}</div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{trend}</span>
    </div>
    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className="text-2xl md:text-3xl font-black text-slate-900 mt-1">{value}</p>
  </div>
);

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; isOpen: boolean }> = ({ icon, label, isActive, onClick, isOpen }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-3 transition-all relative group ${
      isActive ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <div className={`shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>{icon}</div>
    {isOpen && <span className="text-sm font-bold tracking-tight whitespace-nowrap overflow-hidden">{label}</span>}
    {isActive && <div className="absolute right-0 top-0 h-full w-1 bg-emerald-400" />}
  </button>
);

// --- MAIN VIEW COMPONENTS ---

const LoginPage: React.FC<{ t: any }> = ({ t }) => {
  const { login, loading, error, clearError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!username || !password) {
      return;
    }

    try {
      await login(username, password);
      // Navigation handled by App.tsx auth check
    } catch (err) {
      // Error handled by AuthContext
      console.error('Login error:', err);
    }
  };

  // Demo access function
  const handleDemoAccess = async () => {
    setUsername('demo');
    setPassword('demo123');
    try {
      await login('demo', 'demo123');
    } catch (err) {
      console.error('Demo login error:', err);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0f172a] justify-center items-center p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 rounded-[2rem] border border-emerald-500/20 text-emerald-500 mb-2">
            <Radio size={40} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-none">
            FREEDOM <span className="text-emerald-500">ECIRS</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium">Enterprise Contract, Invoice & Receipting System</p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
              <p className="text-red-600 text-sm font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                Username
              </label>
              <input
                  autoFocus
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:border-slate-900 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                Password
              </label>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:border-slate-900 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0f172a] text-white py-5 rounded-2xl font-black shadow-xl active:scale-95 transition-all uppercase tracking-[0.2em] text-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : t.continue}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100" /></div>
            <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-300 bg-white px-4">OR</div>
          </div>

          <button onClick={handleDemoAccess} disabled={loading} className="w-full flex items-center justify-center gap-3 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all disabled:opacity-50">
              <ShieldEllipsis size={18} /> {t.demo_access}
          </button>
        </div>

        <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          Secured by Freedom Radio Group Infrastructure
        </p>
      </div>
    </div>
  );
};

const LiveDashboard: React.FC<{ t: any }> = ({ t }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label={t.total_revenue} value="₦4.2M" trend="+12%" icon={<TrendingUp size={20} />} color="emerald" />
      <StatCard label={t.pending_revenue} value="₦1.8M" trend="-2%" icon={<AlertCircle size={20} />} color="orange" />
      <StatCard label={t.active_contracts} value="24" trend="+4" icon={<Briefcase size={20} />} color="blue" />
      <StatCard label={t.new_invoices} value="12" trend="Now" icon={<Clock size={20} />} color="red" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-slate-900 uppercase tracking-tight">Recent Revenue Flow</h3>
          <button className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Full Report</button>
        </div>
        <div className="h-64 flex items-end gap-3 px-4">
           {[40, 65, 45, 90, 55, 75, 85].map((h, i) => (
             <div key={i} className="flex-1 bg-slate-100 rounded-t-xl relative group transition-all hover:bg-emerald-500">
                <div style={{ height: `${h}%` }} className="w-full bg-emerald-500 rounded-t-xl transition-all" />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">₦{h}k</div>
             </div>
           ))}
        </div>
      </div>
      <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
        <h3 className="font-black uppercase tracking-tight mb-6">Network Health</h3>
        <div className="space-y-4">
           {['Kano 99.5', 'Dutse 99.5', 'Kaduna 92.9', 'Dala 88.5'].map(station => (
             <div key={station} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-xs font-bold">{station}</span>
                <span className="flex items-center gap-2 text-[10px] font-black text-emerald-400"><Wifi size={12} /> ONLINE</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  </div>
);

// --- CORE APP COMPONENT ---

const App: React.FC = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [activeView, setActiveView] = useState<AppView>(AppView.APP_DASHBOARD);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = translations[language];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen w-full flex bg-[#0f172a] justify-center items-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto" />
          <p className="text-slate-400 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage t={t} />;
  }

  // Show register page if active view is REGISTER
  if (activeView === AppView.REGISTER) {
    return (
      <RegisterPage
        onBack={() => setActiveView(AppView.APP_DASHBOARD)}
        onSuccess={() => setActiveView(AppView.APP_DASHBOARD)}
        t={t}
      />
    );
  }

  const handleNavClick = (view: AppView) => {
    setActiveView(view);
    if (window.innerWidth < 1024) setIsMobileMenuOpen(false);
  };

  const navContent = (
    <>
      <div className="p-8 flex flex-col gap-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-900 shrink-0">
            <Radio size={24} strokeWidth={2.5} />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter leading-none">FREEDOM</span>
              <span className="text-[10px] font-black text-emerald-400 tracking-[0.3em]">ECIRS</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 py-4 overflow-y-auto space-y-8 scrollbar-hide">
        <section>
          {isSidebarOpen && <p className="px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{t.operations}</p>}
          <NavItem icon={<LayoutDashboard size={20} />} label={t.dashboard} isActive={activeView === AppView.APP_DASHBOARD} onClick={() => handleNavClick(AppView.APP_DASHBOARD)} isOpen={isSidebarOpen} />
          <NavItem icon={<Users size={20} />} label={t.clients} isActive={activeView === AppView.CLIENTS} onClick={() => handleNavClick(AppView.CLIENTS)} isOpen={isSidebarOpen} />
          <NavItem icon={<Briefcase size={20} />} label={t.contracts} isActive={activeView === AppView.CONTRACTS} onClick={() => handleNavClick(AppView.CONTRACTS)} isOpen={isSidebarOpen} />
          <NavItem icon={<FileText size={20} />} label={t.invoices} isActive={activeView === AppView.INVOICES} onClick={() => handleNavClick(AppView.INVOICES)} isOpen={isSidebarOpen} />
          <NavItem icon={<ReceiptIcon size={20} />} label={t.receipts} isActive={activeView === AppView.RECEIPTS} onClick={() => handleNavClick(AppView.RECEIPTS)} isOpen={isSidebarOpen} />
        </section>

        <section>
          {isSidebarOpen && <p className="px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{t.field_ops}</p>}
          <NavItem icon={<Smartphone size={20} />} label={t.mobile_pwa} isActive={activeView === AppView.MOBILE_PWA} onClick={() => handleNavClick(AppView.MOBILE_PWA)} isOpen={isSidebarOpen} />
          <NavItem icon={<ShieldCheckIcon size={20} />} label={t.verify_doc} isActive={activeView === AppView.VERIFICATION_PORTAL} onClick={() => handleNavClick(AppView.VERIFICATION_PORTAL)} isOpen={isSidebarOpen} />
        </section>

        {user && (user.role === 'super_admin' || user.role === 'station_manager') && (
          <section className="pt-4 border-t border-white/5">
            {isSidebarOpen && <p className="px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">ADMIN</p>}
            <NavItem icon={<UserPlus size={20} />} label="Users" isActive={activeView === AppView.USERS} onClick={() => handleNavClick(AppView.USERS)} isOpen={isSidebarOpen} />
          </section>
        )}

        <section className="pt-4 border-t border-white/5">
          {isSidebarOpen && <p className="px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Core</p>}
          <NavItem icon={<Database size={20} />} label="Schema" isActive={activeView === AppView.SCHEMA} onClick={() => handleNavClick(AppView.SCHEMA)} isOpen={isSidebarOpen} />
          <NavItem icon={<Terminal size={20} />} label="FastAPI" isActive={activeView === AppView.BACKEND_API} onClick={() => handleNavClick(AppView.BACKEND_API)} isOpen={isSidebarOpen} />
        </section>
      </div>

      <div className="p-4 border-t border-white/5 space-y-2 shrink-0">
        <button onClick={() => { logout(); setActiveView(AppView.APP_DASHBOARD); }} className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-red-400 rounded-2xl transition-all">
          <LogOut size={20} />
          {isSidebarOpen && <span className="text-sm font-bold uppercase tracking-widest">{t.logout}</span>}
        </button>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="hidden lg:flex w-full items-center justify-center p-2 rounded-xl hover:bg-white/5 transition-colors text-slate-500">
          {isSidebarOpen ? <ArrowDownToLine size={20} className="rotate-90" /> : <ArrowDownToLine size={20} className="-rotate-90" />}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-slate-50">
      <aside className={`hidden lg:flex bg-[#0f172a] text-white transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-24'} flex-col shrink-0 border-r border-white/5 h-full`}>
        {navContent}
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-80 bg-[#0f172a] text-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            {navContent}
          </aside>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-slate-500 lg:hidden hover:bg-slate-50 rounded-xl">
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter truncate">{activeView.toLowerCase().replace('_', ' ')}</h2>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Freedom Network Live
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setLanguage(prev => prev === Language.ENGLISH ? Language.HAUSA : Language.ENGLISH)} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black text-slate-600 hover:bg-slate-100 transition-all">
                <Languages size={14} className="text-emerald-500" />
                <span className="hidden sm:inline uppercase tracking-widest">{language === Language.ENGLISH ? 'Hausa' : 'English'}</span>
             </button>
             <div className="w-10 h-10 rounded-2xl bg-[#0f172a] flex items-center justify-center font-black text-white shadow-lg shadow-slate-200">
               {user?.full_name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            {activeView === AppView.APP_DASHBOARD && <LiveDashboard t={t} />}
            {activeView === AppView.USERS && <UsersPage t={t} />}
            {activeView === AppView.CLIENTS && (
              <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-500">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.clients}</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Balance</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {MOCK_CLIENTS.map(c => (
                        <tr key={c.id} className="hover:bg-slate-50/30 transition-all">
                          <td className="px-8 py-5"><span className="font-bold text-slate-900">{c.company_name}</span></td>
                          <td className="px-8 py-5"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-[8px] font-black uppercase text-slate-600 tracking-widest">{c.type}</span></td>
                          <td className="px-8 py-5 font-black text-slate-900">₦{(c.balance/100).toLocaleString()}</td>
                          <td className="px-8 py-5 text-right"><button className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><ChevronRight size={20} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeView === AppView.SCHEMA && <div className="bg-[#0f172a] rounded-[2.5rem] p-8 overflow-x-auto border border-white/5 shadow-2xl"><pre className="code-font text-emerald-400 text-xs leading-relaxed">{EBRS_SQL_SCHEMA}</pre></div>}
            
            {/* Component placeholder */}
            {[AppView.CONTRACTS, AppView.INVOICES, AppView.RECEIPTS, AppView.REPORTS, AppView.VERIFICATION_PORTAL, AppView.MOBILE_PWA, AppView.BACKEND_API].includes(activeView) && (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-300">
                  <Cpu size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Module Under Construction</h3>
                  <p className="text-slate-400 text-sm font-medium">This architectural component is pending full integration.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
