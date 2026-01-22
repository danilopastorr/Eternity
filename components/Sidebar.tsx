
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string;
  userName: string;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userRole, userName, onLogout, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    ), roles: ['ADMIN', 'REPRESENTATIVE'] },
    { id: 'representatives', label: 'Representantes', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    ), roles: ['ADMIN'] },
    { id: 'clients', label: 'Clientes', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    ), roles: ['ADMIN', 'REPRESENTATIVE'] },
    { id: 'companies', label: 'Empresas', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    ), roles: ['ADMIN'] },
    { id: 'plans', label: 'Planos', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    ), roles: ['ADMIN', 'REPRESENTATIVE'] },
    { id: 'finance', label: 'Financeiro', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ), roles: ['ADMIN'] },
    { id: 'support', label: 'Suporte Online', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
    ), roles: ['ADMIN', 'REPRESENTATIVE'] },
    { id: 'settings', label: 'Configurações', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    ), roles: ['ADMIN'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className={`w-72 sidebar-gradient text-white flex flex-col h-screen fixed left-0 top-0 z-50 shadow-2xl transition-transform duration-300 print:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="p-8 flex items-center justify-between lg:block">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 cyan-gradient rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-xl font-bold">E</span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">ETERNITY</h1>
            <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-[0.2em]">Management System</p>
          </div>
        </div>
        
        {/* Botão fechar apenas visível no mobile quando aberto */}
        {isOpen && (
          <button 
            onClick={onClose}
            className="p-2 bg-white/10 rounded-lg lg:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 custom-scrollbar overflow-y-auto">
        {filteredMenu.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className={`${activeTab === item.id ? 'text-cyan-400' : 'group-hover:text-cyan-400'} transition-colors`}>
              {item.icon}
            </span>
            <span className="text-sm font-semibold tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl cyan-gradient flex items-center justify-center text-lg font-bold shadow-inner uppercase shrink-0">
            {userName.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold truncate">{userName}</p>
            <p className="text-[10px] text-cyan-400 font-bold uppercase">{userRole === 'ADMIN' ? 'Diretor Geral' : 'Representante'}</p>
          </div>
          <button 
            onClick={onLogout}
            className="text-slate-500 hover:text-rose-400 transition-colors p-2 shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;