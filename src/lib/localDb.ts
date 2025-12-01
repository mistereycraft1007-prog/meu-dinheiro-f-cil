export interface Loan {
  id: string;
  person_name: string;
  loan_amount: number;
  loan_date: string;
  amount_to_pay: number;
  due_date: string;
  status: string;
  amount_received: number;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'loans_db';

export const localDb = {
  getLoans: (): Loan[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  addLoan: (loan: Omit<Loan, 'id' | 'created_at' | 'updated_at' | 'amount_received'>): Loan => {
    const loans = localDb.getLoans();
    const newLoan: Loan = {
      ...loan,
      id: crypto.randomUUID(),
      amount_received: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    loans.push(newLoan);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loans));
    return newLoan;
  },

  updateLoan: (id: string, updates: Partial<Loan>): Loan | null => {
    const loans = localDb.getLoans();
    const index = loans.findIndex(l => l.id === id);
    if (index === -1) return null;
    
    loans[index] = {
      ...loans[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loans));
    return loans[index];
  },

  deleteLoan: (id: string): boolean => {
    const loans = localDb.getLoans();
    const filtered = loans.filter(l => l.id !== id);
    if (filtered.length === loans.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },
};
