import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function AdminHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
           Bonjour Antso ,
        </h1>
        <p className="text-slate-500">
          <span className="font-semibold text-red-400">
            5 signalements critiques
          </span>{" "}
          nécessitent votre attention aujourd’hui.
        </p>
      </div>

      <Button variant="destructive" className="gap-2">
        <AlertTriangle className="h-4 w-4" />
        Voir les urgences
      </Button>
    </div>
  );
}
