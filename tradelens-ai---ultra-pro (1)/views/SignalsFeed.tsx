
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, BellRing, Copy, Check, TrendingUp, TrendingDown, 
  Target, Shield, Activity, MessageSquare, Mail,
  Clock, Radio, Smartphone, MousePointer2, AlertCircle, Play, Pause, RefreshCw, Filter, X
} from 'lucide-react';

interface Signal {
  id: string;
  pair: string;
  bias: 'BUY' | 'SELL';
  entry: string;
  sl: string;
  tp: string;
  confidence: number;
  time: string;
  status: 'ACTIVE' | 'WON' | 'LOST' | 'PENDING';
  result?: string;
}

const MOCK_SIGNALS: Signal[] = [
  { id: '1', pair: 'XAUUSD', bias: 'BUY', entry: '2042.55', sl: '2036.00', tp: '2065.00', confidence: 89, time: '10:45', status: 'ACTIVE' },
  { id: '4', pair: 'GBPUSD', bias: 'SELL', entry: '1.26845', sl: '1.27150', tp: '1.26100', confidence: 85, time: '11:05', status: 'ACTIVE' },
  { id: '2', pair: 'BTCUSDT', bias: 'SELL', entry: '52140.5', sl: '52900.0', tp: '50500.0', confidence: 92, time: '11:20', status: 'ACTIVE' },
  { id: '3', pair: 'EURUSD', bias: 'BUY', entry: '1.08451', sl: '1.08200', tp: '1.09100', confidence: 78, time: '09:15', status: 'WON', result: '+65 pips' },
  { id: '5', pair: 'USDJPY', bias: 'SELL', entry: '156.80', sl: '157.20', tp: '155.50', confidence: 82, time: '08:30', status: 'LOST', result: '-40 pips' },
];

