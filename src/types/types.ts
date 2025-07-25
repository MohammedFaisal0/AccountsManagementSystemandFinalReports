export interface Operation {
  id: number;
  chapter_name: string;
  section_name: string;
  item_name: string;
  type_name: string;
  office_name: string;
  directorate_name: string;
  amount: number;
  date: string;
  username: string;
  operation_type: string; // جديد
}

export interface Account {
  id: number;
  account_name: string;
  credit: number;
  debit: number;
  office_name: string;
  directorate_name: string;
  date: string;
  username: string; // جديد
  operation_type: string; // جديد
}

export interface FinancialData {
  operations: Operation[];
  accounts: Account[];
} 