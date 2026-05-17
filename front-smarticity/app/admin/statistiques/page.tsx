"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ListTodo, Loader2 } from "lucide-react";
import {
  Bar,
  BarChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiSignalement, listSignalements } from "@/lib/api";
import { getSignalementMetadata, signalementStatusLabel } from "@/lib/signalements";

const statCards = [
  { label: "Total", key: "total", icon: ListTodo, className: "text-blue-600 bg-blue-100" },
  { label: "Critiques", key: "critiques", icon: AlertTriangle, className: "text-red-600 bg-red-100" },
  { label: "En cours", key: "enCours", icon: Loader2, className: "text-orange-600 bg-orange-100" },
  { label: "Résolus", key: "resolus", icon: CheckCircle2, className: "text-green-600 bg-green-100" },
];

function isSameDay(date: Date, other: Date) {
  return date.getFullYear() === other.getFullYear() && date.getMonth() === other.getMonth() && date.getDate() === other.getDate();
}

function formatDay(date: Date) {
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

export default function StatsPage() {
  const [signalements, setSignalements] = useState<ApiSignalement[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listSignalements()
      .then(setSignalements)
      .catch((err) => setError(err instanceof Error ? err.message : "Chargement impossible."))
      .finally(() => setIsLoading(false));
  }, []);

  const enriched = useMemo(
    () => signalements.map((signalement) => ({ ...signalement, ...getSignalementMetadata(signalement) })),
    [signalements]
  );

  const today = useMemo(() => new Date(), []);

  const counts = useMemo(
    () => ({
      total: enriched.length,
      critiques: enriched.filter((item) => item.priority === "Critique").length,
      enCours: enriched.filter((item) => item.status === "IN_PROGRESS").length,
      resolus: enriched.filter((item) => item.status === "RESOLVED").length,
    }),
    [enriched]
  );

  const todayCounts = useMemo(
    () => ({
      total: enriched.filter((item) => isSameDay(new Date(item.created_at), today)).length,
      critiques: enriched.filter((item) => item.priority === "Critique" && isSameDay(new Date(item.created_at), today)).length,
      enCours: enriched.filter((item) => item.status === "IN_PROGRESS" && isSameDay(new Date(item.created_at), today)).length,
      resolus: enriched.filter((item) => item.status === "RESOLVED" && isSameDay(new Date(item.created_at), today)).length,
    }),
    [enriched, today]
  );

  const trendData = useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() - (6 - index));
      const reports = enriched.filter((item) => isSameDay(new Date(item.created_at), day));

      return {
        day: formatDay(day),
        total: reports.length,
        critiques: reports.filter((item) => item.priority === "Critique").length,
        enCours: reports.filter((item) => item.status === "IN_PROGRESS").length,
        resolus: reports.filter((item) => item.status === "RESOLVED").length,
      };
    });
  }, [enriched, today]);

  const categories = useMemo(() => {
    const grouped = enriched.reduce<Record<string, { category: string; count: number }>>((acc, item) => {
      acc[item.category] ||= { category: item.category, count: 0 };
      acc[item.category].count += 1;
      return acc;
    }, {});
    return Object.values(grouped);
  }, [enriched]);

  const statusData = useMemo(
    () =>
      Object.entries(signalementStatusLabel).map(([status, label]) => ({
        status: label,
        count: enriched.filter((item) => item.status === status).length,
      })),
    [enriched]
  );

  return (
    <div className="space-y-6 pl-64">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Statistiques SmartCity</h1>
        <p className="text-sm text-slate-500">Aperçu des signalements et performances du système depuis l&apos;API.</p>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-md">{error}</p>}
      {isLoading && <p className="text-sm text-slate-500">Chargement des statistiques...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${item.className}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">{item.label}</p>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <span className="text-2xl font-bold text-slate-800">{counts[item.key as keyof typeof counts]}</span>
                  <span className="text-xs text-slate-500">+{todayCounts[item.key as keyof typeof todayCounts]} aujourd&apos;hui</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border">
        <CardHeader>
          <CardTitle>Évolution des signalements (7 derniers jours)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" name="Total" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="critiques" name="Critiques" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="enCours" name="En cours" stroke="#f97316" strokeWidth={2} />
                <Line type="monotone" dataKey="resolus" name="Résolus" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border">
          <CardHeader>
            <CardTitle>Signalements par catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categories}>
                  <XAxis dataKey="category" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" name="Signalements" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader>
            <CardTitle>État des signalements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <XAxis dataKey="status" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" name="Signalements" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
