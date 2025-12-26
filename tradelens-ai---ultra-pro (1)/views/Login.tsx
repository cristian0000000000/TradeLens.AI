
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldAlert, Mail } from 'lucide-react';
import { useApp } from '../App';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setIsAuth, setIsAdmin, t } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Validação de campos vazios
    if (!trimmedEmail || !trimmedPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    // Validação de formato de e-mail (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Por favor, insira um endereço de e-mail válido.');
      return;
    }

    setError('');

    if (trimmedPassword === '101010') {
      setIsAdmin(true);
    }
    
    setIsAuth(true);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-sm w-full glass-card p-10 rounded-3xl space-y-8 animate-in zoom-in-95 duration-300">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-400">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">{t.login}</h1>
          <p className="text-sm text-zinc-500 font-medium">Access TradeLens Terminal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6" noValidate>
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{t.email}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if(error) setError('');
                }}
                placeholder="nome@exemplo.com"
                className={`w-full bg-zinc-900 border ${error.includes('e-mail') ? 'border-rose-500/50' : 'border-zinc-800'} rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all`}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{t.password}</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if(error) setError('');
              }}
              placeholder="••••••••"
              className={`w-full bg-zinc-900 border ${error.includes('campos') ? 'border-rose-500/50' : 'border-zinc-800'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono`}
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <p className="text-rose-400 text-[10px] font-black uppercase text-center tracking-wider">{error}</p>
            </div>
          )}

          <div className="flex items-center space-x-2 text-zinc-500 text-[10px] bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 font-medium">
            <ShieldAlert size={14} className="shrink-0 text-amber-500" />
            <span>{t.adminPass}</span>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black text-base font-black rounded-xl transition-all shadow-lg active:scale-[0.98]"
          >
            {t.enter.toUpperCase()}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
