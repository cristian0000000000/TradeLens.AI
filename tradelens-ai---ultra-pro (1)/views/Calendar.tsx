
import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Clock, AlertTriangle, Globe } from 'lucide-react';
import { EconomicEvent } from '../types';

const MOCK_EVENTS: EconomicEvent[] = [
  { id: '1', time: '08:30', currency: 'USD', event: 'Non-Farm Payrolls', impact: 'HIGH', previous: '180K', forecast: '200K' },
  { id: '2', time: '08:30', currency: 'USD', event: 'Unemployment Rate', impact: 'HIGH', previous: '3.9%', forecast: '3.8%' },
  { id: '3', time: '10:00', currency: 'CAD', event: 'Ivey PMI', impact: 'MEDIUM', previous: '53.9', forecast: '55.2' },
  { id: '4', time: '14:30', currency: 'GBP', event: 'BoE Gov Bailey Speaks', impact: 'HIGH', previous: '-', forecast: '-' },
  { id: '5', time: '18:00', currency: 'EUR', event: 'Consumer Confidence', impact: 'LOW', previous: '-14.0', forecast: '-12.5' },
];

const CalendarView: React.FC = () => {
  const [highImpactOnly, setHighImpactOnly] = useState(true);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['All Regions']);

  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter(event => {
      if (highImpactOnly && event.impact !== 'HIGH') return false;
      return true;
    });
  }, [highImpactOnly]);

  const toggleRegion = (region: string) => {
    if (region === 'All Regions') {
      setSelectedRegions(['All Regions']);
    } else {
      setSelectedRegions(prev => {
        const filtered = prev.filter(r => r !== 'All Regions');
        if (filtered.includes(region)) {
          const next = filtered.filter(r => r !== region);
          return next.length === 0 ? ['All Regions'] : next;
        }
        return [...filtered, region];
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Calendário<span className="text-emerald-500">.</span>Econômico</h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-1">Monitoramento de Volatilidade Global</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-black uppercase tracking-widest">
          <Clock size={14} className="animate-pulse" />
          <span>Próximo evento em 45m</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="glass-card p-6 rounded-3xl border-zinc-800/40">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center space-x-2">
              <Globe size={16} />
              <span>Regiões</span>
            </h3>
            <div className="space-y-3">
              {['All Regions', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'].map((region) => (
                <label key={region} className="flex items-center space-x-3 cursor-pointer group">
                  <div 
                    onClick={() => toggleRegion(region)}
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                      selectedRegions.includes(region) ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-zinc-800 bg-zinc-900 group-hover:border-zinc-600'
                    }`}
                  >
                    {selectedRegions.includes(region) && <div className="w-2 h-2 bg-black rounded-sm" />}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider transition-colors ${selectedRegions.includes(region) ? 'text-white' : 'text-zinc-600'}`}>{region}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-3xl border-zinc-800/40">
            <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-4 flex items-center space-x-2">
              <AlertTriangle size={16} />
              <span>Apenas Alto Impacto</span>
            </h3>
            <p className="text-[9px] font-bold text-zinc-600 uppercase mb-5 leading-relaxed">Ocultar eventos de baixa volatilidade para focar no que importa.</p>
            
            <div 
              onClick={() => setHighImpactOnly(!highImpactOnly)}
              className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${highImpactOnly ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-zinc-800'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${highImpactOnly ? 'right-1' : 'left-1'}`} />
            </div>
          </div>
        </div>

        <div className="md:col-span-3 glass-card rounded-[2.5rem] overflow-hidden border border-zinc-800/50">
          <div className="p-8 border-b border-zinc-900 flex justify-between items-center bg-black/20">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center space-x-3">
              <CalendarIcon size={18} className="text-emerald-500" />
              <span>Sexta-feira, 24 de Maio, 2024</span>
            </h3>
            <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Timezone: GMT -05:00</span>
          </div>

          <div className="divide-y divide-zinc-900">
            {filteredEvents.length === 0 ? (
              <div className="p-20 text-center space-y-3">
                <Clock className="mx-auto text-zinc-800" size={32} />
                <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Sem eventos de alto impacto para hoje.</p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div key={event.id} className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-zinc-900/20 transition-all group">
                  <div className="flex items-center space-x-8 mb-4 sm:mb-0">
                    <div className="text-xs font-mono font-black text-zinc-500 group-hover:text-emerald-400 transition-colors">{event.time}</div>
                    <div className="flex items-center space-x-3 min-w-[80px]">
                      <img 
                        src={`https://flagcdn.com/w40/${event.currency.slice(0, 2).toLowerCase()}.png`} 
                        alt={event.currency} 
                        className="w-6 h-4 object-cover rounded-sm grayscale group-hover:grayscale-0 transition-all" 
                      />
                      <span className="text-sm font-black text-white">{event.currency}</span>
                    </div>
                    <div className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">{event.event}</div>
                  </div>

                  <div className="flex items-center space-x-12 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-2">Impacto</span>
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        event.impact === 'HIGH' ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]' : 
                        event.impact === 'MEDIUM' ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.2)]' : 'bg-emerald-500'
                      }`} />
                    </div>
                    <div className="text-center w-20">
                      <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest block mb-1">Anterior</span>
                      <span className="text-xs font-mono font-bold text-zinc-400">{event.previous}</span>
                    </div>
                    <div className="text-center w-20">
                      <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest block mb-1">Projeção</span>
                      <span className="text-xs font-mono font-bold text-zinc-100">{event.forecast}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
