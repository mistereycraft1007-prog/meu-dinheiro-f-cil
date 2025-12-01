import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, DollarSign, TrendingUp, Clock, CheckCircle, AlertTriangle, Upload, Trash2 } from "lucide-react";
import { importExcelData, clearAllData } from "@/lib/seedData";
import { StatCard } from "@/components/StatCard";
import { LoansTable } from "@/components/LoansTable";
import { LoanDialog } from "@/components/LoanDialog";
import { localDb, Loan } from "@/lib/localDb";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Index = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    filterLoans();
  }, [loans, activeTab]);

  const fetchLoans = () => {
    try {
      const data = localDb.getLoans();
      setLoans(data);
    } catch (error) {
      console.error("Erro ao carregar empréstimos:", error);
      toast.error("Erro ao carregar empréstimos");
    }
  };

  const filterLoans = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (activeTab) {
      case "open":
        setFilteredLoans(loans.filter((l) => l.status === "Aberto"));
        break;
      case "paid":
        setFilteredLoans(loans.filter((l) => l.status === "Pago"));
        break;
      case "overdue":
        setFilteredLoans(
          loans.filter((l) => {
            const dueDate = new Date(l.due_date + "T00:00:00");
            return l.status === "Aberto" && dueDate < today;
          })
        );
        break;
      default:
        setFilteredLoans(loans);
    }
  };

  const handleEdit = (loan: Loan) => {
    setSelectedLoan(loan);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedLoan(null);
    setDialogOpen(true);
  };

  const handleImportExcel = () => {
    const imported = importExcelData();
    if (imported) {
      toast.success(`${imported} empréstimos importados com sucesso!`);
      fetchLoans();
    }
  };

  const handleClearAll = () => {
    const cleared = clearAllData();
    if (cleared) {
      toast.success("Todos os dados foram apagados!");
      fetchLoans();
    }
  };

  const handlePayInterest = (loan: Loan) => {
    try {
      // Calcular diferença entre valor a receber e valor emprestado
      const interestAmount = loan.amount_to_pay - loan.loan_amount;

      // Adicionar 1 mês à data de vencimento
      const newDueDate = new Date(loan.due_date + "T00:00:00");
      newDueDate.setMonth(newDueDate.getMonth() + 1);

      localDb.updateLoan(loan.id, {
        due_date: newDueDate.toISOString().split("T")[0],
        amount_received: loan.amount_received + interestAmount,
      });

      toast.success(
        `Juros de ${interestAmount.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })} pagos! Vencimento adiado para ${newDueDate.toLocaleDateString("pt-BR")}`
      );

      fetchLoans();
    } catch (error) {
      console.error("Erro ao pagar juros:", error);
      toast.error("Erro ao processar pagamento de juros");
    }
  };

  // Calcular estatísticas
  const totalLoaned = loans.reduce((sum, l) => sum + l.loan_amount, 0);
  const totalToReceive = loans
    .filter((l) => l.status === "Aberto")
    .reduce((sum, l) => sum + l.amount_to_pay, 0);
  const totalReceived = loans
    .filter((l) => l.status === "Pago")
    .reduce((sum, l) => sum + l.amount_to_pay, 0) +
    loans
      .filter((l) => l.status === "Aberto")
      .reduce((sum, l) => sum + l.amount_received, 0);
  const totalProfit = totalReceived - loans.filter((l) => l.status === "Pago").reduce((sum, l) => sum + l.loan_amount, 0);
  const profitPercentage = totalLoaned > 0 ? ((totalProfit / totalLoaned) * 100).toFixed(1) : "0.0";

  const overdueLoans = loans.filter((l) => {
    if (l.status === "Pago") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(l.due_date + "T00:00:00");
    return dueDate < today;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Sistema de Empréstimos
            </h1>
            <p className="text-muted-foreground mt-1">Gerencie seus empréstimos de forma simples e eficiente</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleImportExcel} size="lg" variant="outline" className="gap-2">
              <Upload className="h-5 w-5" />
              Importar Planilha
            </Button>
            <Button onClick={handleAdd} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Novo Empréstimo
            </Button>
            <Button onClick={handleClearAll} size="lg" variant="destructive" className="gap-2">
              <Trash2 className="h-5 w-5" />
              Limpar Tudo
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Total Emprestado"
            value={totalLoaned.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
            icon={DollarSign}
            variant="default"
          />
          <StatCard
            title="A Receber"
            value={totalToReceive.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Já Recebido"
            value={totalReceived.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
            icon={CheckCircle}
            variant="success"
          />
          <StatCard
            title="Lucro Total"
            value={totalProfit.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
            icon={TrendingUp}
            variant="success"
          />
          <StatCard
            title="% Lucro"
            value={`${profitPercentage}%`}
            icon={TrendingUp}
            variant="success"
          />
        </div>

        {/* Overdue Alert */}
        {overdueLoans.length > 0 && (
          <div className="bg-destructive/10 border-2 border-destructive/20 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">
                {overdueLoans.length} empréstimo{overdueLoans.length > 1 ? "s" : ""} atrasado{overdueLoans.length > 1 ? "s" : ""}!
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Clique na aba "Atrasados" para visualizar
              </p>
            </div>
          </div>
        )}

        {/* Loans Table with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="all">Todos ({loans.length})</TabsTrigger>
            <TabsTrigger value="open">Em Aberto ({loans.filter((l) => l.status === "Aberto").length})</TabsTrigger>
            <TabsTrigger value="paid">Pagos ({loans.filter((l) => l.status === "Pago").length})</TabsTrigger>
            <TabsTrigger value="overdue">Atrasados ({overdueLoans.length})</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-4">
            <LoansTable
              loans={filteredLoans}
              onEdit={handleEdit}
              onDelete={fetchLoans}
              onPayInterest={handlePayInterest}
            />
          </TabsContent>
        </Tabs>
      </div>

      <LoanDialog open={dialogOpen} onOpenChange={setDialogOpen} loan={selectedLoan} onSuccess={fetchLoans} />
    </div>
  );
};

export default Index;
