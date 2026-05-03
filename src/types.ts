export type Role = 'ADMIN' | 'HEAD' | 'STAFF';
export type Department = 'FINANCE' | 'PROCUREMENT' | 'SALES' | 'GENERAL';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  department: Department;
  region?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Account {
  id: string;
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';
  parentCode?: string;
  balance: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  ref: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  createdBy: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  rating: number;
  address: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  status: 'PENDING' | 'APPROVED' | 'RECEIVED' | 'CANCELLED';
  totalAmount: number;
  items: POItem[];
  createdAt: string;
  approvedBy?: string;
}

export interface POItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
}

export interface Invoice {
  id: string;
  customerId: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';
  items: InvoiceItem[];
  totalAmount: number;
  vatAmount: number;
  region: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}
