import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, AlertCircle, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Loan {
  id: string;
  person_name: string;
  loan_amount: number;
  loan_date: string;
  amount_to_pay: number;
  due_date: string;
  status: string;
}

interface LoansTableProps {
  loans: Loan[];
  onEdit: (loan: Loan) => void;
  onDelete: () => void;
  onPayInterest: (loan: Loan) => void;
}

export function LoansTable({ loans, onEdit, onDelete, onPayInterest }: LoansTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date + "T00:00:00").toLocaleDateString("pt-BR");
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === "Pago") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate + "T00:00:00");
    return due < today;
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase.from("loans").delete().eq("id", deleteId);

      if (error) throw error;

      toast.success("Empréstimo excluído com sucesso!");
      onDelete();
      setDeleteId(null);
    } catch (error) {
      console.error("Erro ao excluir empréstimo:", error);
      toast.error("Erro ao excluir empréstimo");
    }
  };

  return (
    <>
      <div className="rounded-lg border bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Emprestado</TableHead>
              <TableHead>A Receber</TableHead>
              <TableHead>Data Empréstimo</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhum empréstimo cadastrado
                </TableCell>
              </TableRow>
            ) : (
              loans.map((loan) => (
                <TableRow key={loan.id} className={isOverdue(loan.due_date, loan.status) ? "bg-destructive/5" : ""}>
                  <TableCell className="font-medium">{loan.person_name}</TableCell>
                  <TableCell>{formatCurrency(loan.loan_amount)}</TableCell>
                  <TableCell className="font-semibold text-success">{formatCurrency(loan.amount_to_pay)}</TableCell>
                  <TableCell>{formatDate(loan.loan_date)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {isOverdue(loan.due_date, loan.status) && (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                      {formatDate(loan.due_date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={loan.status === "Pago" ? "default" : "secondary"} className={loan.status === "Pago" ? "bg-success hover:bg-success" : ""}>
                      {loan.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {loan.status === "Aberto" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onPayInterest(loan)}
                          title="Pagar juros e adiar 1 mês"
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => onEdit(loan)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => setDeleteId(loan.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este empréstimo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
