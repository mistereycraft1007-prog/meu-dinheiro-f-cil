import { Input } from "@/components/ui/input";

interface CurrencyInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CurrencyInput({ id, value, onChange, placeholder = "0,00" }: CurrencyInputProps) {
  const formatCurrency = (raw: string): string => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    const cents = parseInt(digits, 10);
    return (cents / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    onChange(formatted);
  };

  return (
    <Input
      id={id}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      inputMode="numeric"
    />
  );
}

export function parseCurrencyValue(formatted: string): number {
  if (!formatted) return 0;
  const cleaned = formatted.replace(/\./g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}
