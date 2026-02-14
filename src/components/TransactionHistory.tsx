import { Transaction } from "@/lib/cloudDb";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DollarSign, Calendar, PlusCircle, Pencil, CreditCard } from "lucide-react";

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const typeConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  criacao: { label: "Criação", color: "bg-primary text-primary-foreground", icon: PlusCircle },
  haver: { label: "Haver", color: "bg-warning text-warning-foreground", icon: DollarSign },
  juros: { label: "Pagou Juros", color: "bg-accent text-accent-foreground", icon: Calendar },
  pagamento_total: { label: "Pagou Tudo", color: "bg-success text-success-foreground", icon: CreditCard },
  edicao: { label: "Edição", color: "bg-secondary text-secondary-foreground", icon: Pencil },
};

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  if (transactions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        Nenhuma transação registrada
      </p>
    );
  }

  return (
    <ScrollArea className="h-[200px] pr-3">
      <div className="space-y-3">
        {transactions.map((t) => {
          const config = typeConfig[t.type] || typeConfig.edicao;
          const Icon = config.icon;
          return (
            <div key={t.id} className="flex items-start gap-3 p-2 rounded-md border bg-card">
              <div className={`p-1.5 rounded-md ${config.color}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {config.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(t.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 truncate">{t.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
