
import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, Target, BookOpen, Calendar, Settings, 
  Crown, Languages, LogOut, Monitor, Activity, ShieldCheck,
  Zap, BellRing, Radio, LineChart
} from 'lucide-react';
import Dashboard from './views/Dashboard';
import Analyzer from './views/Analyzer';
import Journal from './views/Journal';
import CalendarView from './views/Calendar';
import SettingsView from './views/Settings';
import Terminal from './views/Terminal';
import SignalsFeed from './views/SignalsFeed';
import Login from './views/Login';
import { JournalEntry } from './types';
import { translations } from './translations';

type Lang = 'en' | 'pt';

interface AppContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof translations.en;
  isAuth: boolean;
  setIsAuth: (b: boolean) => void;
  isAdmin: boolean;
  setIsAdmin: (b: boolean) => void;
  journal: JournalEntry[];
  saveToJournal: (entry: JournalEntry) => void;
  updateJournal: (entries: JournalEntry[]) => void;
}

const AppContext = createContext<AppContextType | null>(null);
export const useApp = () => useContext(AppContext)!;

const Sidebar = () => {
  const location = useLocation();
  const { lang, setLang, t, setIsAuth } = useApp();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: "Painel Geral" },
    { path: '/terminal', icon: Monitor, label: "Gráfico ao Vivo" },
    { path: '/analyzer', icon: Target, label: "Análise de Foto (Manual)" },
    { path: '/signals', icon: Radio, label: "Radar de Sinais (Auto)" },
    { path: '/journal', icon: BookOpen, label: "Diário Ledger" },
    { path: '/calendar', icon: Calendar, label: "Calendário Econ." },
    { path: '/settings', icon: Settings, label: "Configurações" },
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-2xl">
      <div className="p-8 border-b border-zinc-900 mb-6 bg-black/40">
        <h1 className="text-2xl font-black bg-gradient-to-r from-white via-emerald-400 to-emerald-600 bg-clip-text text-transparent italic tracking-tighter">
          TradeLens<span className="text-white">.AI</span>
        </h1>
        <div className="flex items-center gap-2 mt-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
           <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Ultra Pro Active</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="px-5 text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-2">Menu Principal</p>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-5 py-4 rounded-2xl transition-all duration-300 group ${
              isActive(item.path)
                ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 shadow-lg'
                : 'text-zinc-600 hover:bg-zinc-900/50 hover:text-zinc-300'
            }`}
          >
            <item.icon size={18} className={isActive(item.path) ? 'text-emerald-400' : 'group-hover:text-emerald-500/50'} />
            <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 space-y-4">
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-[1.5rem] p-5">
          <div className="flex items-center justify-between mb-3">
             <div className="flex items-center gap-2 text-amber-500">
                <Crown size={14} fill="currentColor" />
                <span className="text-[9px] font-black tracking-widest uppercase">Licença Pro</span>
             </div>
          </div>
          <button className="w-full py-3 bg-white text-black text-[10px] font-black rounded-xl transition-all hover:bg-emerald-400">
            PLANOS ATIVOS
          </button>
        </div>
        <button 
          onClick={() => {
            localStorage.removeItem('tradelens_auth');
            setIsAuth(false);
          }}
          className="w-full flex items-center justify-center space-x-2 p-3 text-zinc-700 hover:text-rose-500 text-[10px] font-black uppercase transition-all"
        >
          <LogOut size={14} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuth } = useApp();
  if (!isAuth) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const MainContent = () => {
  const location = useLocation();
  const { journal, saveToJournal, updateJournal } = useApp();
  const isTerminal = location.pathname === '/terminal';

  return (
    <main className={`flex-1 ml-64 min-h-screen ${isTerminal ? 'p-0' : 'p-6 lg:p-12'} transition-all bg-[#050505]`}>
      <Routes>
        <Route path="/" element={<Dashboard journal={journal} />} />
        <Route path="/signals" element={<SignalsFeed />} />
        <Route path="/terminal" element={<Terminal />} />
        <Route path="/analyzer" element={<Analyzer onSave={saveToJournal} />} />
        <Route path="/journal" element={<Journal entries={journal} onUpdate={updateJournal} />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/settings" element={<SettingsView />} />
      </Routes>
    </main>
  );
}

const App: React.FC = () => {
  const [lang, setLang] = useState<Lang>('pt');
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [journal, setJournal] = useState<JournalEntry[]>([]);

  const t = useMemo(() => translations[lang], [lang]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tradelens_journal');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setJournal(parsed);
      }
      const savedAuth = localStorage.getItem('tradelens_auth');
      if (savedAuth === 'true') setIsAuth(true);
    } catch (e) {
      console.error("Storage load error", e);
      setJournal([]);
    }
  }, []);

  const saveToJournal = (entry: JournalEntry) => {
    setJournal(prev => {
      const updated = [entry, ...prev].slice(0, 100);
      localStorage.setItem('tradelens_journal', JSON.stringify(updated));
      return updated;
    });
  };

  const updateJournal = (entries: JournalEntry[]) => {
    setJournal(entries);
    localStorage.setItem('tradelens_journal', JSON.stringify(entries));
  };

  return (
    <AppContext.Provider value={{ 
      lang, setLang, t, isAuth, setIsAuth, isAdmin, setIsAdmin, 
      journal, saveToJournal, updateJournal 
    }}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-[#050505] overflow-hidden">
                <Sidebar />
                <MainContent />
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;
