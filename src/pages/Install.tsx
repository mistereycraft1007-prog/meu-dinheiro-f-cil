import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { Download, Smartphone, Monitor, CheckCircle } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <CardTitle className="text-2xl">Instalar App</CardTitle>
          <CardDescription>
            Instale o Meu Dinheiro Fácil no seu dispositivo para acesso rápido
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isInstalled ? (
            <div className="text-center space-y-3">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <p className="text-lg font-semibold text-foreground">App já instalado!</p>
              <p className="text-muted-foreground">Procure o ícone na sua tela inicial.</p>
            </div>
          ) : deferredPrompt ? (
            <Button onClick={handleInstall} size="lg" className="w-full gap-2">
              <Download className="h-5 w-5" />
              Instalar agora
            </Button>
          ) : isIOS ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground font-medium">No iPhone/iPad:</p>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-bold text-foreground">1.</span>
                  Toque no botão <strong>Compartilhar</strong> (ícone de quadrado com seta)
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-foreground">2.</span>
                  Role e toque em <strong>"Adicionar à Tela de Início"</strong>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-foreground">3.</span>
                  Toque em <strong>"Adicionar"</strong>
                </li>
              </ol>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground font-medium">No Android:</p>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-bold text-foreground">1.</span>
                  Toque no menu <strong>⋮</strong> do navegador (3 pontos)
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-foreground">2.</span>
                  Toque em <strong>"Instalar app"</strong> ou <strong>"Adicionar à tela inicial"</strong>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-foreground">3.</span>
                  Confirme tocando em <strong>"Instalar"</strong>
                </li>
              </ol>
            </div>
          )}

          <div className="flex justify-center gap-6 pt-4 border-t">
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <Smartphone className="h-5 w-5" />
              <span className="text-xs">Celular</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <Monitor className="h-5 w-5" />
              <span className="text-xs">Desktop</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
