import { format } from 'date-fns';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: TransactionType;
  date: string; // ISO string
}

export const CATEGORIES = {
  [TransactionType.INCOME]: [
    'Salário',
    'Investimentos',
    'Freelance',
    'Presente',
    'Outros',
  ],
  [TransactionType.EXPENSE]: [
    'Alimentação',
    'Moradia',
    'Transporte',
    'Lazer',
    'Saúde',
    'Educação',
    'Compras',
    'Outros',
  ],
};

export const STORAGE_KEY = 'financas_pessoais_data';

export const loadTransactions = (): Transaction[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load transactions', e);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};
