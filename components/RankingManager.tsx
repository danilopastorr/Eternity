
import React from 'react';
import { mockRepresentatives } from '../services/mockData';

interface RankingManagerProps {
  onBack: () => void;
  onNavigate: (tab: string, id: string) => void;
}

const RankingManager: React.FC<RankingManagerProps> = ({ onBack, onNavigate }) => {
  const sortedReps = [...mockRepresentatives].sort((a, b) => b.totalClients - a.totalClients);

  return (
    <div className="animate-fade-in space-y-8 pb-20">
      <div className="flex items-center gap-4 print:hidden">
        <button 
          onClick={onBack} 
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-cyan-500 transition-colors shadow-sm"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Performance de Vendas</h1>
          <p className="text-slate-500 font-medium">Análise detalhada da produtividade por representante.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
            <div className="p-8 md:p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
               <h2 className="text-xl font-black text-slate-900">Classificação Geral</h2>
               <span className="text-[10px] font-black text-cyan-600 bg-cyan-50 px-3 py-1.5 rounded-lg uppercase tracking-widest">Mês Vigente</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Posição</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Representante</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Contratos</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Média p/ Semana</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sortedReps.map((rep, index) => (
                    <tr 
                      key={rep.id} 
                      onClick={() => onNavigate('representatives', rep.id)}
                      className="hover:bg-cyan-50/20 transition-colors group cursor-pointer"
                    >
                      <td className="px-10 py-6">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-black text-sm ${
                          index === 0 ? 'bg-amber-100 text-amber-600 shadow-sm shadow-amber-200' :
                          index === 1 ? 'bg-slate-100 text-slate-500' :
                          index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-slate-400'
                        }`}>
                          {index + 1}º
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg shadow-inner">👤</div>
                           <div>
                              <p className="text-sm font-black text-slate-900 leading-tight group-hover:underline">{rep.name}</p>
                              <p className="text-[10px] text-cyan-600 font-bold">Ativo desde Jan/24</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span className="text-lg font-black text-slate-700">{rep.totalClients}</span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <p className="text-xs font-black text-slate-900 leading-tight">{(rep.totalClients / 4).toFixed(1)}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Meta: 10.0</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
              <h4 className="text-xl font-black mb-6 relative z-10">Métricas Globais</h4>
              <div className="space-y-6 relative z-10">
                 <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Taxa de Conversão</p>
                    <h5 className="text-2xl font-black">68.4%</h5>
                 </div>
                 <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Ticket Médio p/ Rep</p>
                    <h5 className="text-2xl font-black text-cyan-400">R$ 542,00</h5>
                 </div>
                 <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Meta Batida</p>
                    <div className="w-full bg-white/10 h-2 rounded-full mt-4">
                       <div className="bg-cyan-500 h-full w-[72%] rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                    </div>
                    <p className="text-right text-[9px] font-black mt-2 text-cyan-400 uppercase">72% da meta mensal</p>
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RankingManager;
