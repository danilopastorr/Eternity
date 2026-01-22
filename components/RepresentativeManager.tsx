
import React, { useState, useEffect } from 'react';
import { Representative } from '../types';
import { apiService } from '../services/apiService';
import { mockRepresentatives } from '../services/mockData';

type ViewMode = 'list' | 'edit' | 'create';

interface RepresentativeManagerProps {
  initialId?: string | null;
  clearInitialId?: () => void;
}

const RepresentativeManager: React.FC<RepresentativeManagerProps> = ({ initialId, clearInitialId }) => {
  const [reps, setReps] = useState<Representative[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingRep, setEditingRep] = useState<Representative | null>(null);

  const fetchReps = async () => {
    setLoading(true);
    try {
      const data = await apiService.get('representatives');
      setReps(data.length ? data : mockRepresentatives);
    } catch { setReps(mockRepresentatives); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReps(); }, []);

  useEffect(() => {
    if (initialId && reps.length > 0) {
      const rep = reps.find(r => r.id === initialId);
      if (rep) {
        handleEdit(rep);
        if (clearInitialId) clearInitialId();
      }
    }
  }, [initialId, reps]);

  const handleEdit = (rep: Representative) => {
    setEditingRep(rep);
    setViewMode('edit');
  };

  if (viewMode === 'edit' || viewMode === 'create') {
    return (
      <div className="animate-fade-in space-y-8 pb-20">
        <div className="flex items-center gap-4">
          <button onClick={() => setViewMode('list')} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-cyan-500 transition-colors shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{viewMode === 'edit' ? 'Perfil do Representante' : 'Novo Representante'}</h1>
            <p className="text-slate-500 font-medium">Controle de acesso e remuneração de <span className="text-cyan-600 font-black">{editingRep?.name || 'Novo'}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              {/* Dados Cadastrais */}
              <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8">
                 <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <span className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-xs">👤</span>
                    Dados de Acesso & Contato
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                       <input defaultValue={editingRep?.name} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-500 font-bold" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CPF / CNPJ</label>
                       <input defaultValue={editingRep?.cpfCnpj} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-500 font-bold" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                       <input defaultValue={editingRep?.email} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-500 font-bold" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Login do Sistema</label>
                       <input defaultValue={editingRep?.login} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-500 font-bold" />
                    </div>
                 </div>
              </section>

              {/* Dados Bancários */}
              <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8">
                 <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <span className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 text-xs font-bold">$</span>
                    Dados Bancários & Comissão
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Comissão (%)</label>
                       <input type="number" defaultValue={editingRep?.commissionRate || 10} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-500 font-bold text-cyan-600" />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chave PIX</label>
                       <input defaultValue={editingRep?.pixKey} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-500 font-bold" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Banco</label>
                       <input defaultValue={editingRep?.bankInfo?.bank} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-500 font-bold" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Agência</label>
                       <input defaultValue={editingRep?.bankInfo?.agency} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-500 font-bold" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Conta Corrente</label>
                       <input defaultValue={editingRep?.bankInfo?.account} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-500 font-bold" />
                    </div>
                 </div>
              </section>
           </div>

           <div className="space-y-8">
              <section className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                 <h3 className="text-xl font-black mb-8 relative z-10">Resumo de Atividades</h3>
                 <div className="space-y-6 relative z-10">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total de Contratos</p>
                       <h4 className="text-3xl font-black">{editingRep?.totalClients || 0}</h4>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status de Acesso</p>
                       <div className="flex items-center gap-3 mt-2">
                          <div className={`w-3 h-3 rounded-full ${editingRep?.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span className="text-sm font-bold uppercase">{editingRep?.status === 'ACTIVE' ? 'Ativo' : 'Bloqueado'}</span>
                       </div>
                    </div>
                 </div>
                 <div className="mt-10 space-y-4 relative z-10">
                    <button className="w-full py-5 cyan-gradient text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Salvar Perfil</button>
                    <button onClick={() => setViewMode('list')} className="w-full py-5 bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-colors">Voltar</button>
                 </div>
              </section>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Equipe de Vendas</h1>
          <p className="text-slate-500 font-medium text-sm">Controle total de acessos e performance.</p>
        </div>
        <button onClick={() => setViewMode('create')} className="px-6 py-4 cyan-gradient text-white rounded-[1.5rem] font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all">+ Novo Representante</button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
               <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificação</th>
               <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Carteira</th>
               <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {reps.map(rep => (
              <tr key={rep.id} className="hover:bg-cyan-50/10 transition-colors group">
                <td className="px-8 py-6">
                  <button onClick={() => handleEdit(rep)} className="text-left group flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-cyan-100 transition-colors text-lg">👤</div>
                    <div>
                      <p className="text-sm font-black text-slate-900 group-hover:underline group-hover:text-cyan-600 transition-colors">{rep.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">@{rep.login} • {rep.email}</p>
                    </div>
                  </button>
                </td>
                <td className="px-8 py-6 text-center">
                   <span className="text-sm font-black text-slate-700">{rep.totalClients} <span className="text-[10px] text-slate-300">Contratos</span></span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button onClick={() => handleEdit(rep)} className="text-cyan-600 font-black text-[10px] uppercase hover:underline">Configurar Ficha</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepresentativeManager;
