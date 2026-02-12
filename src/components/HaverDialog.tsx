import { useState } from "react";
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
import { localDb, Loan } from "@/lib/localDb";
import { toast } from "sonner";

interface HaverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loan: Loan | null;
  onSuccess: () => void;
}

export function HaverDialog({ open, onOpenChange, loan, onSuccess }: HaverDialogProps) {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loan || !amount) return;

    const haverAmount = parseFloat(amount);
    if (isNaN(haverAmount) || haverAmount <= 0) {
      toast.error("Digite um valor válido");
      return;
    }

    if (haverAmount > loan.amount_to_pay) {
      toast.error("O valor do haver não pode ser maior que o valor a receber");
      return;
    }

    try {
      const newAmountToPay = loan.amount_to_pay - haverAmount;
      const newDueDate = new Date(loan.due_date + "T00:00:00");
      newDueDate.setMonth(newDueDate.getMonth() + 1);

      const isPaidOff = newAmountToPay <= 0;

      localDb.updateLoan(loan.id, {
        amount_to_pay: Math.max(newAmountToPay, 0),
        amount_received: loan.amount_received + haverAmount,
        due_date: newDueDate.toISOString().split("T")[0],
        ...(isPaidOff ? { status: "Pago" } : {}),
      });

      localDb.addTransaction({
        loan_id: loan.id,
        type: "haver",
        amount: haverAmount,
        description: `Haver de R$ ${haverAmount.toFixed(2)} - A receber agora: R$ ${newAmountToPay.toFixed(2)} - Vencimento: ${newDueDate.toLocaleDateString("pt-BR")}`,
      });

      toast.success(
        `Haver de R$ ${haverAmount.toFixed(2)} registrado! Novo valor a receber: R$ ${newAmountToPay.toFixed(2)}`
      );

      setAmount("");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Erro ao registrar haver:", error);
      toast.error("Erro ao registrar haver");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Registrar Haver</DialogTitle>
          <DialogDescription>
            {loan && (
              <>
                Devedor: <strong>{loan.person_name}</strong>
                <br />
                Valor a receber atual: <strong>R$ {loan.amount_to_pay.toFixed(2)}</strong>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="haver_amount">Valor do Haver (R$) *</Label>
              <Input
                id="haver_amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                autoFocus
              />
              {loan && amount && parseFloat(amount) > 0 && (
                <p className="text-sm text-muted-foreground">
                  Novo valor a receber: <strong>R$ {(loan.amount_to_pay - parseFloat(amount)).toFixed(2)}</strong>
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Confirmar Haver</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
