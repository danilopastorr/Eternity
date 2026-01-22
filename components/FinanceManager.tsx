
import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/apiService';

interface FinanceConfig {
  gateway: string;
  publicKey: string;
  secretKey: string;
  taxRate: number;
  fixedFee: number;
  webhookUrl: string;
  environment: 'sandbox' | 'production';
}

interface Transaction {
  id: string;
  date: string;
  clientId: string;
  clientName: string;
  clientCpf: string;
  clientEmail: string;
  method: 'PIX' | 'BOLETO' | 'CARTÃO';
  status: 'PAID' | 'PENDING' | 'EXPIRED';
  grossValue: number;
  netValue: number;
}

const mockTransactions: Transaction[] = [
  { id: 'tx1', date: '2024-05-22 14:32', clientId: '1', clientName: 'João Silva', clientCpf: '123.456.789-00', clientEmail: 'joao@email.com', method: 'PIX', status: 'PAID', grossValue: 49.90, netValue: 48.15 },
  { id: 'tx2', date: '2024-05-22 12:10', clientId: '2', clientName: 'Maria Oliveira', clientCpf: '987.654.321-11', clientEmail: 'maria@email.com', method: 'BOLETO', status: 'PENDING', grossValue: 89.90, netValue: 86.22 },
  { id: 'tx3', date: '2024-05-21 09:45', clientId: '3', clientName: 'Pedro Santos', clientCpf: '444.555.666-77', clientEmail: 'pedro@email.com', method: 'CARTÃO', status: 'PAID', grossValue: 49.90, netValue: 47.30 },
  { id: 'tx4', date: '2024-05-20 18:20', clientId: '1', clientName: 'João Silva', clientCpf: '123.456.789-00', clientEmail: 'joao@email.com', method: 'PIX', status: 'PAID', grossValue: 49.90, netValue: 48.15 },
];

interface FinanceManagerProps {
  onNavigate: (tab: string, id: string) => void;
}

const FinanceManager: React.FC<FinanceManagerProps> = ({ onNavigate }) => {
  const [config, setConfig] = useState<FinanceConfig>({
    gateway: 'mercadopago',
    publicKey: '',
    secretKey: '',
    taxRate: 2.5,
    fixedFee: 0.90,
    webhookUrl: 'https://suaempresa.com.br/api/payments/webhook',
    environment: 'sandbox'
  });

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'settings' | 'transactions' | 'history'>('overview');
  const [loading, setLoading] = useState(false);
  const [txSearch, setTxSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [focusedClientId, setFocusedClientId] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(tx => {
      const matchesSearch = tx.clientName.toLowerCase().includes(txSearch.toLowerCase()) ||
                          tx.clientCpf.includes(txSearch) ||
                          tx.clientEmail.toLowerCase().includes(txSearch.toLowerCase());
      
      const txDate = new Date(tx.date.split(' ')[0]);
      const matchesStart = startDate ? txDate >= new Date(startDate) : true;
      const matchesEnd = endDate ? txDate <= new Date(endDate) : true;
      const matchesClient = focusedClientId ? tx.clientId === focusedClientId : true;

      return matchesSearch && matchesStart && matchesEnd && matchesClient;
    });
  }, [txSearch, startDate, endDate, focusedClientId]);

  const clearFilters = () => {
    setTxSearch('');
    setStartDate('');
    setEndDate('');
    setFocusedClientId(null);
  };

  return (
    <div className="animate-fade-in space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestão Financeira</h1>
          <p className="text-slate-500 font-medium">Controle de faturamento, taxas e integração bancária.</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
          {['overview', 'transactions', 'history', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab as any)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeSubTab === tab ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab === 'overview' ? 'Resumo' : tab === 'transactions' ? 'Transações' : tab === 'history' ? 'Histórico' : 'API'}
            </button>
          ))}
        </div>
      </div>

      {(activeSubTab === 'transactions' || activeSubTab === 'history') && (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valor Líquido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-cyan-50/10 transition-colors group">
                  <td className="px-10 py-6 text-xs font-bold text-slate-700">{tx.date}</td>
                  <td className="px-10 py-6">
                    <button 
                      onClick={() => onNavigate('clients', tx.clientId)}
                      className="flex items-center gap-3 text-left hover:text-cyan-600 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs">👤</div>
                      <div>
                        <p className="text-sm font-black group-hover:underline">{tx.clientName}</p>
                        <p className="text-[9px] text-slate-400">{tx.clientCpf}</p>
                      </div>
                    </button>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${tx.status === 'PAID' ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-700'}`}>
                      {tx.status === 'PAID' ? 'Pago' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right font-black text-slate-900">R$ {tx.netValue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* ... outros subtabs mantidos ... */}
    </div>
  );
};

export default FinanceManager;
