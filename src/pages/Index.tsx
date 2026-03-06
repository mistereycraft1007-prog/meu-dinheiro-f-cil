import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, DollarSign, TrendingUp, Clock, CheckCircle, AlertTriangle, LogOut, Users, Settings, Search, History } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { LoansTable } from "@/components/LoansTable";
import { LoanDialog } from "@/components/LoanDialog";
import { HaverDialog } from "@/components/HaverDialog";
import { HelpDialog } from "@/components/HelpDialog";
import { TransactionsTab } from "@/components/TransactionsTab";
import { Logo } from "@/components/Logo";
import { cloudDb, Loan } from "@/lib/cloudDb";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [haverDialogOpen, setHaverDialogOpen] = useState(false);
  const [haverLoan, setHaverLoan] = useState<Loan | null>(null);

  useEffect(() => {
    fetchLoans();
    // Check admin role
    if (user) {
      supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle()
        .then(({ data }) => setIsAdmin(!!data));
    }
  }, [user]);

  const fetchLoans = useCallback(async () => {
    try {
      const data = await cloudDb.getLoans();
      setLoans(data);
    } catch (error) {
      console.error("Erro ao carregar empréstimos:", error);
      toast.error("Erro ao carregar empréstimos");
    }
  }, []);

  const overdueLoans = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return loans.filter((l) => {
      if (l.status === "Pago") return false;
      const dueDate = new Date(l.due_date + "T00:00:00");
      return dueDate < today;
    });
  }, [loans]);

  const searchedLoans = useMemo(() => {
    if (!searchQuery.trim()) return loans;
    const q = searchQuery.toLowerCase();
    return loans.filter((l) => l.person_name.toLowerCase().includes(q));
  }, [loans, searchQuery]);

  const filteredLoans = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const base = searchedLoans;
    switch (activeTab) {
      case "open":
        return base.filter((l) => l.status === "Aberto");
      case "paid":
        return base.filter((l) => l.status === "Pago");
      case "overdue":
        return base.filter((l) => {
          if (l.status === "Pago") return false;
          const dueDate = new Date(l.due_date + "T00:00:00");
          return dueDate < today;
        });
      default:
        return base;
    }
  }, [searchedLoans, activeTab]);

  const handleEdit = (loan: Loan) => {
    setSelectedLoan(loan);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedLoan(null);
    setDialogOpen(true);
  };

  const handlePayInterest = async (loan: Loan) => {
    try {
      const interestAmount = loan.amount_to_pay - loan.loan_amount;
      const newDueDate = new Date(loan.due_date + "T00:00:00");
      newDueDate.setMonth(newDueDate.getMonth() + 1);

      await cloudDb.updateLoan(loan.id, {
        due_date: newDueDate.toISOString().split("T")[0],
        amount_received: loan.amount_received + interestAmount,
      });

      await cloudDb.addTransaction({
        loan_id: loan.id,
        type: "juros",
        amount: interestAmount,
        description: `Juros pagos: R$ ${interestAmount.toFixed(2)} - Vencimento adiado para ${newDueDate.toLocaleDateString("pt-BR")}`,
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

  const handleHaver = (loan: Loan) => {
    setHaverLoan(loan);
    setHaverDialogOpen(true);
  };

  const stats = useMemo(() => {
    const totalLoaned = loans.reduce((sum, l) => sum + Number(l.loan_amount), 0);
    const totalToReceive = loans
      .filter((l) => l.status === "Aberto")
      .reduce((sum, l) => sum + Number(l.amount_to_pay), 0);
    const totalReceived = loans
      .filter((l) => l.status === "Pago")
      .reduce((sum, l) => sum + Number(l.amount_to_pay), 0) +
      loans
        .filter((l) => l.status === "Aberto")
        .reduce((sum, l) => sum + Number(l.amount_received), 0);
    const totalExpectedReturn = loans.reduce((sum, l) => sum + Number(l.amount_to_pay), 0);
    const totalProfit = totalExpectedReturn - totalLoaned;
    const profitPercentage = totalLoaned > 0 ? ((totalProfit / totalLoaned) * 100).toFixed(1) : "0.0";
    return { totalLoaned, totalToReceive, totalReceived, totalExpectedReturn, totalProfit, profitPercentage };
  }, [loans]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Logo size="md" showSlogan />
          <div className="flex gap-2">
            {isAdmin && (
              <Button onClick={() => navigate("/admin/clientes")} size="lg" variant="outline" className="gap-2">
                <Users className="h-5 w-5" />
                Clientes
              </Button>
            )}
            <Button onClick={handleAdd} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Novo Empréstimo
            </Button>
            <Button onClick={() => setActiveTab("history")} size="lg" variant="outline" className="gap-2">
              <History className="h-5 w-5" />
              Histórico
            </Button>
            <HelpDialog />
            <Button onClick={() => navigate("/configuracoes")} size="lg" variant="outline" className="gap-2">
              <Settings className="h-5 w-5" />
            </Button>
            <Button onClick={signOut} size="lg" variant="outline" className="gap-2">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <StatCard title="Total Emprestado" value={stats.totalLoaned.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} icon={DollarSign} variant="default" />
          <StatCard title="Total a Receber" value={stats.totalExpectedReturn.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} icon={TrendingUp} variant="warning" />
          <StatCard title="A Receber (Abertos)" value={stats.totalToReceive.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} icon={Clock} variant="warning" />
          <StatCard title="Já Recebido" value={stats.totalReceived.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} icon={CheckCircle} variant="success" />
          <StatCard title="Lucro Total" value={stats.totalProfit.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} icon={TrendingUp} variant="success" />
          <StatCard title="% Lucro" value={`${stats.profitPercentage}%`} icon={TrendingUp} variant="success" />
        </div>

        {/* Overdue Alert */}
        {overdueLoans.length > 0 && (
          <div className="bg-destructive/10 border-2 border-destructive/20 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">
                {overdueLoans.length} empréstimo{overdueLoans.length > 1 ? "s" : ""} atrasado{overdueLoans.length > 1 ? "s" : ""}!
              </p>
              <p className="text-sm text-muted-foreground mt-1">Clique na aba "Atrasados" para visualizar</p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Loans Table with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="all">Todos ({searchedLoans.length})</TabsTrigger>
            <TabsTrigger value="open">Em Aberto ({searchedLoans.filter((l) => l.status === "Aberto").length})</TabsTrigger>
            <TabsTrigger value="paid">Pagos ({searchedLoans.filter((l) => l.status === "Pago").length})</TabsTrigger>
            <TabsTrigger value="overdue">Atrasados ({overdueLoans.length})</TabsTrigger>
            <TabsTrigger value="history" className="gap-1">
              <History className="h-4 w-4" />
              Histórico
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <LoansTable loans={filteredLoans} onEdit={handleEdit} onDelete={fetchLoans} onPayInterest={handlePayInterest} onHaver={handleHaver} />
          </TabsContent>
          <TabsContent value="open" className="mt-4">
            <LoansTable loans={filteredLoans} onEdit={handleEdit} onDelete={fetchLoans} onPayInterest={handlePayInterest} onHaver={handleHaver} />
          </TabsContent>
          <TabsContent value="paid" className="mt-4">
            <LoansTable loans={filteredLoans} onEdit={handleEdit} onDelete={fetchLoans} onPayInterest={handlePayInterest} onHaver={handleHaver} />
          </TabsContent>
          <TabsContent value="overdue" className="mt-4">
            <LoansTable loans={filteredLoans} onEdit={handleEdit} onDelete={fetchLoans} onPayInterest={handlePayInterest} onHaver={handleHaver} />
          </TabsContent>
          <TabsContent value="history" className="mt-4">
            <TransactionsTab />
          </TabsContent>
        </Tabs>
      </div>

      <LoanDialog open={dialogOpen} onOpenChange={setDialogOpen} loan={selectedLoan} onSuccess={fetchLoans} />
      <HaverDialog open={haverDialogOpen} onOpenChange={setHaverDialogOpen} loan={haverLoan} onSuccess={fetchLoans} />
    </div>
  );
};

export default Index;
