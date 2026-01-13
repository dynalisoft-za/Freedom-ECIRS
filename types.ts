
export enum AppView {
  // Architect Views (Developer Portal)
  ARCHITECT_DASHBOARD = 'ARCHITECT_DASHBOARD',
  SCHEMA = 'SCHEMA',
  BACKEND_API = 'BACKEND_API',
  DOCUMENT_ENGINE = 'DOCUMENT_ENGINE',
  SECURITY_ARCHITECT = 'SECURITY_ARCHITECT',
  RATE_CARD_ARCHITECT = 'RATE_CARD_ARCHITECT',
  REPORTS_ARCHITECT = 'REPORTS_ARCHITECT',
  DEVOPS_ARCHITECT = 'DEVOPS_ARCHITECT',
  API_DOCS_ARCHITECT = 'API_DOCS_ARCHITECT',
  DATA_MIGRATION = 'DATA_MIGRATION',
  WHATSAPP_INTEGRATION = 'WHATSAPP_INTEGRATION',
  ACCOUNTING_INTEGRATION = 'ACCOUNTING_INTEGRATION',
  
  // Live App Views (EBRS Application)
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  APP_DASHBOARD = 'APP_DASHBOARD',
  CLIENTS = 'CLIENTS',
  CONTRACTS = 'CONTRACTS',
  INVOICES = 'INVOICES',
  RECEIPTS = 'RECEIPTS',
  USERS = 'USERS',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS',
  ADMIN = 'ADMIN',
  VERIFICATION_PORTAL = 'VERIFICATION_PORTAL',
  MOBILE_PWA = 'MOBILE_PWA',
  TUTORIAL = 'TUTORIAL'
}

export enum Language {
  ENGLISH = 'EN',
  HAUSA = 'HA'
}

export interface Client {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  tin: string;
  type: 'direct' | 'agency';
  balance: number;
}

export interface Contract {
  id: string;
  doc_num: string;
  client_name: string;
  campaign: string;
  amount: number;
  status: 'draft' | 'pending' | 'approved' | 'active';
  date: string;
}

export interface StaffMember {
  id: string;
  username: string;
  email: string;
  full_name: string;
  name: string; // Kept for backwards compatibility
  phone: string;
  role: 'super_admin' | 'station_manager' | 'sales_executive' | 'accountant' | 'viewer';
  station_codes: string[];
  stations: string[]; // Kept for backwards compatibility
  status: 'active' | 'inactive';
}

export type UserRole = 'super_admin' | 'station_manager' | 'sales_executive' | 'accountant' | 'viewer';

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  phone: string;
  role: UserRole;
  station_codes: string[];
  status: 'active' | 'inactive';
}

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
}
