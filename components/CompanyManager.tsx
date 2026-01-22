
import React, { useState, useEffect } from 'react';
import { Company, Client } from '../types';
import { apiService } from '../services/apiService';
import { mockCompanies, mockClients } from '../services/mockData';

interface CompanyManagerProps {
  initialId?: string | null;
  clearInitialId?: () => void;
  onNavigate: (tab: string, id: string) => void;
}

const CompanyManager: React.FC<CompanyManagerProps> = ({ initialId, clearInitialId, onNavigate }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ id: '', name: '', cnpj: '', email: '', phone: '' });

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await apiService.get('companies');
      setCompanies(data.length ? data : mockCompanies);
    } catch { setCompanies(mockCompanies); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCompanies(); }, []);

  useEffect(() => {
    if (initialId && companies.length > 0) {
      const company = companies.find(c => c.id === initialId);
      if (company) {
        handleEdit(company);
        if (clearInitialId) clearInitialId();
      }
    }
  }, [initialId, companies]);

  const handleEdit = (company: Company) => {
    setFormData({
      id: company.id,
      name: company.name,
      cnpj: company.cnpj || '',
      email: company.email || '',
      phone: company.phone || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    fetchCompanies();
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Empresas Parceiras</h1>
          <p className="text-slate-500 font-medium text-sm">Controle de convênios corporativos e faturamento PJ.</p>
        </div>
        <button 
          onClick={() => { setFormData({id: '', name: '', cnpj: '', email: '', phone: ''}); setIsModalOpen(true); }}
          className="px-6 py-4 cyan-gradient text-white rounded-[1.5rem] font-black shadow-lg shadow-cyan-500/30 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Novo Convênio PJ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {companies.map(company => (
          <div key={company.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm group relative overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300">
            <div className="mb-6">
               <div className="w-14 h-14 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-xl mb-5 group-hover:bg-cyan-50 transition-colors shadow-inner">🏢</div>
               <h3 className="text-xl font-black text-slate-900 leading-tight mb-1">{company.name}</h3>
               <p className="text-[10px] text-cyan-600 font-black uppercase tracking-widest">{company.cnpj || 'CNPJ não informado'}</p>
            </div>
            
            <div className="mt-auto space-y-3">
              <button 
                onClick={() => onNavigate('company-employees', company.id)}
                className="w-full py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-600 transition-colors shadow-lg"
              >
                Listar Funcionários
              </button>
              <button 
                onClick={() => handleEdit(company)} 
                className="w-full py-3.5 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Editar Empresa
              </button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 print:hidden">
          <div className="bg-white rounded-[3rem] w-full max-w-xl p-12 shadow-2xl animate-fade-in">
            <h3 className="text-2xl font-black text-slate-900 mb-8">{formData.id ? 'Editar Convênio' : 'Novo Convênio PJ'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Razão Social</label>
                  <input value={formData.name} required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-500 font-bold" onChange={e => setFormData({...formData, name: e.target.value})} />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CNPJ</label>
                  <input value={formData.cnpj} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-500 font-bold" onChange={e => setFormData({...formData, cnpj: e.target.value})} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                     <input value={formData.email} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-500 font-bold" onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefone</label>
                     <input value={formData.phone} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-500 font-bold" onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
               </div>
              <div className="flex gap-4 pt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 font-black text-slate-500 uppercase text-[11px] tracking-widest">Cancelar</button>
                <button type="submit" className="flex-1 py-5 cyan-gradient text-white rounded-2xl font-black shadow-xl uppercase text-[11px] tracking-widest active:scale-95 transition-all">Salvar Empresa</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManager;
