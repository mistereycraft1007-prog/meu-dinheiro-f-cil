import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || "");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingName, setLoadingName] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingName(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName },
      });
      if (error) throw error;

      // Also update profiles table
      if (user) {
        await supabase
          .from("profiles")
          .update({ display_name: displayName })
          .eq("user_id", user.id);
      }

      toast.success("Nome atualizado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar nome");
    } finally {
      setLoadingName(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      toast.success("Email de confirmação enviado para o novo endereço!");
      setNewEmail("");
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar email");
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setLoadingPassword(true);
    try {
      // Re-authenticate with current password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword,
      });
      if (signInError) {
        toast.error("Senha atual incorreta");
        setLoadingPassword(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Erro ao alterar senha");
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6 max-w-2xl">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate("/")} variant="outline" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Logo size="md" />
          <h2 className="text-2xl font-bold text-foreground">Configurações</h2>
        </div>

        {/* Name */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alterar nome</CardTitle>
            <CardDescription>Como você aparece no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateName} className="flex gap-3">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Seu nome"
                required
                className="flex-1"
              />
              <Button type="submit" disabled={loadingName} className="gap-2">
                <Save className="h-4 w-4" />
                {loadingName ? "Salvando..." : "Salvar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Email */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alterar email</CardTitle>
            <CardDescription>Email atual: {user?.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateEmail} className="flex gap-3">
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="novo@email.com"
                required
                className="flex-1"
              />
              <Button type="submit" disabled={loadingEmail} className="gap-2">
                <Save className="h-4 w-4" />
                {loadingEmail ? "Enviando..." : "Alterar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alterar senha</CardTitle>
            <CardDescription>Use uma senha segura com no mínimo 6 caracteres</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha atual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Sua senha atual"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirmar nova senha</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" disabled={loadingPassword} className="w-full gap-2">
                <Save className="h-4 w-4" />
                {loadingPassword ? "Salvando..." : "Alterar senha"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
