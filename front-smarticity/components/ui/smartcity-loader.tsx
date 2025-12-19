import { Loader2 } from "lucide-react";

export function SmartCityLoader({
  label = "Chargement...",
}: {
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="text-sm text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
