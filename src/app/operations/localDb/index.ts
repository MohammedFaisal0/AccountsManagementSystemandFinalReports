// قاعدة بيانات محلية للعمليات والحسابات باستخدام localStorage
import { Operation, Account, FinancialData } from '../../../types/types';

const STORAGE_KEY = 'financialData';

export function getFinancialData(): FinancialData {
  if (typeof window === 'undefined') return { operations: [], accounts: [] };
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return { operations: [], accounts: [] };
  try {
    return JSON.parse(data) as FinancialData;
  } catch {
    return { operations: [], accounts: [] };
  }
}

export function saveFinancialData(data: FinancialData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function addOperations(newOps: Operation[]) {
  const data = getFinancialData();
  data.operations = [...data.operations, ...newOps];
  saveFinancialData(data);
}

export function addAccounts(newAccounts: Account[]) {
  const data = getFinancialData();
  data.accounts = [...data.accounts, ...newAccounts];
  saveFinancialData(data);
} 