
import React, { useState, useMemo } from 'react';
import { JournalEntry } from '../types';
import { Search, Filter, CheckCircle2, XCircle, Clock, ArrowRight, BookOpen, Trash2, Calendar, TrendingUp, TrendingDown, Minus, Target, Sparkles } from 'lucide-react';
import { useApp } from '../App';
import { useNavigate } from 'react-router-dom';

interface JournalProps {
  entries: JournalEntry[];
  onUpdate: (entries: JournalEntry[]) => void;
}

const Journal: React.FC<JournalProps> = ({ entries, onUpdate }) => {
  const { t } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      const matchesSearch = e.pair.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [entries, searchTerm, statusFilter]);

  const updateStatus = (id: string, status: JournalEntry['status']) => {
    const updated = entries.map(e => e.id === id ? { ...e, status } : e);
    onUpdate(updated);
  };

  const deleteEntry = (id: string) => {
    if (confirm('Deletar registro permanentemente?')) {
      onUpdate(entries.filter(e => e.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-white italic uppercase">Ledger<span className="text-emerald-500">.</span>Pro</h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-1">Log de Operações Institucionais</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
            <input 
              type="text" 
              placeholder="Buscar Ativo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-zinc-950/40 border border-zinc-800 rounded-xl text-[11px] font-bold focus:border-emerald-500/50 outline-none"
            />
          </div>
          
          <div className="flex bg-zinc-900/40 p-1 rounded-xl border border-zinc-800">
             {['ALL', 'WON', 'LOST', 'PENDING'].map(s => (
               <button 
                key={s} 
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${statusFilter === s ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
               >
                 {s}
               </button>
             ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEntries.length === 0 ? (
          <div className="col-span-full py-32 text-center glass-card rounded-[3rem] border-dashed border-zinc-800 flex flex-col items-center justify-center space-y-6">
             <div className="w-24 h-24 bg-zinc-900/50 rounded-full flex items-center justify-center border border-zinc-800 animate-pulse">
                <Target size={40} className="text-zinc-700" />
             </div>
             <div className="space-y-2">
                <p className="text-sm font-black text-white uppercase tracking-[0.2em]">Nenhuma operação registrada no banco de dados</p>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                   Inicie uma nova análise institucional para gerar pontos de entrada e salvar seu histórico de trading.
                </p>
             </div>
             <button 
                onClick={() => navigate('/analyzer')}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-black uppercase rounded-2xl transition-all shadow-xl shadow-emerald-500/10 flex items-center gap-3 active:scale-95"
             >
                <Sparkles size={14} />
                <span>Nova Análise IA</span>
             </button>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="glass-card rounded-[2.5rem] overflow-hidden border border-zinc-800/50 flex flex-col hover:border-emerald-500/30 transition-all group">
              <div className="relative h-48 overflow-hidden">
                <img src={entry.imageUrl} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                    entry.bias === 'BULLISH' ? 'bg-emerald-500 text-black' : 'bg-rose-500 text-black'
                  }`}>
                    {entry.bias === 'BULLISH' ? <TrendingUp size={10} className="inline mr-1" /> : <TrendingDown size={10} className="inline mr-1" />}
                    {entry.pair}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">{new Date(entry.timestamp).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="p-6 flex-1 space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                  <div className="space-y-1">
                    <p className="text-[8px] text-zinc-600 font-black uppercase">Lote Sugerido</p>
                    <p className="text-lg font-mono font-black text-white">{entry.positionSize}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[8px] text-zinc-600 font-black uppercase">Confiabilidade IA</p>
                    <p className="text-lg font-mono font-black text-emerald-400">{entry.confidenceScore}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <p className="text-[8px] text-zinc-600 font-black uppercase">Preço Entrada</p>
                     <p className="text-xs font-mono font-bold text-zinc-400">{entry.entry}</p>
                   </div>
                   <div className="space-y-1 text-right">
                     <p className="text-[8px] text-zinc-600 font-black uppercase">Alvo Principal</p>
                     <p className="text-xs font-mono font-bold text-emerald-500">{entry.takeProfit}</p>
                   </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <select 
                    value={entry.status}
                    onChange={(e) => updateStatus(entry.id, e.target.value as any)}
                    className={`flex-1 bg-zinc-900 text-[10px] font-black px-4 py-3 rounded-xl border border-zinc-800 outline-none transition-all cursor-pointer ${
                      entry.status === 'WON' ? 'text-emerald-400 border-emerald-500/30' : 
                      entry.status === 'LOST' ? 'text-rose-400 border-rose-500/30' : 'text-zinc-500'
                    }`}
                  >
                    <option value="PENDING">PENDENTE</option>
                    <option value="WON">WINNER</option>
                    <option value="LOST">LOSS</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                  <button onClick={() => deleteEntry(entry.id)} className="p-3 bg-zinc-900 hover:bg-rose-500/10 hover:text-rose-500 rounded-xl transition-all border border-zinc-800 text-zinc-700">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Journal;
