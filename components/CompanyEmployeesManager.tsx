
import React from 'react';
import { mockClients, mockCompanies } from '../services/mockData';

interface CompanyEmployeesManagerProps {
  companyId: string;
  onBack: () => void;
  onNavigate: (tab: string, id: string) => void;
}

const CompanyEmployeesManager: React.FC<CompanyEmployeesManagerProps> = ({ companyId, onBack, onNavigate }) => {
  const company = mockCompanies.find(c => c.id === companyId);
  const employees = mockClients.filter(c => c.companyId === companyId);

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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Funcionários Vinculados</h1>
          <p className="text-slate-500 font-medium">Convênio corporativo: <span className="text-cyan-600 font-black underline">{company?.name || 'Empresa'}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
           <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                 <h2 className="text-lg font-black text-slate-900">Quadro de Colaboradores</h2>
                 <span className="text-[10px] font-black text-cyan-600 bg-cyan-50 px-3 py-1.5 rounded-lg uppercase tracking-widest">{employees.length} Ativos</span>
              </div>
              
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50/50">
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Funcionário</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">CPF</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ficha</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {employees.length > 0 ? employees.map(emp => (
                          <tr key={emp.id} className="hover:bg-cyan-50/10 transition-colors group">
                             <td className="px-8 py-6">
                                <p className="text-sm font-black text-slate-900 group-hover:underline cursor-pointer" onClick={() => onNavigate('clients', emp.id)}>{emp.name}</p>
                             </td>
                             <td className="px-8 py-6 text-xs font-bold text-slate-500">{emp.cpf}</td>
                             <td className="px-8 py-6 text-center">
                                <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase px-2 py-1 rounded-md">Ativo</span>
                             </td>
                             <td className="px-8 py-6 text-right">
                                <button onClick={() => onNavigate('clients', emp.id)} className="text-cyan-600 font-black text-[10px] uppercase hover:underline">Ver Detalhes</button>
                             </td>
                          </tr>
                       )) : (
                          <tr>
                             <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">Nenhum funcionário cadastrado para esta empresa</td>
                          </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl">
              <h4 className="text-lg font-black mb-6">Ações Rápidas</h4>
              <button className="w-full py-4 cyan-gradient rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl mb-3">Gerar Relatório PJ</button>
              <button className="w-full py-4 bg-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-colors">Exportar CSV</button>
           </div>
           
           <div className="p-8 bg-amber-50 border border-amber-100 rounded-[2rem]">
              <h5 className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-2">Atenção Financeira</h5>
              <p className="text-xs text-amber-700/70 font-medium">A fatura deste convênio vence em 3 dias. Verifique se todos os funcionários acima estão incluídos no faturamento.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyEmployeesManager;
