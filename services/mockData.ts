
import { Client, Plan, Company, Representative } from '../types';

export const mockRepresentatives: Representative[] = [
  { id: 'rep1', name: 'Lucas Amparo', email: 'lucas@eternity.com', login: 'lucas.rep', status: 'ACTIVE', totalClients: 45 },
  { id: 'rep2', name: 'Juliana Costa', email: 'juliana@eternity.com', login: 'ju.costa', status: 'ACTIVE', totalClients: 32 },
  { id: 'rep3', name: 'Ricardo Sales', email: 'ricardo@eternity.com', login: 'rsales', status: 'INACTIVE', totalClients: 12 },
];

export const mockCompanies: Company[] = [
  { id: '1', name: 'TecnoCorp Ltda' },
  { id: '2', name: 'Logística Express' },
];

export const mockPlans: Plan[] = [
  { 
    id: '1', 
    name: 'Eternity Essencial', 
    price: 49.90, 
    description: 'Cobertura básica individual com assistência funeral 24h.',
    coverage: ['Assistência 24h', 'Translado Nacional', 'Urna Padrão']
  },
  { 
    id: '2', 
    name: 'Eternity Family Plus', 
    price: 89.90, 
    description: 'Nossa melhor cobertura para você e até 4 dependentes.',
    coverage: ['Titular + 4 Dependentes', 'Translado Ilimitado', 'Cremação Inclusa', 'Jazigo Familiar']
  },
  { 
    id: '3', 
    name: 'Eternity Corporate', 
    price: 29.90, 
    description: 'Plano exclusivo para empresas parceiras e seus colaboradores.',
    coverage: ['Desconto em Folha', 'Sem Carência', 'Cobertura em Grupo']
  }
];

export const mockClients: Client[] = [
  { id: '1', name: 'João Silva', cpf: '123.456.789-00', registrationDate: '12/05/2024', status: 'COMPLETE', representativeId: 'rep1' },
  { id: '2', name: 'Maria Oliveira', cpf: '987.654.321-11', registrationDate: '14/05/2024', status: 'BASIC', companyId: '1', representativeId: 'rep2' },
  { id: '3', name: 'Pedro Santos', cpf: '444.555.666-77', registrationDate: '15/05/2024', status: 'COMPLETE', companyId: '2', representativeId: 'rep1' },
];
