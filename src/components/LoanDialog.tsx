import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Loan {
  id: string;
  person_name: string;
  loan_amount: number;
  loan_date: string;
  amount_to_pay: number;
  due_date: string;
  status: string;
}

interface LoanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loan?: Loan | null;
  onSuccess: () => void;
}

export function LoanDialog({ open, onOpenChange, loan, onSuccess }: LoanDialogProps) {
  const [formData, setFormData] = useState({
    person_name: "",
    loan_amount: "",
    loan_date: new Date().toISOString().split("T")[0],
    amount_to_pay: "",
    due_date: "",
    status: "Aberto",
  });

  useEffect(() => {
    if (loan) {
      setFormData({
        person_name: loan.person_name,
        loan_amount: loan.loan_amount.toString(),
        loan_date: loan.loan_date,
        amount_to_pay: loan.amount_to_pay.toString(),
        due_date: loan.due_date,
        status: loan.status,
      });
    } else {
      setFormData({
        person_name: "",
        loan_amount: "",
        loan_date: new Date().toISOString().split("T")[0],
        amount_to_pay: "",
        due_date: "",
        status: "Aberto",
      });
    }
  }, [loan, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.person_name || !formData.loan_amount || !formData.amount_to_pay || !formData.due_date) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const loanData = {
        person_name: formData.person_name,
        loan_amount: parseFloat(formData.loan_amount),
        loan_date: formData.loan_date,
        amount_to_pay: parseFloat(formData.amount_to_pay),
        due_date: formData.due_date,
        status: formData.status,
      };

      if (loan) {
        const { error } = await supabase
          .from("loans")
          .update(loanData)
          .eq("id", loan.id);

        if (error) throw error;
        toast.success("Empréstimo atualizado com sucesso!");
      } else {
        const { error } = await supabase.from("loans").insert([loanData]);

        if (error) throw error;
        toast.success("Empréstimo adicionado com sucesso!");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar empréstimo:", error);
      toast.error("Erro ao salvar empréstimo");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{loan ? "Editar Empréstimo" : "Novo Empréstimo"}</DialogTitle>
          <DialogDescription>
            {loan ? "Atualize as informações do empréstimo" : "Adicione um novo empréstimo ao sistema"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="person_name">Nome da Pessoa *</Label>
              <Input
                id="person_name"
                value={formData.person_name}
                onChange={(e) => setFormData({ ...formData, person_name: e.target.value })}
                placeholder="Digite o nome completo"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="loan_amount">Valor Empréstimo *</Label>
                <Input
                  id="loan_amount"
                  type="number"
                  step="0.01"
                  value={formData.loan_amount}
                  onChange={(e) => setFormData({ ...formData, loan_amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="loan_date">Data Empréstimo *</Label>
                <Input
                  id="loan_date"
                  type="date"
                  value={formData.loan_date}
                  onChange={(e) => setFormData({ ...formData, loan_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount_to_pay">Valor a Pagar *</Label>
                <Input
                  id="amount_to_pay"
                  type="number"
                  step="0.01"
                  value={formData.amount_to_pay}
                  onChange={(e) => setFormData({ ...formData, amount_to_pay: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="due_date">Data Pagamento *</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aberto">Aberto</SelectItem>
                  <SelectItem value="Pago">Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{loan ? "Atualizar" : "Adicionar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
