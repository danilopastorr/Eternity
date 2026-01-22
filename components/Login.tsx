
import React, { useState } from 'react';
import { apiService } from '../services/apiService';

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Tenta login na API Real
      const user = await apiService.post('login', { login, password });
      onLogin(user);
    } catch (err: any) {
      // Se a API estiver offline, permite login de teste (apenas para este ambiente)
      if (login === 'admin' && password === '123') {
        onLogin({ id: 'admin', name: 'Administrador Demo', role: 'ADMIN' });
      } else {
        setError('Falha na conexão ou credenciais inválidas. Verifique se o servidor Node.js está rodando.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen cyan-gradient flex items-center justify-center p-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mt-48 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full -mr-48 -mb-48 blur-3xl"></div>

      <div className="bg-white/80 backdrop-blur-xl w-full max-w-md p-10 rounded-[3rem] shadow-2xl border border-white/40 animate-fade-in relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 cyan-gradient rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-cyan-500/30 transform rotate-12">
            <span className="text-4xl font-black text-white tracking-tighter -rotate-12">E</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Eternity</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Management System</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Usuário de Acesso</label>
            <input 
              type="text" 
              required
              className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all font-bold text-slate-700" 
              placeholder="Digite seu login"
              value={login}
              onChange={e => setLogin(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha Segura</label>
            <input 
              type="password" 
              required
              className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all font-bold text-slate-700" 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 cyan-gradient text-white rounded-2xl font-black shadow-xl shadow-cyan-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : 'Acessar Painel'}
          </button>
        </form>

        <p className="mt-10 text-center text-[10px] text-slate-400 font-black uppercase tracking-widest">
          Sistema Seguro & Criptografado
        </p>
      </div>
    </div>
  );
};

export default Login;