const SignalsFeed: React.FC = () => {
  const [signals, setSignals] = useState<Signal[]>(MOCK_SIGNALS);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Filtering States
  const [statusFilter, setStatusFilter] = useState<'ALL' | Signal['status']>('ALL');
  const [biasFilter, setBiasFilter] = useState<'ALL' | Signal['bias']>('ALL');

  const filteredSignals = useMemo(() => {
    return signals.filter(signal => {
      const statusMatch = statusFilter === 'ALL' || signal.status === statusFilter;
      const biasMatch = biasFilter === 'ALL' || signal.bias === biasFilter;
      return statusMatch && biasMatch;
    });
  }, [signals, statusFilter, biasFilter]);

  const syncPrices = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1500);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyFullSignal = (signal: Signal) => {
    const text = `🔹 TRADELENS AI SIGNAL 🔹\n\nATÍVO: ${signal.pair}\nORDEM: ${signal.bias === 'BUY' ? '🟢 COMPRA (BUY)' : '🔴 VENDA (SELL)'}\nENTRADA: ${signal.entry}\nSL: ${signal.sl}\nTP: ${signal.tp}\nCONFIANÇA: ${signal.confidence}%\n\nCopie e Cole no seu terminal!`;
    handleCopy(signal.id + 'full', text);
  };

  const clearFilters = () => {
    setStatusFilter('ALL');
    setBiasFilter('ALL');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
            <Radio className="text-black animate-pulse" size={24} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Radar Sinais<span className="text-emerald-500">.</span>IA</h2>
            <div className="flex items-center gap-2 mt-1">
              <RefreshCw className={`text-zinc-600 ${isSyncing ? 'animate-spin' : ''}`} size={12} />
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">
                {isSyncing ? 'Sincronizando Preços Forex...' : 'GBPUSD MONITORADO COM SUCESSO'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
           <button 
             onClick={syncPrices}
             className="px-6 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all flex items-center gap-2 group"
           >
             <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
             <span className="text-[10px] font-black uppercase tracking-widest">Sincronizar</span>
           </button>
           <button 
             onClick={() => setIsScanning(!isScanning)}
             className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 transition-all ${
               isScanning ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
             }`}
           >
             {isScanning ? <Pause size={14} /> : <Play size={14} />}
             {isScanning ? 'RADAR ATIVO' : 'RADAR PAUSADO'}
           </button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-6 p-6 bg-zinc-950/40 rounded-[2rem] border border-zinc-900/60 shadow-inner">
        <div className="flex items-center gap-3">
          <Filter size={14} className="text-emerald-500" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Filtros Avançados:</span>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          {/* Status Filter */}
          <div className="flex bg-zinc-900/60 p-1 rounded-xl border border-zinc-800">
             {['ALL', 'ACTIVE', 'WON', 'LOST', 'PENDING'].map(s => (
               <button 
                key={s} 
                onClick={() => setStatusFilter(s as any)}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${statusFilter === s ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
               >
                 {s}
               </button>
             ))}
          </div>

          {/* Bias Filter */}
          <div className="flex bg-zinc-900/60 p-1 rounded-xl border border-zinc-800">
             {['ALL', 'BUY', 'SELL'].map(b => (
               <button 
                key={b} 
                onClick={() => setBiasFilter(b as any)}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${
                  biasFilter === b 
                  ? (b === 'BUY' ? 'bg-emerald-500 text-black' : b === 'SELL' ? 'bg-rose-500 text-black' : 'bg-zinc-800 text-white shadow-lg') 
                  : 'text-zinc-500 hover:text-zinc-300'
                }`}
               >
                 {b}
               </button>
             ))}
          </div>

          {(statusFilter !== 'ALL' || biasFilter !== 'ALL') && (
            <button 
              onClick={clearFilters}
              className="flex items-center gap-2 px-3 py-2 text-rose-500/70 hover:text-rose-400 text-[9px] font-black uppercase transition-all"
            >
              <X size={12} />
              Limpar
            </button>
          )}
        </div>

        <div className="ml-auto">
          <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Exibindo: {filteredSignals.length} de {signals.length} Sinais</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel Lateral de Status */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card p-6 rounded-[2rem] border-zinc-800/40">
             <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <BellRing size={14} /> Alertas de Automação
             </h3>
             <div className="space-y-3">
                <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl flex items-center justify-between">
                   <div className="flex items-center gap-3 text-sky-400">
                      <MessageSquare size={16} />
                      <span className="text-[10px] font-black uppercase">Telegram</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black text-emerald-500">ON</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                   </div>
                </div>
                <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl flex items-center justify-between">
                   <div className="flex items-center gap-3 text-amber-400">
                      <Mail size={16} />
                      <span className="text-[10px] font-black uppercase">E-mail</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black text-emerald-500">ON</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                   </div>
                </div>
             </div>
          </div>

          <div className="glass-card p-6 rounded-[2rem] border-zinc-800/40 bg-zinc-950/20">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Scanner Log</h3>
                <Activity size={14} className="text-emerald-500" />
             </div>
             <div className="space-y-4">
                {[
                  'GBPUSD: Estrutura de Baixa em M15', 
                  'EURUSD: Rompimento de Liquidez', 
                  'XAUUSD: Rejeição em OrderBlock', 
                  'BTCUSD: Aguardando Volume'
                ].map((log, i) => (
                   <div key={i} className="flex items-center gap-3">
                      <div className={`w-1 h-1 rounded-full ${log.includes('GBPUSD') ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-800'}`} />
                      <p className={`text-[9px] font-bold uppercase truncate ${log.includes('GBPUSD') ? 'text-zinc-300' : 'text-zinc-600'}`}>{log}</p>
                   </div>
                ))}
             </div>
          </div>
        </div>

        {/* Feed de Sinais Principal */}
        <div className="lg:col-span-9 space-y-6">
          {filteredSignals.length === 0 ? (
             <div className="p-20 border-2 border-dashed border-zinc-900 rounded-[3rem] text-center space-y-6 bg-zinc-950/20 animate-in fade-in zoom-in-95">
                <div className="p-5 bg-zinc-900/80 rounded-full w-fit mx-auto border border-zinc-800">
                  <Filter size={32} className="text-zinc-700" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-black text-white uppercase tracking-widest">Nenhum sinal encontrado</p>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed max-w-sm mx-auto">
                    Não há sinais correspondentes aos filtros selecionados no momento. Tente ajustar os critérios de busca.
                  </p>
                </div>
                <button onClick={clearFilters} className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-400">Remover todos os filtros</button>
             </div>
          ) : (
            filteredSignals.map((signal) => {
              const isBuy = signal.bias === 'BUY';
              
              return (
                <div 
                  key={signal.id} 
                  className={`glass-card rounded-[2.5rem] p-8 border-2 transition-all group overflow-hidden relative animate-in slide-in-from-bottom-4 duration-500 ${
                    isBuy ? 'hover:border-emerald-500/40 border-emerald-500/10 bg-emerald-500/[0.01]' : 'hover:border-rose-500/40 border-rose-500/10 bg-rose-500/[0.01]'
                  } ${signal.status === 'WON' || signal.status === 'LOST' ? 'opacity-50 hover:opacity-100 grayscale-[0.5] hover:grayscale-0' : ''}`}
                >
                  {/* Visual Background Effect */}
                  <div className={`absolute top-0 right-0 w-80 h-80 blur-[120px] -z-10 opacity-10 transition-opacity ${
                    isBuy ? 'bg-emerald-500' : 'bg-rose-500'
                  }`} />

                  <div className="flex flex-col xl:flex-row gap-8 items-start xl:items-center relative z-10">
                    {/* Asset Status */}
                    <div className="min-w-[180px] space-y-3">
                      <div className="flex items-center gap-3">
                         <span className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">{signal.pair}</span>
                         {signal.status !== 'ACTIVE' && (
                           <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                             signal.status === 'WON' ? 'bg-emerald-500 text-black' : 
                             signal.status === 'LOST' ? 'bg-rose-500 text-black' : 'bg-zinc-800 text-zinc-400'
                           }`}>
                             {signal.status}
                           </span>
                         )}
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase w-fit shadow-lg ${
                        isBuy ? 'bg-emerald-500 text-black shadow-emerald-500/20' : 'bg-rose-500 text-black shadow-rose-500/20'
                      }`}>
                        {isBuy ? <TrendingUp size={14} strokeWidth={3} /> : <TrendingDown size={14} strokeWidth={3} />}
                        {isBuy ? '🟢 COMPRA (BUY)' : '🔴 VENDA (SELL)'}
                      </div>
                      <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-black uppercase tracking-widest pt-1">
                         <Clock size={12} /> {signal.time} • M15 Timeframe
                      </div>
                    </div>

                    {/* Entry Parameters */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                       <div 
                          onClick={() => handleCopy(signal.id + 'en', signal.entry)}
                          className="p-6 bg-zinc-950/60 border border-zinc-800 rounded-[1.5rem] hover:border-zinc-500 transition-all cursor-pointer group/item relative"
                       >
                          <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest block mb-2">Ponto de Entrada</span>
                          <span className="text-2xl font-mono font-black text-white leading-none">{signal.entry}</span>
                          <Copy size={16} className="absolute top-6 right-6 text-zinc-800 group-hover/item:text-emerald-500 transition-colors" />
                       </div>
                       <div 
                          onClick={() => handleCopy(signal.id + 'sl', signal.sl)}
                          className="p-6 bg-rose-500/[0.04] border border-rose-500/20 rounded-[1.5rem] hover:border-rose-500/50 transition-all cursor-pointer group/item relative"
                       >
                          <span className="text-[8px] text-rose-500/60 font-black uppercase tracking-widest block mb-2">Stop Loss</span>
                          <span className="text-2xl font-mono font-black text-rose-500 leading-none">{signal.sl}</span>
                          <Copy size={16} className="absolute top-6 right-6 text-rose-900 group-hover/item:text-rose-500 transition-colors" />
                       </div>
                       <div 
                          onClick={() => handleCopy(signal.id + 'tp', signal.tp)}
                          className="p-6 bg-emerald-500/[0.04] border border-emerald-500/20 rounded-[1.5rem] hover:border-emerald-500/50 transition-all cursor-pointer group/item relative"
                       >
                          <span className="text-[8px] text-emerald-500/60 font-black uppercase tracking-widest block mb-2">Take Profit</span>
                          <span className="text-2xl font-mono font-black text-emerald-500 leading-none">{signal.tp}</span>
                          <Copy size={16} className="absolute top-6 right-6 text-emerald-900 group-hover/item:text-emerald-500 transition-colors" />
                       </div>
                    </div>

                    {/* Actions and Score */}
                    <div className="flex xl:flex-col items-center gap-4 w-full xl:w-auto">
                      <div className="relative w-16 h-16 flex items-center justify-center bg-zinc-900/40 rounded-full border border-zinc-800">
                         <svg className="w-full h-full -rotate-90 scale-90">
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-zinc-950" />
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="5" fill="transparent" className={isBuy ? 'text-emerald-500' : 'text-rose-500'} strokeDasharray={175.9} strokeDashoffset={175.9 * (1 - signal.confidence / 100)} />
                         </svg>
                         <span className="absolute text-[10px] font-black text-white">{signal.confidence}%</span>
                      </div>
                      
                      <button 
                        onClick={() => copyFullSignal(signal)}
                        className={`flex-1 xl:w-full py-5 px-8 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${
                          copiedId === signal.id + 'full' ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30' : 'bg-white text-black hover:bg-zinc-200'
                        }`}
                      >
                        {copiedId === signal.id + 'full' ? <Check size={16} /> : <MousePointer2 size={16} />}
                        {copiedId === signal.id + 'full' ? 'COPIADO' : 'COPIAR TUDO'}
                      </button>
                    </div>
                  </div>
                  
                  {signal.result && (
                    <div className="mt-4 pt-4 border-t border-zinc-900 flex justify-end">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${signal.status === 'WON' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        Resultado: {signal.result}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {!signals.length && (
            <div className="p-12 border-2 border-dashed border-zinc-900 rounded-[3rem] text-center space-y-6 bg-zinc-950/20">
               <div className="p-5 bg-zinc-900/80 rounded-full w-fit mx-auto border border-zinc-800">
                  <AlertCircle size={32} className="text-zinc-600" />
               </div>
               <div className="space-y-2">
                  <p className="text-sm font-black text-zinc-500 uppercase tracking-widest">Scanner em Espera</p>
                  <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest leading-relaxed max-w-sm mx-auto">
                    Monitorando GBPUSD, EURUSD e XAUUSD em busca de confluências institucionais em tempos menores.
                  </p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignalsFeed;
