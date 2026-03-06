import { supabase } from "@/integrations/supabase/client";

const getUserId = async (): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");
  return user.id;
};

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

export interface Transaction {
  id: string;
  loan_id: string;
  type: "haver" | "juros" | "pagamento_total" | "criacao" | "edicao";
  amount: number;
  description: string;
  date: string;
  created_at: string;
}

export const cloudDb = {
  getLoans: async (): Promise<Loan[]> => {
    const { data, error } = await supabase
      .from("loans")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []) as Loan[];
  },

  addLoan: async (loan: Omit<Loan, "id" | "created_at" | "updated_at" | "amount_received">): Promise<Loan> => {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from("loans")
      .insert({
        person_name: loan.person_name,
        loan_amount: loan.loan_amount,
        loan_date: loan.loan_date,
        amount_to_pay: loan.amount_to_pay,
        due_date: loan.due_date,
        status: loan.status,
        amount_received: 0,
        user_id: userId,
      })
      .select()
      .single();
    if (error) throw error;

    await cloudDb.addTransaction({
      loan_id: data.id,
      type: "criacao",
      amount: data.loan_amount,
      description: `Empréstimo criado - Valor: R$ ${Number(data.loan_amount).toFixed(2)}`,
    });

    return data as Loan;
  },

  updateLoan: async (id: string, updates: Partial<Loan>): Promise<Loan> => {
    const { data, error } = await supabase
      .from("loans")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as Loan;
  },

  deleteLoan: async (id: string): Promise<void> => {
    // Get loan info before deleting for the log
    const { data: loan } = await supabase.from("loans").select("person_name, loan_amount").eq("id", id).single();
    
    // Log deletion
    if (loan) {
      await cloudDb.addTransaction({
        loan_id: id,
        type: "exclusao",
        amount: Number(loan.loan_amount),
        description: `Empréstimo de ${loan.person_name} excluído - Valor: R$ ${Number(loan.loan_amount).toFixed(2)}`,
      });
    }

    const { error } = await supabase.from("loans").delete().eq("id", id);
    if (error) throw error;
  },

  getTransactions: async (loanId: string): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("loan_id", loanId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []) as Transaction[];
  },

  addTransaction: async (transaction: Omit<Transaction, "id" | "created_at" | "date">): Promise<Transaction> => {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        loan_id: transaction.loan_id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        user_id: userId,
      })
      .select()
      .single();
    if (error) throw error;
    return data as Transaction;
  },
};
