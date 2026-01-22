
import React, { useState } from 'react';
import { SystemSettings } from '../types';

const SettingsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'company' | 'admins' | 'notifications'>('company');
  const [settings, setSettings] = useState<SystemSettings>({
    corporateName: 'Eternity Plano Funerário Ltda',
    cnpj: '12.345.678/0001-90',
    phone: '(11) 4002-8922',
    whatsapp: '(11) 99999-8888',
    supportEmail: 'contato@eternity.com.br',
    autoNotification: true
  });

  const [admins, setAdmins] = useState([
    { id: '1', name: 'Ricardo Diretor', email: 'ricardo@eternity.com', lastLogin: '22/05/2024' },
    { id: '2', name: 'Ana Admin', email: 'ana@eternity.com', lastLogin: '21/05/2024' }
  ]);

  return (
    <div className="animate-fade-in space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Configurações Gerais</h1>
          <p className="text-slate-500 font-medium">Gestão de infraestrutura, dados fiscais e administradores.</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          {[
            { id: 'company', label: 'Dados da Empresa' },
            { id: 'admins', label: 'Gestores Admin' },
            { id: 'notifications', label: 'Notificações' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {activeTab === 'company' && (
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8 animate-fade-in">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-8 h-8 cyan-gradient rounded-lg flex items-center justify-center text-white text-xs shadow-lg">📄</span>
                Informações Fiscais & Contato
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Razão Social</label>
                  <input value={settings.corporateName} onChange={e => setSettings({...settings, corporateName: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-500 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CNPJ</label>
                  <input value={settings.cnpj} onChange={e => setSettings({...settings, cnpj: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-500 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp de Suporte (Notificações)</label>
                  <input value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-500 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Administrativo</label>
                  <input value={settings.supportEmail} onChange={e => setSettings({...settings, supportEmail: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-cyan-500 font-bold" />
                </div>
              </div>
              
              <button className="px-10 py-5 cyan-gradient text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-cyan-500/20 active:scale-95 transition-all">
                Salvar Atualizações
              </button>
            </div>
          )}

          {activeTab === 'admins' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-900">Corpo Administrativo</h2>
                <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-600 transition-all">+ Novo Admin</button>
              </div>

              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Gestor</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Acesso em</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {admins.map(admin => (
                      <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-10 py-6">
                           <p className="text-sm font-black text-slate-900">{admin.name}</p>
                           <p className="text-[10px] text-slate-400 font-bold">{admin.email}</p>
                        </td>
                        <td className="px-10 py-6">
                           <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg uppercase tracking-widest">{admin.lastLogin}</span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <button className="text-[10px] font-black text-rose-500 uppercase hover:underline">Remover</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl">
              <h4 className="text-xl font-black mb-6 relative z-10">Status do Sistema</h4>
              <div className="space-y-4 relative z-10">
                 <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="text-xs font-bold text-slate-400">Banco de Dados</span>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                 </div>
                 <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="text-xs font-bold text-slate-400">API de Pagamentos</span>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                 </div>
                 <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="text-xs font-bold text-slate-400">WhatsApp Gateway</span>
                    <span className="w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]"></span>
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
           </div>

           <div className="p-8 bg-cyan-50 border border-cyan-100 rounded-[2.5rem]">
              <h5 className="text-[10px] font-black text-cyan-800 uppercase tracking-widest mb-3">Segurança</h5>
              <p className="text-xs text-cyan-700/70 font-medium leading-relaxed">
                As notificações via WhatsApp dependem da configuração correta do Gateway nas configurações de notificação.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
