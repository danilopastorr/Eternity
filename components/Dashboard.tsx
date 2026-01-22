
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiService } from '../services/apiService';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  onNavigate: (tab: string, id: string) => void;
}

const chartData = [
  { name: 'Seg', val: 4000 }, { name: 'Ter', val: 3000 }, { name: 'Qua', val: 5500 },
  { name: 'Qui', val: 4700 }, { name: 'Sex', val: 6200 }, { name: 'Sáb', val: 3800 }, { name: 'Dom', val: 2100 },
];

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab, onNavigate }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    apiService.checkStatus().then(setIsConnected);
  }, []);

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="animate-fade-in space-y-6 md:space-y-8 print:p-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Visão Geral</h1>
             <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${isConnected ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                <span className="text-[9px] font-bold uppercase tracking-tighter">{isConnected ? 'Banco Online' : 'Banco Offline'}</span>
             </div>
          </div>
          <p className="text-slate-500 font-medium text-sm md:text-base">Bem-vindo ao centro de comando da Eternity.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="w-full md:w-auto px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2.538a1 1 0 00.993-.883l.546-4.66a1 1 0 00-.993-1.117H4.91a1 1 0 00-.993 1.117l.546 4.66a1 1 0 00.993.883H8m9-3.5V7a2 2 0 00-2-2H9a2 2 0 00-2 2v6.5m10 3.5v3a1 1 0 01-1 1H8a1 1 0 01-1-1v-3m10-3.5H7" /></svg>
            Imprimir Relatório
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Adesões Mês', value: '142', change: '+12%' },
          { label: 'Receita Prevista', value: 'R$ 84k', change: '+8%' },
          { label: 'Inadimplência', value: '3.1%', change: '-2%' },
          { label: 'Empresas', value: '28', change: '+4' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
              <span className={`text-[10px] font-bold ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-slate-100 shadow-sm print:shadow-none overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Desempenho Semanal</h3>
            <span className="text-[10px] font-bold text-slate-400">Total: 42.500 pts</span>
          </div>
          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '15px' }} 
                  itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="val" stroke="#0891b2" strokeWidth={4} fill="#06b6d4" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="cyan-gradient p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl text-white flex flex-col justify-between relative overflow-hidden print:hidden">
          <div className="relative z-10">
            <h2 className="text-xl md:text-2xl font-black mb-2">Ranking de Vendas</h2>
            <p className="text-cyan-100 text-xs md:text-sm font-medium mb-6 md:mb-8">Destaques da semana.</p>
            <div className="space-y-3 md:space-y-4">
              {[
                { id: 'rep1', name: 'Lucas Amparo', val: '45 contratos', pos: '🥇' },
                { id: 'rep2', name: 'Juliana Costa', val: '32 contratos', pos: '🥈' },
                { id: 'rep3', name: 'Ricardo Sales', val: '12 contratos', pos: '🥉' }
              ].map((item, i) => (
                <button 
                  key={i} 
                  onClick={() => onNavigate('representatives', item.id)}
                  className="w-full flex justify-between items-center bg-white/10 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/10 hover:bg-white/20 transition-all text-left"
                >
                  <span className="text-xs md:text-sm font-bold truncate pr-2 hover:underline">{item.pos} {item.name}</span>
                  <span className="text-[10px] md:text-xs font-black bg-white text-cyan-600 px-2 py-1 md:px-3 md:py-1 rounded-lg shrink-0">{item.val}</span>
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('ranking')}
            className="mt-8 w-full py-4 bg-white text-cyan-600 rounded-2xl font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-xs md:text-sm relative z-10"
          >
            Ver Detalhes do Ranking
          </button>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
