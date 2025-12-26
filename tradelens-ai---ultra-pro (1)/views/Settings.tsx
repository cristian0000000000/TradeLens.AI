
import React, { useState, useEffect } from 'react';
import { User, Bell, Lock, Key, CreditCard, Shield, CheckCircle2, Phone, Copy, Check, MessageSquare, Mail, Globe, BellRing, Smartphone } from 'lucide-react';
import { useApp } from '../App';

const SettingsView: React.FC = () => {
  const { t } = useApp();
  const [copied, setCopied] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');

  const pixKey = "31996628999";

  useEffect(() => {
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
      setPushEnabled(Notification.permission === 'granted');
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePushNotifications = async () => {
    if (!('Notification' in window)) {
      alert("Este navegador não suporta notificações desktop.");
      return;
    }

    if (pushEnabled) {
      // Browsers don't allow revoking permission programmatically, 
      // but we can update our app's internal state.
      setPushEnabled(false);
    } else {
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);
      if (permission === 'granted') {
        setPushEnabled(true);
        new Notification("TradeLens AI", {
          body: "Notificações de sinais ativadas com sucesso!",
          icon: "/favicon.ico"
        });
      } else if (permission === 'denied') {
        alert("As notificações foram bloqueadas. Por favor, habilite-as nas configurações do seu navegador.");
      }
    }
  };

  const pricingPlans = [
    {
      name: t.economicPlan,
      price: "R$35",
      period: "/mês",
      features: ["3 AI Analyses / Day", "Basic Journaling", "Standard Support", "Manual Pix Activation"],
      button: "Select Economic",
      color: "zinc"
    },
    {
      name: t.premiumPlan,
      price: "R$90",
      period: "/mês",
      features: ["Unlimited AI Analyses", "Full Pro Dashboard", "Backtesting Engine", "Priority API Access", "Instant Pix Activation"],
      button: "Select Premium",
      color: "emerald",
      popular: true
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <header>
        <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">Configurações<span className="text-emerald-500">.</span>Account</h2>
        <p className="text-zinc-400 mt-1 font-medium">Gerencie sua conta e integrações de automação.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <aside className="space-y-2">
          {[
            { label: 'Perfil', icon: User, active: true },
            { label: 'Notificações', icon: Bell },
            { label: 'Segurança', icon: Lock },
            { label: 'Automação', icon: Globe },
            { label: t.billingInfo, icon: CreditCard },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all ${
                item.active ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:bg-zinc-900/50'
              }`}
            >
              <item.icon size={18} />
              <span className="text-[11px] font-black uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </aside>

        <div className="md:col-span-2 space-y-8">
          {/* Alertas de Navegador / Push */}
          <div className="glass-card p-8 rounded-[2.5rem] border-zinc-800/40 space-y-6">
            <h3 className="text-lg font-black text-white border-b border-zinc-900 pb-4 flex items-center gap-3 italic">
              <BellRing className="text-emerald-500" size={20} />
              Alertas do Terminal
            </h3>
            
            <div className="flex items-center justify-between p-6 bg-zinc-900/40 rounded-3xl border border-zinc-800">
               <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${pushEnabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-600'}`}>
                     <Smartphone size={24} />
                  </div>
                  <div>
                     <p className="text-sm font-black text-white uppercase tracking-tighter">Notificações Push</p>
                     <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Alertas de Sinais Buy/Sell em tempo real</p>
                  </div>
               </div>
               
               <button 
                  onClick={togglePushNotifications}
                  className={`w-14 h-8 rounded-full relative transition-all duration-500 ${pushEnabled ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-zinc-800'}`}
               >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-500 shadow-md ${pushEnabled ? 'left-7' : 'left-1'}`} />
               </button>
            </div>

            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest text-center">
               {notifPermission === 'denied' ? '⚠️ Notificações bloqueadas pelo navegador' : 'Recomendado para traders de Scalp em M1/M5'}
            </p>
          </div>

          {/* Integração de Automação */}
          <div className="glass-card p-8 rounded-[2.5rem] border-zinc-800/40 space-y-6">
            <h3 className="text-lg font-black text-white border-b border-zinc-900 pb-4 flex items-center gap-3 italic">
              <MessageSquare className="text-emerald-500" size={20} />
              Integração Institucional
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Telegram Bot Token</label>
                <input 
                  type="password" 
                  placeholder="0000000000:AAH_xxxxxxxxxxxxxxx"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-mono" 
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Seu Telegram ID (ou do Grupo)</label>
                <input 
                  type="text" 
                  placeholder="-100xxxxxxx"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-mono" 
                />
              </div>

              <div className="p-4 bg-zinc-900/40 rounded-2xl border border-zinc-800 flex items-center gap-4">
                 <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <Shield size={20} />
                 </div>
                 <p className="text-[10px] text-zinc-500 font-bold leading-relaxed">
                   Ative as notificações para receber os sinais da IA em tempo real. O bot enviará o par, entrada, alvo e stop loss instantaneamente.
                 </p>
              </div>

              <button className="w-full py-4 bg-white text-black text-[10px] font-black uppercase rounded-2xl hover:bg-emerald-400 transition-all">
                Salvar Configurações de API
              </button>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] space-y-6">
            <h3 className="text-lg font-black border-b border-zinc-800 pb-4 italic text-white">{t.pricingTitle}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pricingPlans.map((plan) => (
                <div key={plan.name} className={`p-6 rounded-[2rem] border transition-all ${plan.popular ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'}`}>
                  {plan.popular && <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2 block">Mais Popular</span>}
                  <h4 className="text-[10px] font-black text-zinc-400 mb-1 uppercase tracking-widest">{plan.name}</h4>
                  <div className="flex items-baseline mb-4">
                    <span className="text-2xl font-black text-white">{plan.price}</span>
                    <span className="text-[10px] text-zinc-500 ml-1 font-bold uppercase">{plan.period}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map(f => (
                      <li key={f} className="text-[10px] text-zinc-500 flex items-center space-x-2 font-bold uppercase tracking-tight">
                        <CheckCircle2 size={12} className={plan.popular ? 'text-emerald-400' : 'text-zinc-600'} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] space-y-6">
            <h3 className="text-lg font-black border-b border-zinc-800 pb-4 text-emerald-400 flex items-center space-x-2 italic">
              <Phone size={20} />
              <span>{t.pixPayment}</span>
            </h3>
            <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl space-y-6">
              <p className="text-xs text-zinc-300 font-bold leading-relaxed uppercase tracking-tight">
                Para atualizar sua conta, envie o valor via Pix. Após o pagamento, envie o comprovante para o suporte via WhatsApp.
              </p>
              <div className="flex flex-col space-y-2">
                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{t.pixKey}</span>
                <div className="flex items-center justify-between bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-inner group">
                  <span className="font-mono text-2xl text-emerald-400 font-black tracking-wider drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">{pixKey}</span>
                  <button 
                    onClick={handleCopy}
                    className="flex items-center space-x-2 px-4 py-2 bg-zinc-900 group-hover:bg-zinc-800 border border-zinc-800 rounded-xl text-[10px] font-black uppercase transition-all active:scale-95"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copied ? 'OK!' : t.copyPix}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
