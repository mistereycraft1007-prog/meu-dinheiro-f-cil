export interface Transaction {
  id: string;
  loan_id: string;
  type: "haver" | "juros" | "pagamento_total" | "criacao" | "edicao";
  amount: number;
  description: string;
  date: string;
  created_at: string;
}

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
const TRANSACTIONS_KEY = 'loans_transactions';

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

    localDb.addTransaction({
      loan_id: newLoan.id,
      type: "criacao",
      amount: newLoan.loan_amount,
      description: `Empréstimo criado - Valor: R$ ${newLoan.loan_amount.toFixed(2)}`,
    });

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
    // Also delete transactions
    const transactions = localDb.getTransactions(id);
    const allTransactions = localDb.getAllTransactions().filter(t => t.loan_id !== id);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(allTransactions));
    return true;
  },

  // Transaction methods
  getAllTransactions: (): Transaction[] => {
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getTransactions: (loanId: string): Transaction[] => {
    return localDb.getAllTransactions()
      .filter(t => t.loan_id === loanId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at' | 'date'>): Transaction => {
    const allTransactions = localDb.getAllTransactions();
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString().split("T")[0],
      created_at: new Date().toISOString(),
    };
    allTransactions.push(newTransaction);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(allTransactions));
    return newTransaction;
  },
};
