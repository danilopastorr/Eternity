
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import ClientManager from './components/ClientManager.tsx';
import PlanManager from './components/PlanManager.tsx';
import CompanyManager from './components/CompanyManager.tsx';
import RepresentativeManager from './components/RepresentativeManager.tsx';
import FinanceManager from './components/FinanceManager.tsx';
import SupportManager from './components/SupportManager.tsx';
import SettingsManager from './components/SettingsManager.tsx';
import RankingManager from './components/RankingManager.tsx';
import CompanyEmployeesManager from './components/CompanyEmployeesManager.tsx';
import Login from './components/Login.tsx';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('eternity_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    localStorage.setItem('eternity_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('eternity_user');
  };

  const navigateToEdit = (tab: string, id: string) => {
    setActiveTab(tab);
    setEditingId(id);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': 
        return <Dashboard setActiveTab={setActiveTab} onNavigate={navigateToEdit} />;
      case 'clients': 
        return <ClientManager initialId={editingId} clearInitialId={() => setEditingId(null)} />;
      case 'plans': 
        return <PlanManager />;
      case 'representatives': 
        return <RepresentativeManager initialId={editingId} clearInitialId={() => setEditingId(null)} />;
      case 'companies': 
        return <CompanyManager initialId={editingId} clearInitialId={() => setEditingId(null)} onNavigate={navigateToEdit} />;
      case 'company-employees':
        return <CompanyEmployeesManager companyId={editingId || ''} onBack={() => setActiveTab('companies')} onNavigate={navigateToEdit} />;
      case 'finance': 
        return <FinanceManager onNavigate={navigateToEdit} />;
      case 'support': 
        return <SupportManager userRole={currentUser.role} userId={currentUser.id} />;
      case 'settings': 
        return <SettingsManager />;
      case 'ranking': 
        return <RankingManager onBack={() => setActiveTab('dashboard')} onNavigate={navigateToEdit} />;
      default: 
        return <Dashboard setActiveTab={setActiveTab} onNavigate={navigateToEdit} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setEditingId(null); 
          setIsSidebarOpen(false);
        }} 
        userRole={currentUser.role} 
        userName={currentUser.name}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className={`flex-1 transition-all duration-300 lg:ml-72 p-4 md:p-10 min-h-screen w-full overflow-x-hidden`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 lg:mb-8 flex justify-between items-center print:hidden">
             <div className="flex items-center gap-4">
                <button 
                  onClick={toggleSidebar}
                  className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 lg:hidden shadow-sm"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>
                <div className="bg-cyan-50 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-cyan-100">
                  <span className="text-[10px] md:text-xs font-bold text-cyan-700 uppercase tracking-widest">
                    Acesso: {currentUser.role === 'ADMIN' ? 'Diretoria' : 'Representante'}
                  </span>
                </div>
             </div>
             
             <div className="text-right hidden sm:block">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Data de Hoje</p>
                <p className="text-xs md:text-sm font-bold text-slate-700">{new Date().toLocaleDateString('pt-BR')}</p>
             </div>
          </div>
          
          <div className="animate-fade-in">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
