
import React, { useState, useRef, useEffect } from 'react';
import { 
  Loader2, Target, ShieldCheck, Zap, AlertCircle, AlertOctagon, 
  Check, Layers, Shield, Activity, Wallet, Crosshair, 
  TrendingUp, TrendingDown, Scan, Mail, MousePointer2, Copy, Gauge
} from 'lucide-react';
import { analyzeMultiTimeframe } from './geminiService';
import { TradePlan, JournalEntry, Bias } from '../types';
import { useApp } from '../App';

interface AnalyzerProps {
  onSave: (entry: JournalEntry) => void;
}

const Analyzer: React.FC<AnalyzerProps> = ({ onSave }) => {
  const [strategy, setStrategy] = useState('SMC/ICT');
  const [primaryImage, setPrimaryImage] = useState<string | null>(null);
  const [secondaryImage, setSecondaryImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [analysisTime, setAnalysisTime] = useState<number | null>(null);
  const [result, setResult] = useState<Partial<TradePlan> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [balance, setBalance] = useState<number>(5000);
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [checklist, setChecklist] = useState({ news: true, mindset: true, technical: true });
  const [lotSize, setLotSize] = useState<string>('0.00');

  const primaryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (result?.entry && result?.stopLoss) {
      const pips = Math.abs(result.entry - result.stopLoss);
      if (pips > 0) {
        const riskAmount = balance * (riskPercent / 100);
        const calc = (riskAmount / (pips * 10)).toFixed(2);
        setLotSize(calc);
      }
    }
  }, [result, balance, riskPercent]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setter(event.target?.result as string);
    reader.readAsDataURL(file);
    setResult(null);
    setAnalysisTime(null);
  };

  const startAnalysis = async () => {
    if (!primaryImage) return setError("Anexe o gráfico principal.");
    setLoading(true);
    setLoadingStep('Otimizando Imagem e Consultando Mercado...');
    const start = Date.now();
    try {
      // Passamos a imagem original, o service agora comprime internamente
      const { data } = await analyzeMultiTimeframe(primaryImage, null, strategy);
      setResult(data);
      setAnalysisTime((Date.now() - start) / 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isBuy = result?.bias === Bias.BULLISH;

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end bg-zinc-950/40 p-8 rounded-[2.5rem] border border-zinc-900 gap-6">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Analisador<span className="text-emerald-500">.</span>Manual</h2>
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] mt-2 italic">Carregue seu gráfico para extrair parâmetros institucionais</p>
        </div>
        <div className="flex items-center gap-4">
           {analysisTime && (
             <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-2">
                <Gauge size={14} className="text-emerald-500" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Latência: {analysisTime.toFixed(1)}s</span>
             </div>
           )}
           <div className="px-6 py-3 bg-zinc-900/50 rounded-2xl border border-zinc-800 hidden lg:block">
              <p className="text-[8px] text-zinc-600 font-black uppercase mb-1">IA Inteligência Ativa</p>
              <span className="text-xs font-black text-white">GEMINI 3 PRO OPTIMIZED</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div 
            onClick={() => primaryInputRef.current?.click()} 
            className={`group relative h-[450px] rounded-[3rem] border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center ${
              primaryImage ? 'border-emerald-500/20' : 'border-zinc-800 bg-zinc-950/20 hover:border-emerald-500/40'
            }`}
          >
            <input type="file" ref={primaryInputRef} className="hidden" onChange={(e) => handleUpload(e, setPrimaryImage)} />
            {primaryImage ? (
              <img src={primaryImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <div className="text-center p-12 space-y-6">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto border border-zinc-800 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
                  <Scan className="text-zinc-600 group-hover:text-emerald-500" size={32} />
                </div>
                <div>
                  <p className="text-sm font-black text-white uppercase tracking-widest">Clique para subir o gráfico</p>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase mt-2 italic">Formatos suportados: JPG, PNG, WEBP</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="glass-card p-6 rounded-[2rem] border-zinc-800/40">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase mb-4 flex items-center gap-2 italic"><Wallet size={14} /> Gestão de Risco</h4>
                <div className="space-y-4">
                   <div className="flex gap-2">
                      {[0.5, 1, 2, 3].map(v => (
                        <button key={v} onClick={() => setRiskPercent(v)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${riskPercent === v ? 'bg-emerald-500 text-black' : 'bg-zinc-900 text-zinc-500 hover:text-white'}`}>{v}%</button>
                      ))}
                   </div>
                   <input type="number" value={balance} onChange={(e) => setBalance(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white font-mono focus:border-emerald-500 outline-none" placeholder="Saldo em Dólar ($)" />
                </div>
             </div>
             
             <div className="glass-card p-6 rounded-[2rem] border-zinc-800/40 flex flex-col justify-center text-center space-y-2">
                <p className="text-[9px] text-zinc-600 font-black uppercase">Lote Recomendado</p>
                <p className="text-4xl font-mono font-black text-emerald-400 tracking-tighter">{lotSize}</p>
                <p className="text-[8px] text-zinc-700 font-bold uppercase">Baseado no risco de {riskPercent}%</p>
             </div>
          </div>

          <button onClick={startAnalysis} disabled={loading} className={`w-full py-8 rounded-[2rem] font-black uppercase text-xs flex items-center justify-center gap-4 transition-all active:scale-[0.98] ${loading ? 'bg-zinc-900 text-zinc-700' : 'bg-white text-black hover:bg-emerald-400'}`}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} fill="currentColor" />}
            {loading ? loadingStep : "INICIAR PROCESSAMENTO OTIMIZADO"}
          </button>
        </div>

        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <div className={`glass-card rounded-[3rem] p-8 border-2 transition-all animate-in zoom-in-95 shadow-2xl space-y-8 ${
              isBuy ? 'border-emerald-500/30 bg-emerald-500/[0.02]' : 'border-rose-500/30 bg-rose-500/[0.02]'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-5xl font-black text-white italic tracking-tighter uppercase">{result.pair}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${isBuy ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-pulse'}`} />
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Setup de Alta Probabilidade</p>
                  </div>
                </div>
                <div className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase flex items-center gap-2 shadow-lg ${
                  isBuy ? 'bg-emerald-500 text-black shadow-emerald-500/20' : 'bg-rose-500 text-black shadow-rose-500/20'
                }`}>
                  {isBuy ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {isBuy ? 'COMPRA' : 'VENDA'}
                </div>
              </div>

              <div className="space-y-4">
                 <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-[2rem] flex justify-between items-center">
                    <div>
                       <p className="text-[9px] text-zinc-600 font-black uppercase mb-1 flex items-center gap-2">
                         Viés de Mercado 
                         {isBuy ? <TrendingUp size={10} className="text-emerald-500" /> : <TrendingDown size={10} className="text-rose-500" />}
                       </p>
                       <span className={`text-xl font-black uppercase tracking-tighter ${isBuy ? 'text-emerald-400' : 'text-rose-400'}`}>
                         {isBuy ? 'Bullish / Alta' : 'Bearish / Baixa'}
                       </span>
                    </div>
                 </div>

                 <div className="relative group">
                    <div onClick={() => handleCopy('en', String(result.entry))} className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-[2rem] flex justify-between items-center cursor-pointer hover:border-zinc-700 transition-all">
                       <div>
                          <p className="text-[9px] text-zinc-600 font-black uppercase mb-1">Ponto de Entrada</p>
                          <span className="text-3xl font-mono font-black text-white">{result.entry}</span>
                       </div>
                       <Copy size={20} className={`transition-all ${copiedId === 'en' ? 'text-emerald-500 scale-125' : 'text-zinc-700 group-hover:text-zinc-500'}`} />
                    </div>
                 </div>

                 <div className="relative group">
                    <div onClick={() => handleCopy('sl', String(result.stopLoss))} className="p-6 bg-rose-500/[0.05] border border-rose-500/20 rounded-[2rem] flex justify-between items-center cursor-pointer hover:border-rose-500/40 transition-all">
                       <div>
                          <p className="text-[9px] text-rose-500/60 font-black uppercase mb-1">Stop Loss (Proteção)</p>
                          <span className="text-3xl font-mono font-black text-rose-500">{result.stopLoss}</span>
                       </div>
                       <Copy size={20} className={`transition-all ${copiedId === 'sl' ? 'text-rose-500 scale-125' : 'text-rose-900 group-hover:text-rose-700'}`} />
                    </div>
                 </div>

                 <div className="relative group">
                    <div onClick={() => handleCopy('tp', String(result.takeProfit))} className="p-6 bg-emerald-500/[0.05] border border-emerald-500/20 rounded-[2rem] flex justify-between items-center cursor-pointer hover:border-emerald-500/40 transition-all">
                       <div>
                          <p className="text-[9px] text-emerald-500/60 font-black uppercase mb-1">Take Profit (Alvo)</p>
                          <span className="text-3xl font-mono font-black text-emerald-500">{result.takeProfit}</span>
                       </div>
                       <Copy size={20} className={`transition-all ${copiedId === 'tp' ? 'text-emerald-500 scale-125' : 'text-emerald-900 group-hover:text-emerald-700'}`} />
                    </div>
                 </div>
              </div>

              <div className="p-6 bg-black/40 rounded-[2rem] border border-zinc-900 space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-zinc-500 uppercase italic">Confiabilidade Institucional</span>
                    <span className={`text-xl font-black ${isBuy ? 'text-emerald-400' : 'text-rose-400'}`}>{result.confidenceScore}%</span>
                 </div>
                 <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${isBuy ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${result.confidenceScore}%` }} />
                 </div>
              </div>

              <button 
                onClick={() => onSave({...result as JournalEntry, imageUrl: primaryImage!, status: 'PENDING', positionSize: lotSize})}
                className="w-full py-6 bg-zinc-100 hover:bg-white text-black text-xs font-black uppercase rounded-[1.5rem] transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95"
              >
                <MousePointer2 size={16} />
                Registrar no Ledger Pro
              </button>
            </div>
          ) : (
            <div className="glass-card rounded-[3rem] p-12 border border-zinc-900 h-full flex flex-col justify-center items-center text-center space-y-8 min-h-[500px]">
                <div className="w-32 h-32 bg-zinc-900/50 rounded-full flex items-center justify-center border border-zinc-800 animate-pulse relative">
                   <Target size={48} className="text-zinc-700" />
                   <div className="absolute inset-0 border-2 border-emerald-500/10 rounded-full animate-ping" />
                </div>
                <div className="space-y-4 max-w-[280px]">
                   <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">Aguardando Gráfico para Análise</h3>
                   <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-relaxed">
                     Sua zona de decisão institucional será plotada aqui após o processamento da imagem pela IA.
                   </p>
                </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="fixed bottom-10 right-10 z-[100] animate-in slide-in-from-right-10">
          <div className="px-8 py-5 bg-rose-600 text-white rounded-[2rem] font-black text-[11px] flex items-center gap-4 shadow-2xl uppercase border border-white/20">
            <AlertOctagon size={24} />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-4 p-2 bg-white/10 rounded-full hover:bg-white/20">✕</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyzer;
