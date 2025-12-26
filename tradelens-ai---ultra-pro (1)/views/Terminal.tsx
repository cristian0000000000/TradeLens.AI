
import React, { useState } from 'react';
import { useApp } from '../App';
import { Monitor, RefreshCw, Zap, Shield, Maximize2 } from 'lucide-react';

const ASSETS = [
  { symbol: "BINANCE:BTCUSDT", label: "BTC/USDT" },
  { symbol: "OANDA:XAUUSD", label: "GOLD (XAU)" },
  { symbol: "FX:EURUSD", label: "EUR/USD" },
  { symbol: "FX:GBPUSD", label: "GBP/USD" },
  { symbol: "FX:USDJPY", label: "USD/JPY" },
];

const Terminal: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState(ASSETS[0].symbol);
  const [loading, setLoading] = useState(true);

  const getChartUrl = (symbol: string) => {
    const params = new URLSearchParams({
      symbol: symbol,
      interval: "15",
      theme: "dark",
      style: "1",
      locale: "br",
      toolbar_bg: "000000",
      enable_publishing: "false",
      hide_top_toolbar: "false",
      hide_legend: "false",
      save_image: "true",
      container_id: "tv_chart"
    });
    return `https://s.tradingview.com/widgetembed/?${params.toString()}&utm_source=tradelens.ai`;
  };

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Header do Terminal */}
      <header className="flex justify-between items-center bg-zinc-950 border-b border-zinc-900 px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <h2 className="text-sm font-black text-white uppercase tracking-tighter italic">Live<span className="text-emerald-500">Terminal</span></h2>
          </div>
          <div className="hidden md:flex bg-zinc-900/60 p-1 rounded-xl border border-zinc-800">
            {ASSETS.map((asset) => (
              <button
                key={asset.symbol}
                onClick={() => {
                  setLoading(true);
                  setSelectedSymbol(asset.symbol);
                }}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                  selectedSymbol === asset.symbol 
                  ? 'bg-emerald-500 text-black' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                }`}
              >
                {asset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
           <button onClick={() => window.location.reload()} className="p-2 text-zinc-500 hover:text-white transition-all"><RefreshCw size={16} /></button>
           <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">IA Scanning Market...</span>
           </div>
        </div>
      </header>

      {/* Gráfico TradingView Full */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 gap-4">
            <Zap className="text-emerald-500 animate-bounce" size={32} />
            <p className="text-xs font-black text-zinc-600 uppercase tracking-[0.5em]">Carregando Gráfico Live...</p>
          </div>
        )}
        
        <iframe
          src={getChartUrl(selectedSymbol)}
          width="100%"
          height="100%"
          frameBorder="0"
          allowTransparency={true}
          scrolling="no"
          onLoad={() => setLoading(false)}
          className={`w-full h-full ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000`}
        />
        
        {/* Float Action */}
        <div className="absolute bottom-10 right-10">
           <button className="px-8 py-4 bg-emerald-500 text-black text-[11px] font-black uppercase rounded-2xl shadow-2xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
              <Maximize2 size={16} />
              <span>Análise Técnica IA</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
