import { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/lib/cloudDb";
import { DollarSign, Calendar, PlusCircle, Pencil, CreditCard, Loader2, Trash2 } from "lucide-react";

const typeConfig: Record<string, { label: string; icon: React.ElementType }> = {
  criacao: { label: "Criação", icon: PlusCircle },
  haver: { label: "Haver", icon: DollarSign },
  juros: { label: "Pagou Juros", icon: Calendar },
  pagamento_total: { label: "Pagou Tudo", icon: CreditCard },
  edicao: { label: "Edição", icon: Pencil },
  exclusao: { label: "Exclusão", icon: Trash2 },
};

const typeBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  criacao: "default",
  haver: "outline",
  juros: "secondary",
  pagamento_total: "default",
  edicao: "secondary",
  exclusao: "destructive",
};

interface TransactionWithLoan extends Transaction {
  loan_person_name?: string;
}

export function TransactionsTab() {
  const [transactions, setTransactions] = useState<TransactionWithLoan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*, loans(person_name)")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      const mapped = (data || []).map((t: any) => ({
        ...t,
        loan_person_name: t.loans?.person_name || "—",
      }));
      setTransactions(mapped);
    } catch (err) {
      console.error("Erro ao carregar transações:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card shadow-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Descrição</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                Nenhuma transação registrada
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((t) => {
              const config = typeConfig[t.type] || typeConfig.edicao;
              const Icon = config.icon;
              const variant = typeBadgeVariant[t.type] || "secondary";
              return (
                <TableRow key={t.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(t.created_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="font-medium">{t.loan_person_name}</TableCell>
                  <TableCell>
                    <Badge variant={variant} className="gap-1">
                      <Icon className="h-3 w-3" />
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(Number(t.amount))}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[300px] truncate">
                    {t.description}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
