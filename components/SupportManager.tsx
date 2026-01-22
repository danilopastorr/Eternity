
import React, { useState, useEffect, useRef } from 'react';
import { ChatSession, ChatMessage } from '../types';

interface SupportManagerProps {
  userRole: 'ADMIN' | 'REPRESENTATIVE';
  userId: string;
}

const mockSessions: ChatSession[] = [
  { id: '1', participantName: 'Lucas Amparo', participantRole: 'REPRESENTATIVE', lastMessage: 'Preciso de ajuda com um boleto.', unreadCount: 2, status: 'ONLINE' },
  { id: '2', participantName: 'Juliana Costa', participantRole: 'REPRESENTATIVE', lastMessage: 'Venda finalizada com sucesso!', unreadCount: 0, status: 'OFFLINE' },
  { id: '3', participantName: 'João da Silva', participantRole: 'CLIENT', lastMessage: 'Como altero meu plano?', unreadCount: 1, status: 'ONLINE' },
];

const mockMessages: ChatMessage[] = [
  { id: 'm1', senderId: 's1', text: 'Olá, bom dia! Como posso ajudar?', timestamp: '10:00', isMine: true },
  { id: 'm2', senderId: 'u1', text: 'Oi, estou com dificuldade em cadastrar um cliente PJ.', timestamp: '10:02', isMine: false },
  { id: 'm3', senderId: 's1', text: 'Claro, verifique se o CNPJ está com o formato correto.', timestamp: '10:05', isMine: true },
];

const SupportManager: React.FC<SupportManagerProps> = ({ userRole, userId }) => {
  const [sessions, setSessions] = useState<ChatSession[]>(mockSessions);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: userId,
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'CLIENT': return 'CLIENTE';
      case 'REPRESENTATIVE': return 'REPRESENTANTE';
      case 'ADMIN': return 'ADMINISTRADOR';
      default: return role;
    }
  };

  return (
    <div className="animate-fade-in flex flex-col md:flex-row h-[calc(100vh-12rem)] md:h-[calc(100vh-14rem)] bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden relative">
      {/* Sidebar de Conversas */}
      <div className={`${activeSession ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 border-r border-slate-50 flex-col h-full bg-white`}>
        <div className="p-6 md:p-8 border-b border-slate-50">
          <h2 className="text-xl font-black text-slate-900 mb-4">Conversas</h2>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar chat..." 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:border-cyan-500"
            />
            <svg className="w-4 h-4 absolute left-3 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {sessions.map(session => (
            <button 
              key={session.id}
              onClick={() => setActiveSession(session)}
              className={`w-full p-5 md:p-6 flex items-center gap-4 border-b border-slate-50 transition-all ${activeSession?.id === session.id ? 'bg-cyan-50 border-l-4 border-l-cyan-500' : 'hover:bg-slate-50'}`}
            >
              <div className="relative shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-200 rounded-2xl flex items-center justify-center text-lg shadow-inner">👤</div>
                {session.status === 'ONLINE' && (
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 md:w-4 md:h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-black text-slate-900 truncate pr-2">{session.participantName}</p>
                  {session.unreadCount > 0 && (
                    <span className="bg-cyan-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0">{session.unreadCount}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                   <p className="text-[9px] text-cyan-600 font-black uppercase tracking-tighter shrink-0">{getRoleLabel(session.participantRole)}</p>
                   <span className="text-[9px] text-slate-300">•</span>
                   <p className="text-[10px] text-slate-400 font-bold truncate flex-1">{session.lastMessage}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Janela de Chat */}
      {activeSession ? (
        <div className="flex-1 flex flex-col bg-slate-50/30 h-full">
          {/* Header do Chat */}
          <div className="p-4 md:p-6 bg-white border-b border-slate-50 flex items-center justify-between shadow-sm relative z-10">
            <div className="flex items-center gap-3 md:gap-4">
              {/* Botão Voltar para lista no Mobile */}
              <button 
                onClick={() => setActiveSession(null)}
                className="p-2 -ml-2 text-slate-400 hover:text-cyan-500 md:hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-lg shrink-0">👤</div>
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-900 truncate">{activeSession.participantName}</p>
                <p className="text-[9px] md:text-[10px] text-cyan-600 font-black uppercase tracking-widest">
                  {getRoleLabel(activeSession.participantRole)} • {activeSession.status === 'ONLINE' ? 'Ativo agora' : 'Offline'}
                </p>
              </div>
            </div>
            <div className="flex gap-1 md:gap-2">
              <button className="p-2 text-slate-400 hover:text-cyan-500 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></button>
              <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 custom-scrollbar">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-md p-3 md:p-4 rounded-2xl md:rounded-3xl text-xs md:text-sm font-medium shadow-sm ${msg.isMine ? 'bg-cyan-500 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                  {msg.text}
                  <p className={`text-[8px] md:text-[9px] mt-1 font-black uppercase ${msg.isMine ? 'text-white/70' : 'text-slate-400'}`}>{msg.timestamp}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input de Mensagem */}
          <form onSubmit={handleSendMessage} className="p-4 md:p-8 bg-white border-t border-slate-50">
            <div className="flex gap-2 md:gap-4">
              <input 
                type="text" 
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="Mensagem..." 
                className="flex-1 px-4 md:px-6 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:border-cyan-500 font-bold text-xs md:text-sm transition-all"
              />
              <button type="submit" className="w-12 h-12 md:w-14 md:h-14 cyan-gradient text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 active:scale-95 transition-all shrink-0">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center text-slate-400 space-y-4">
           <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-full flex items-center justify-center text-3xl md:text-4xl">💬</div>
           <p className="font-black uppercase tracking-widest text-[10px] md:text-xs text-center px-4">Selecione uma conversa para iniciar o atendimento</p>
        </div>
      )}
    </div>
  );
};

export default SupportManager;
