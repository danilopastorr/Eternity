
import React, { useState, useEffect } from 'react';
import { Client, Company } from '../types';
import { apiService } from '../services/apiService';
import { mockClients, mockCompanies } from '../services/mockData';

type ViewMode = 'list' | 'edit' | 'create';

interface DependentLink {
  id: string;
  clientId: string;
  name: string;
  kinship: string;
}

interface ClientManagerProps {
  initialId?: string | null;
  clearInitialId?: () => void;
}

const ClientManager: React.FC<ClientManagerProps> = ({ initialId, clearInitialId }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  // Estado para o usuário logado (controle de permissão)
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Estados para o formulário de edição
  const [editForm, setEditForm] = useState<Partial<Client>>({});
  const [dependents, setDependents] = useState<DependentLink[]>([]);
  
  // Estados para adição de familiar
  const [isAddingFamiliar, setIsAddingFamiliar] = useState(false);
  const [familiarMode, setFamiliarMode] = useState<'search' | 'create'>('search');
  const [familiarSearch, setFamiliarSearch] = useState('');
  const [newFamiliarForm, setNewFamiliarForm] = useState({ name: '', cpf: '', birthDate: '', kinship: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const savedUser = localStorage.getItem('eternity_user');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));

      const [clientData, companyData] = await Promise.all([
        apiService.get('clients'),
        apiService.get('companies')
      ]);
      setClients(clientData.length ? clientData : mockClients);
      setCompanies(companyData.length ? companyData : mockCompanies);
    } catch {
      setClients(mockClients);
      setCompanies(mockCompanies);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (initialId && clients.length > 0) {
      const client = clients.find(c => c.id === initialId);
      if (client) {
        handleEdit(client);
        if (clearInitialId) clearInitialId();
      }
    }
  }, [initialId, clients]);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.cpf.includes(search)
  );

  const handleEdit = (client: Client) => {
    setEditForm({ ...client });
    // Simula busca de dependentes vinculados ao carregar a ficha
    // Em um sistema real, isso viria de uma tabela de relacionamento (n-n)
    setDependents([
      { id: 'lnk' + Math.random(), clientId: '2', name: 'Maria Oliveira', kinship: 'Cônjuge' }
    ]);
    setViewMode('edit');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setClients(prev => prev.map(c => c.id === editForm.id ? { ...c, ...editForm } as Client : c));
    alert('Cadastro atualizado com sucesso!');
    setViewMode('list');
  };

  // Verificação de permissão (Admin ou Representante que criou)
  const canEditFamily = () => {
    if (!currentUser || !editForm) return false;
    if (currentUser.role === 'ADMIN') return true;
    return editForm.representativeId === currentUser.id;
  };

  // Vincular cliente já existente
  const linkExistingClient = (clientToLink: Client) => {
    if (!canEditFamily()) {
      alert('Você não tem permissão para alterar a unidade familiar deste cliente.');
      return;
    }

    const kinship = prompt(`Qual o parentesco de ${clientToLink.name} com o titular?`, 'Dependente');
    if (!kinship) return;

    const newLink: DependentLink = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: clientToLink.id,
      name: clientToLink.name,
      kinship: kinship
    };

    setDependents(prev => [...prev, newLink]);
    setIsAddingFamiliar(false);
    setFamiliarSearch('');
  };

  // Criar novo e vincular imediatamente
  const createAndLinkClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditFamily()) {
      alert('Você não tem permissão para cadastrar dependentes para este titular.');
      return;
    }

    const newClientId = 'new_' + Math.random().toString(36).substr(2, 9);
    const newClient: Client = {
      id: newClientId,
      name: newFamiliarForm.name,
      cpf: newFamiliarForm.cpf,
      birthDate: newFamiliarForm.birthDate,
      registrationDate: new Date().toLocaleDateString('pt-BR'),
      status: 'BASIC',
      representativeId: currentUser?.id // Herda o representante atual
    };

    // Adiciona à lista global de clientes (persistência simulada)
    setClients(prev => [...prev, newClient]);
    
    // Cria o vínculo
    const newLink: DependentLink = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: newClientId,
      name: newFamiliarForm.name,
      kinship: newFamiliarForm.kinship
    };

    setDependents(prev => [...prev, newLink]);
    setNewFamiliarForm({ name: '', cpf: '', birthDate: '', kinship: '' });
    setIsAddingFamiliar(false);
    alert('Novo cliente criado no sistema e vinculado como dependente.');
  };

  const handlePrintFicha = () => {
    window.print();
  };

  if (viewMode === 'edit' || viewMode === 'create') {
    return (
      <div className="animate-fade-in space-y-6 md:space-y-8 pb-20">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-4">
            <button onClick={() => setViewMode('list')} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-cyan-500 transition-colors shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Ficha do Beneficiário</h1>
              <p className="text-slate-500 font-medium text-sm">Titular: <span className="text-cyan-600 font-black">{editForm.name || 'Novo Cadastro'}</span></p>
            </div>
          </div>
          <button onClick={handlePrintFicha} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 flex items-center gap-2 hover:shadow-md transition-all">
            <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2.538a1 1 0 00.993-.883l.546-4.66a1 1 0 00-.993-1.117H4.91a1 1 0 00-.993 1.117l.546 4.66a1 1 0 00.993.883H8m9-3.5V7a2 2 0 00-2-2H9a2 2 0 00-2 2v6.5m10 3.5v3a1 1 0 01-1 1H8a1 1 0 01-1-1v-3m10-3.5H7" /></svg>
            Imprimir Cadastro
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Dados Pessoais - Correção do Input de Data */}
            <section className="bg-white p-6 md:p-10 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-8 h-8 cyan-gradient rounded-xl flex items-center justify-center text-white text-xs shadow-lg">1</span>
                Dados Cadastrais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                  <input name="name" value={editForm.name || ''} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data de Nascimento</label>
                  <input type="date" name="birthDate" value={editForm.birthDate || ''} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CPF</label>
                  <input name="cpf" value={editForm.cpf || ''} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">RG</label>
                  <input name="rg" value={editForm.rg || ''} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 font-bold" />
                </div>
              </div>
            </section>

            {/* Endereço */}
            <section className="bg-white p-6 md:p-10 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-8 h-8 cyan-gradient rounded-xl flex items-center justify-center text-white text-xs shadow-lg">2</span>
                Localização
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-1 md:col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CEP</label>
                  <input name="zipCode" value={editForm.zipCode || ''} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 font-bold" />
                </div>
                <div className="space-y-1 md:col-span-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rua / Avenida</label>
                  <input name="address" value={editForm.address || ''} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Número</label>
                  <input name="addressNumber" value={editForm.addressNumber || ''} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 font-bold" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bairro</label>
                  <input name="neighborhood" value={editForm.neighborhood || ''} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cidade</label>
                  <input name="city" value={editForm.city || ''} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 font-bold" />
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6 md:space-y-8">
             {/* Status e Ações Financeiras */}
             <section className="bg-slate-900 p-8 md:p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden print:hidden">
                <h2 className="text-xl font-black mb-6 relative z-10">Resumo do Plano</h2>
                <div className="space-y-4 mb-8 relative z-10">
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Valor Mensal</p>
                      <p className="text-xl font-black text-cyan-400">R$ {editForm.monthlyValue?.toFixed(2) || '49.90'}</p>
                   </div>
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Tipo de Cobrança</p>
                      <select name="paymentMethod" value={editForm.paymentMethod || 'PIX'} onChange={handleInputChange} className="w-full bg-transparent text-sm font-bold outline-none cursor-pointer">
                        <option value="PIX" className="text-slate-900 font-bold">PIX</option>
                        <option value="BOLETO" className="text-slate-900 font-bold">BOLETO</option>
                        <option value="CREDIT_CARD" className="text-slate-900 font-bold">CARTÃO CRÉDITO</option>
                      </select>
                   </div>
                </div>
                <button onClick={handleSave} className="w-full py-4.5 cyan-gradient text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl relative z-10 active:scale-95 transition-transform mb-4">Salvar Alterações</button>
                <button onClick={() => setViewMode('list')} className="w-full py-4.5 bg-white/10 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white/20 relative z-10 transition-colors">Cancelar</button>
             </section>

             {/* Gestão Familiar Dinâmica */}
             <div className="p-8 bg-cyan-50 border border-cyan-100 rounded-[2.5rem] print:hidden">
                <h4 className="text-[10px] font-black text-cyan-800 uppercase tracking-widest mb-4">Unidade Familiar</h4>
                
                <div className="space-y-3 mb-6">
                  {dependents.length > 0 ? dependents.map(dep => (
                    <div key={dep.id} className="bg-white p-4 rounded-2xl border border-cyan-100 flex justify-between items-center group">
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-800 truncate">{dep.name}</p>
                        <span className="text-[9px] font-black text-cyan-600 bg-cyan-100 px-2 py-0.5 rounded-md uppercase">{dep.kinship}</span>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => setDependents(prev => prev.filter(d => d.id !== dep.id))} className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                         </button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-6 bg-white/40 border border-dashed border-cyan-200 rounded-2xl">
                      <p className="text-[10px] text-cyan-700 font-bold uppercase tracking-tight">Sem dependentes</p>
                    </div>
                  )}
                </div>

                {!isAddingFamiliar ? (
                  <button 
                    onClick={() => {
                      if (!canEditFamily()) {
                        alert('Apenas o administrador ou o representante deste cliente podem adicionar familiares.');
                        return;
                      }
                      setIsAddingFamiliar(true);
                    }} 
                    className="w-full py-4 bg-white text-cyan-600 border border-cyan-200 rounded-2xl text-[10px] font-black uppercase hover:bg-cyan-600 hover:text-white transition-all shadow-sm"
                  >
                    + Adicionar Familiar
                  </button>
                ) : (
                  <div className="bg-white p-5 rounded-3xl border border-cyan-200 shadow-xl animate-fade-in space-y-4">
                    <div className="flex bg-slate-50 p-1 rounded-xl">
                      <button 
                        onClick={() => setFamiliarMode('search')}
                        className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${familiarMode === 'search' ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-400'}`}
                      >
                        Vincular Existente
                      </button>
                      <button 
                        onClick={() => setFamiliarMode('create')}
                        className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${familiarMode === 'create' ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-400'}`}
                      >
                        Novo Cliente
                      </button>
                    </div>

                    {familiarMode === 'search' ? (
                      <div className="space-y-3">
                        <div className="relative">
                          <input 
                            autoFocus
                            placeholder="Buscar por nome ou CPF..."
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:border-cyan-500"
                            value={familiarSearch}
                            onChange={e => setFamiliarSearch(e.target.value)}
                          />
                        </div>
                        <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1">
                          {clients
                            .filter(c => 
                              c.id !== editForm.id && 
                              !dependents.some(d => d.clientId === c.id) &&
                              (c.name.toLowerCase().includes(familiarSearch.toLowerCase()) || c.cpf.includes(familiarSearch))
                            )
                            .slice(0, 5)
                            .map(c => (
                              <button 
                                key={c.id}
                                onClick={() => linkExistingClient(c)}
                                className="w-full p-3 hover:bg-cyan-50 text-left rounded-xl transition-colors group flex justify-between items-center"
                              >
                                <span className="text-xs font-bold text-slate-700 group-hover:text-cyan-600">{c.name}</span>
                                <span className="text-[9px] text-slate-400 font-black">{c.cpf}</span>
                              </button>
                            ))
                          }
                          {familiarSearch.length > 0 && clients.filter(c => c.name.toLowerCase().includes(familiarSearch.toLowerCase())).length === 0 && (
                            <p className="text-center py-4 text-[10px] text-slate-400 font-bold uppercase">Nenhum cliente encontrado</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={createAndLinkClient} className="space-y-2">
                        <input 
                          placeholder="Nome Completo"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold"
                          value={newFamiliarForm.name}
                          onChange={e => setNewFamiliarForm({...newFamiliarForm, name: e.target.value})}
                          required
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            placeholder="CPF"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold"
                            value={newFamiliarForm.cpf}
                            onChange={e => setNewFamiliarForm({...newFamiliarForm, cpf: e.target.value})}
                            required
                          />
                          <input 
                            type="date"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold"
                            value={newFamiliarForm.birthDate}
                            onChange={e => setNewFamiliarForm({...newFamiliarForm, birthDate: e.target.value})}
                            required
                          />
                        </div>
                        <input 
                          placeholder="Parentesco (Ex: Filho, Cônjuge)"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold"
                          value={newFamiliarForm.kinship}
                          onChange={e => setNewFamiliarForm({...newFamiliarForm, kinship: e.target.value})}
                          required
                        />
                        <button type="submit" className="w-full py-3.5 cyan-gradient text-white rounded-xl text-[10px] font-black uppercase shadow-lg hover:scale-[1.02] transition-transform">Cadastrar e Vincular</button>
                      </form>
                    )}
                    
                    <button onClick={() => setIsAddingFamiliar(false)} className="w-full py-2 text-slate-400 text-[9px] font-black uppercase hover:text-rose-500 transition-colors">Cancelar</button>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Beneficiários</h1>
          <p className="text-slate-500 font-medium text-sm">Controle de contratos ativos e dependentes.</p>
        </div>
        <div className="flex gap-2">
           <div className="relative">
              <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nome ou CPF..." 
                className="w-full md:w-80 pl-10 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-cyan-500 shadow-sm"
              />
              <svg className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
           <button onClick={() => { setEditForm({ registrationDate: new Date().toLocaleDateString('pt-BR'), status: 'BASIC', representativeId: currentUser?.id }); setViewMode('create'); }} className="px-5 py-3.5 cyan-gradient text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">Novo Titular</button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Titular</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status Ficha</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredClients.map(client => (
                <tr key={client.id} className="hover:bg-cyan-50/10 transition-colors group">
                  <td className="px-10 py-6">
                    <button onClick={() => handleEdit(client)} className="flex items-center gap-4 text-left group">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0 group-hover:bg-cyan-100 transition-colors">👤</div>
                      <div>
                        <p className="text-sm font-black text-slate-900 group-hover:underline">{client.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">{client.cpf}</p>
                      </div>
                    </button>
                  </td>
                  <td className="px-10 py-6 text-center">
                     <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${client.status === 'COMPLETE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {client.status === 'COMPLETE' ? 'Completo' : 'Incompleto'}
                     </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button onClick={() => handleEdit(client)} className="text-cyan-600 font-black text-[10px] uppercase hover:underline">Editar Ficha</button>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-10 py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">Nenhum beneficiário encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientManager;
