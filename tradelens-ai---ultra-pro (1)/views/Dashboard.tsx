
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Clock, ArrowUpRight, CheckCircle2, XCircle, ChevronRight, Zap, Globe } from 'lucide-react';
import { JournalEntry } from '../types';
import { useApp } from '../App';

interface DashboardProps {
  journal: JournalEntry[];
}

const PriceTicker = () => {
  const [prices, setPrices] = useState([
    { pair: 'XAUUSD', price: '2042.55', change: '+0.45%', up: true },
    { pair: 'GBPUSD', price: '1.26842', change: '-0.12%', up: false },
    { pair: 'EURUSD', price: '1.08451', change: '+0.08%', up: true },
    { pair: 'BTCUSDT', price: '52140.2', change: '+1.20%', up: true },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(p => ({
        ...p,
        price: (parseFloat(p.price) + (Math.random() - 0.5) * 0.001).toFixed(p.pair.includes('BTC') ? 1 : 5)
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
      {prices.map(p => (
        <div key={p.pair} className="glass-card flex items-center gap-4 px-6 py-3 rounded-2xl border-zinc-800/40 min-w-[200px]">
          <div>
            <p className="text-[9px] font-black text-zinc-500 uppercase">{p.pair}</p>
            <p className="text-sm font-mono font-black text-white">{p.price}</p>
          </div>
          <div className={`text-[10px] font-black px-2 py-1 rounded-lg ${p.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {p.change}
          </div>
        </div>
      ))}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, trend, colorClass = "text-zinc-400" }: any) => (
  <div className="glass-card p-6 rounded-2xl border-zinc-800/40 hover:border-emerald-500/30 transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 bg-zinc-900 rounded-xl ${colorClass}`}>
        <Icon size={20} />
      </div>
      {trend && (
        <span className={`text-[10px] font-black px-2 py-1 rounded-md ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">{title}</p>
    <h3 className="text-2xl font-black text-white">{value}</h3>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ journal }) => {
  const { t, isAdmin } = useApp();
  const winCount = journal.filter(j => j.status === 'WON').length;
  const lossCount = journal.filter(j => j.status === 'LOST').length;
  const winRate = journal.length > 0 ? ((winCount / journal.length) * 100).toFixed(1) : '0';
  
  const data = [
    { name: 'Seg', balance: 10000 },
    { name: 'Ter', balance: 10250 },
    { name: 'Qua', balance: 10100 },
    { name: 'Qui', balance: 10600 },
    { name: 'Sex', balance: 10850 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white mb-1">
              {t.welcome}{isAdmin ? '*' : ''}
            </h2>
            <p className="text-sm text-zinc-500 font-medium">{t.subtitle}</p>
          </div>
          <div className="flex gap-3">
             <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/60 rounded-xl border border-zinc-800">
                <Globe size={14} className="text-emerald-500" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Preços Sincronizados</span>
             </div>
          </div>
        </div>
        
        <PriceTicker />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t.hits} value={winCount} icon={CheckCircle2} colorClass="text-emerald-400" />
        <StatCard title={t.misses} value={lossCount} icon={XCircle} colorClass="text-rose-400" />
        <StatCard title={t.winRate} value={`${winRate}%`} icon={TrendingUp} trend={4.2} colorClass="text-amber-400" />
        <StatCard title={t.totalTrades} value={journal.length} icon={BarChart3} colorClass="text-cyan-400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 glass-card p-6 rounded-3xl border-zinc-800/30">
          <h3 className="text-sm font-black text-white flex items-center space-x-2 mb-8 italic">
            <Zap size={16} className="text-emerald-400" />
            <span>Curva de Patrimônio Institucional</span>
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.2} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', padding: '10px' }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="balance" stroke="#10b981" fillOpacity={1} fill="url(#colorBalance)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border-zinc-800/30">
          <h3 className="text-sm font-black mb-6 text-zinc-100 italic">{t.recentAnalysis}</h3>
          <div className="space-y-3">
            {journal.length === 0 ? (
              <p className="text-xs text-zinc-600 italic py-10 text-center uppercase font-black tracking-widest">Sem operações no Ledger.</p>
            ) : (
              journal.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/50 hover:border-emerald-500/20 transition-all cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${entry.bias === 'BULLISH' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {entry.bias === 'BULLISH' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tighter flex items-center gap-2">
                        {entry.pair}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-bold">{new Date(entry.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-zinc-700" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
