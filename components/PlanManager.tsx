
import React, { useState, useEffect } from 'react';
import { Plan } from '../types';
import { apiService } from '../services/apiService';
import { mockPlans } from '../services/mockData';

type ViewMode = 'list' | 'edit' | 'create';

const PlanManager: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [loading, setLoading] = useState(true);

  // Estados do Formulário
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    coverage: ''
  });

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await apiService.get('plans');
      setPlans(data.length ? data : mockPlans);
    } catch { 
      setPlans(mockPlans); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleCreateNew = () => {
    setEditingPlan(null);
    setFormData({ name: '', price: '', description: '', coverage: '' });
    setViewMode('create');
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      description: plan.description,
      coverage: plan.coverage?.join(', ') || ''
    });
    setViewMode('edit');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir este plano permanentemente?')) {
      try {
        await apiService.delete(`plans/${id}`);
        fetchPlans();
      } catch { 
        alert('Erro ao deletar plano do servidor.'); 
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulação de salvamento
      setTimeout(() => {
        alert(viewMode === 'create' ? 'Novo plano cadastrado!' : 'Plano atualizado com sucesso!');
        setViewMode('list');
        fetchPlans();
      }, 1000);
    } catch {
      alert('Erro ao salvar plano.');
      setLoading(false);
    }
  };

  if (viewMode === 'edit' || viewMode === 'create') {
    return (
      <div className="animate-fade-in space-y-8 pb-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setViewMode('list')} 
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-cyan-500 transition-colors shadow-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900">{viewMode === 'edit' ? 'Configurar Plano' : 'Novo Plano Funerário'}</h1>
            <p className="text-slate-500 font-medium">Defina os valores, coberturas e detalhes comerciais.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSave} className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Comercial do Plano</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Eternity Family Gold" 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-500 font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mensalidade (R$)</label>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    placeholder="00.00" 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-500 font-bold" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição Curta para Venda</label>
                  <textarea 
                    required
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Resumo das principais vantagens para o cliente..." 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-500 font-bold resize-none" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Itens de Cobertura (Separados por vírgula)</label>
                  <input 
                    value={formData.coverage}
                    onChange={e => setFormData({...formData, coverage: e.target.value})}
                    placeholder="Translado, Urna Luxo, Coroa de Flores..." 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-500 font-bold" 
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-8 border-t border-slate-50">
                <button 
                  type="submit" 
                  className="flex-1 py-5 cyan-gradient text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-cyan-500/20 active:scale-95 transition-all"
                >
                  {viewMode === 'create' ? 'Cadastrar Plano Agora' : 'Atualizar Dados do Plano'}
                </button>
                <button 
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-colors"
                >
                  Cancelar Alterações
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <h3 className="text-xl font-black mb-6 relative z-10">Preview de Venda</h3>
              <div className="bg-white/10 rounded-2xl p-6 mb-6 relative z-10">
                <p className="text-[10px] font-black text-cyan-400 uppercase mb-2">Plano Sugerido</p>
                <h4 className="text-xl font-bold mb-4">{formData.name || 'Nome do Plano'}</h4>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-2xl font-black">R$ {parseFloat(formData.price || '0').toFixed(2)}</span>
                  <span className="text-[10px] opacity-60">/mês</span>
                </div>
                <div className="space-y-2 opacity-80">
                  {formData.coverage.split(',').filter(x => x.trim()).map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-bold">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                      {item.trim()}
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="p-8 bg-cyan-50 border border-cyan-100 rounded-[2.5rem]">
              <h4 className="text-xs font-black text-cyan-800 uppercase tracking-widest mb-3">Dica do Sistema</h4>
              <p className="text-xs text-cyan-700/70 font-medium leading-relaxed">
                Planos com mais de 5 itens de cobertura costumam ter 40% mais adesões. Lembre-se de detalhar bem os benefícios extras.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Planos & Coberturas</h1>
          <p className="text-slate-500 font-medium">Configure as ofertas do mercado e preços vigentes.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="px-6 py-4 cyan-gradient text-white rounded-[1.5rem] font-black shadow-lg shadow-cyan-500/30 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
          </svg>
          Novo Plano
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 text-center animate-pulse text-slate-400 font-bold uppercase text-xs tracking-widest">Sincronizando prateleira de planos...</div>
        ) : plans.map((plan) => (
          <div key={plan.id} className="relative bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-500">
            <div className="p-10 pb-0">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner group-hover:bg-cyan-50 transition-colors">📄</div>
              <h3 className="text-xl font-black text-slate-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-black text-cyan-600 tracking-tighter">R$ {plan.price.toFixed(2)}</span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">/ mensal</span>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">{plan.description}</p>
              
              <div className="space-y-2 mb-10">
                 {plan.coverage?.slice(0, 3).map((item, i) => (
                   <div key={i} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      <span className="text-xs font-bold text-slate-600">{item}</span>
                   </div>
                 ))}
                 {plan.coverage?.length > 3 && (
                   <p className="text-[10px] text-cyan-600 font-black uppercase">+ {plan.coverage.length - 3} Coberturas inclusas</p>
                 )}
              </div>
            </div>

            <div className="p-10 pt-0 mt-auto flex gap-3">
              <button 
                onClick={() => handleEdit(plan)} 
                className="flex-1 py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-cyan-600 transition-colors"
              >
                Configurar Plano
              </button>
              <button 
                onClick={() => handleDelete(plan.id)} 
                className="px-5 py-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanManager;
