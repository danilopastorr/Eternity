
export interface Client {
  id: string;
  name: string;
  cpf: string;
  rg?: string;
  birthDate?: string;
  email?: string;
  phone?: string;
  registrationDate: string;
  status: 'COMPLETE' | 'BASIC';
  companyId?: string;
  representativeId?: string;
  // Endereço
  zipCode?: string;
  address?: string;
  addressNumber?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  // Financeiro
  paymentMethod?: 'PIX' | 'BOLETO' | 'CREDIT_CARD';
  monthlyValue?: number;
}

export interface Representative {
  id: string;
  name: string;
  email: string;
  login: string;
  password?: string;
  phone?: string;
  cpfCnpj?: string;
  commissionRate?: number;
  pixKey?: string;
  bankInfo?: {
    bank?: string;
    agency?: string;
    account?: string;
  };
  status: 'ACTIVE' | 'INACTIVE';
  totalClients: number;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  coverage: string[];
}

export interface Company {
  id: string;
  name: string;
  cnpj?: string;
  email?: string;
  phone?: string;
}

export interface SystemSettings {
  corporateName: string;
  cnpj: string;
  phone: string;
  whatsapp: string;
  supportEmail: string;
  autoNotification: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMine: boolean;
}

export interface ChatSession {
  id: string;
  participantName: string;
  participantRole: 'ADMIN' | 'REPRESENTATIVE' | 'CLIENT';
  lastMessage: string;
  unreadCount: number;
  status: 'ONLINE' | 'OFFLINE';
}
