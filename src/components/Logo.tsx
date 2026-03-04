import logoImg from "@/assets/logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showSlogan?: boolean;
}

export function Logo({ size = "md", showSlogan = false }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const textClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className="flex items-center gap-3">
      <img src={logoImg} alt="Meu Dinheiro Fácil" className={`${sizeClasses[size]} rounded-xl`} />
      <div>
        <h1 className={`${textClasses[size]} font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent`}>
          Meu Dinheiro Fácil
        </h1>
        {showSlogan && (
          <p className="text-xs text-muted-foreground font-medium tracking-wide">
            Seu dinheiro, seu controle.
          </p>
        )}
      </div>
    </div>
  );
}
