"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { ApiSignalement, listSignalements } from "@/lib/api";

const ITEMS_PER_PAGE = 8;

const statusLabel = {
  PENDING: "En attente",
  IN_PROGRESS: "En cours",
  RESOLVED: "Résolu",
};

const statusDotColor = {
  PENDING: "bg-slate-400",
  IN_PROGRESS: "bg-blue-500",
  RESOLVED: "bg-green-500",
};

const priorityColor = {
  Critique: "bg-red-100 text-red-700 border-red-200",
  Élevée: "bg-orange-100 text-orange-700 border-orange-200",
  Moyenne: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Faible: "bg-green-100 text-green-700 border-green-200",
};

function getMetadata(signalement: ApiSignalement) {
  const lines = signalement.description.split("\n");
  const read = (label: string) => lines.find((line) => line.startsWith(`${label}:`))?.replace(`${label}:`, "").trim();

  return {
    title: read("Titre") || signalement.description.split("\n").find(Boolean) || `Signalement #${signalement.id}`,
    category: read("Catégorie") || "Autre",
    priority: read("Priorité") || "Moyenne",
  };
}

export function RecentReportsTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [signalements, setSignalements] = useState<ApiSignalement[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    listSignalements()
      .then(setSignalements)
      .catch((err) => setError(err instanceof Error ? err.message : "Chargement impossible."));
  }, []);

  const reports = useMemo(
    () =>
      signalements
        .map((signalement) => ({ ...signalement, ...getMetadata(signalement) }))
        .filter((report) => {
          const value = `${report.title} ${report.category} ${statusLabel[report.status]}`.toLowerCase();
          return value.includes(search.toLowerCase());
        }),
    [signalements, search]
  );

  const totalPages = Math.max(1, Math.ceil(reports.length / ITEMS_PER_PAGE));
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginatedReports = reports.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="bg-white rounded-xl border p-4">
      <h2 className="text-lg font-semibold mb-4">Signalements récents</h2>

      <div className="mb-4 flex gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Rechercher un signalement, une catégorie, un statut..."
            className="pl-9 h-11"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
        <Button variant="outline" size="sm" className="h-11 gap-2" onClick={() => setSearch("")}>
          <X className="h-4 w-4" />
          Réinitialiser
        </Button>
      </div>

      {error && <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-md">{error}</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Signalement</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Priorité</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedReports.map((report) => {
            const priority = report.priority as keyof typeof priorityColor;
            return (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.title}</TableCell>
                <TableCell>{report.category}</TableCell>
                <TableCell>
                  <Badge className={priorityColor[priority] || priorityColor.Moyenne}>{report.priority}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${statusDotColor[report.status]}`} />
                    <span className="text-slate-700">{statusLabel[report.status]}</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-500">{new Date(report.created_at).toLocaleString("fr-FR")}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-slate-500">
          Page {page} sur {totalPages}
        </span>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>
            Précédent
          </Button>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)}>
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
