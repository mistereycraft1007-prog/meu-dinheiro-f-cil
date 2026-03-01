import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, Plus, CreditCard, Clock, Ban, Users, DollarSign, Percent, Edit, Trash2, CheckCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface HelpSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function HelpSection({ icon, title, description }: HelpSectionProps) {
  return (
    <div className="flex gap-3 py-3">
      <div className="mt-0.5 text-primary shrink-0">{icon}</div>
      <div>
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export function HelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2">
          <HelpCircle className="h-5 w-5" />
          Ajuda
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Como usar o sistema
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Empréstimos</h2>

            <HelpSection
              icon={<Plus className="h-4 w-4" />}
              title="Novo Empréstimo"
              description="Clique no botão 'Novo Empréstimo' para cadastrar um novo. Preencha o nome da pessoa, valor emprestado, valor a receber, data do empréstimo e data de vencimento."
            />

            <HelpSection
              icon={<Edit className="h-4 w-4" />}
              title="Editar Empréstimo"
              description="Clique no ícone de lápis na tabela para alterar os dados de um empréstimo existente, como valores, datas ou status."
            />

            <HelpSection
              icon={<Trash2 className="h-4 w-4" />}
              title="Excluir Empréstimo"
              description="Clique no ícone de lixeira para remover um empréstimo. Uma confirmação será solicitada antes da exclusão."
            />

            <HelpSection
              icon={<Percent className="h-4 w-4" />}
              title="Pagar Juros"
              description="Clique em 'Juros' para registrar o pagamento dos juros de um empréstimo. O vencimento será adiado em 1 mês automaticamente."
            />

            <HelpSection
              icon={<CreditCard className="h-4 w-4" />}
              title="Registrar Haver"
              description="Clique em 'Haver' para registrar um pagamento parcial. O valor recebido será somado ao total já recebido do empréstimo."
            />

            <HelpSection
              icon={<CheckCircle className="h-4 w-4" />}
              title="Marcar como Pago"
              description="Ao editar um empréstimo, mude o status para 'Pago' quando o valor total for quitado."
            />

            <Separator className="my-3" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Abas de Filtro</h2>

            <HelpSection
              icon={<DollarSign className="h-4 w-4" />}
              title="Todos / Em Aberto / Pagos / Atrasados"
              description="Use as abas para filtrar os empréstimos. 'Atrasados' mostra empréstimos com vencimento ultrapassado que ainda não foram pagos."
            />

            <Separator className="my-3" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Estatísticas</h2>

            <HelpSection
              icon={<Clock className="h-4 w-4" />}
              title="Cards de Resumo"
              description="No topo da página, os cards mostram: Total Emprestado, Total a Receber, A Receber (Abertos), Já Recebido, Lucro Total e % de Lucro sobre o capital investido."
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
