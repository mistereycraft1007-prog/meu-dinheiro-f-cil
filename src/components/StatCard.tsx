import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "destructive";
}

export function StatCard({ title, value, icon: Icon, variant = "default" }: StatCardProps) {
  const variantClasses = {
    default: "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20",
    success: "bg-gradient-to-br from-success/10 to-success/5 border-success/20",
    warning: "bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20",
    destructive: "bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20",
  };

  const iconClasses = {
    default: "text-primary",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
  };

  return (
    <Card className={`${variantClasses[variant]} border-2 transition-all hover:shadow-elevated`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${iconClasses[variant]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-lg sm:text-xl md:text-2xl font-bold whitespace-nowrap overflow-hidden text-ellipsis">{value}</div>
      </CardContent>
    </Card>
  );
}
