"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, ListTodo, Loader2 } from "lucide-react";
import { ApiSignalement, listSignalements } from "@/lib/api";

const cards = [
  { label: "Total", status: "ALL", icon: ListTodo, className: "text-blue-600 bg-blue-100" },
  { label: "En attente", status: "PENDING", icon: AlertTriangle, className: "text-red-600 bg-red-100" },
  { label: "En cours", status: "IN_PROGRESS", icon: Loader2, className: "text-orange-600 bg-orange-100" },
  { label: "Résolus", status: "RESOLVED", icon: CheckCircle2, className: "text-green-600 bg-green-100" },
];

export function StatsCards() {
  const [signalements, setSignalements] = useState<ApiSignalement[]>([]);

  useEffect(() => {
    listSignalements()
      .then(setSignalements)
      .catch(() => setSignalements([]));
  }, []);

  const counts = useMemo(
    () => ({
      ALL: signalements.length,
      PENDING: signalements.filter((item) => item.status === "PENDING").length,
      IN_PROGRESS: signalements.filter((item) => item.status === "IN_PROGRESS").length,
      RESOLVED: signalements.filter((item) => item.status === "RESOLVED").length,
    }),
    [signalements]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${card.className}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-slate-600">{card.label}</p>
              </div>

              <div className="flex items-end justify-between mt-4">
                <span className="text-2xl font-bold text-slate-800">{counts[card.status as keyof typeof counts]}</span>
                <span className="text-xs text-slate-500">Données API</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
