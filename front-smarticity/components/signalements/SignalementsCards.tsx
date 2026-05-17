"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Calendar, Image as ImageIcon, MapPin, Tag } from "lucide-react";

import SignalementForm from "../ui/SignalementForm";
import { ApiSignalement, getMediaUrl, listSignalements } from "@/lib/api";
import {
  getSignalementMetadata,
  signalementPriorityBadge,
  signalementStatusDotColor,
  signalementStatusLabel,
} from "@/lib/signalements";

const ITEMS_PER_PAGE = 8;

const priorityBorder = {
  Critique: "border-red-500",
  Élevée: "border-orange-500",
  Moyenne: "border-yellow-400",
  Faible: "border-green-500",
};

export function SignalementsCards() {
  const searchParams = useSearchParams();
  const urgencyFilter = searchParams.get("urgence") === "1";
  const [signalements, setSignalements] = useState<ApiSignalement[]>([]);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadSignalements() {
      try {
        const data = await listSignalements();
        if (!ignore) setSignalements(data);
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : "Chargement impossible.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadSignalements();
    return () => {
      ignore = true;
    };
  }, []);

  const enrichedReports = useMemo(
    () =>
      signalements.map((signalement) => ({
        ...signalement,
        ...getSignalementMetadata(signalement),
      })),
    [signalements]
  );

  const categories = Array.from(new Set(enrichedReports.map((report) => report.category)));

  const filteredReports = enrichedReports.filter((report) => {
    return (
      (categoryFilter === "all" || report.category === categoryFilter) &&
      (statusFilter === "all" || report.status === statusFilter) &&
      (priorityFilter === "all" || report.priority === priorityFilter) &&
      (!urgencyFilter || report.priority === "Critique" || report.priority === "Élevée") &&
      report.title.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / ITEMS_PER_PAGE));
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginatedReports = filteredReports.slice(start, start + ITEMS_PER_PAGE);

  const handleCreated = (signalement: ApiSignalement) => {
    setSignalements((current) => [signalement, ...current]);
    setShowForm(false);
  };

  return (
    <>
      <div className="flex items-center gap-3 flex-grow">
        <input
          type="text"
          placeholder="Rechercher un signalement..."
          value={searchText}
          onChange={(event) => {
            setSearchText(event.target.value);
            setPage(1);
          }}
          className="border rounded-md px-3 py-2 text-sm flex-grow"
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <select className="border rounded-md px-3 py-2 text-sm" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="all">Toutes catégories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select className="border rounded-md px-3 py-2 text-sm" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">Tous statuts</option>
            <option value="PENDING">En attente</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="RESOLVED">Résolu</option>
          </select>

          <select className="border rounded-md px-3 py-2 text-sm" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
            <option value="all">Toutes priorités</option>
            <option value="Critique">Critique</option>
            <option value="Élevée">Élevée</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Faible">Faible</option>
          </select>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700 self-start md:self-auto" onClick={() => setShowForm(true)}>
          + Ajouter un signalement
        </Button>
      </div>

      {urgencyFilter && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 p-3 rounded-md">
          Filtre urgences actif: signalements critiques et élevés.
        </p>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-start pt-20 z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mb-10">
            <SignalementForm onCreated={handleCreated} />
            <Button variant="outline" className="mt-4" onClick={() => setShowForm(false)}>
              Fermer
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-md">{error}</p>}
      {isLoading && <p className="text-sm text-slate-500">Chargement des signalements...</p>}
      {!isLoading && paginatedReports.length === 0 && <p className="text-sm text-slate-500">Aucun signalement trouvé.</p>}

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {paginatedReports.map((report) => {
          const image = getMediaUrl(report.uploaded_images?.[0]?.image_url);
          const priority = report.priority as keyof typeof priorityBorder;

          return (
            <Card
              key={report.id}
              className={`group overflow-hidden border-l-4 ${priorityBorder[priority] || "border-yellow-400"} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
            >
              <div className="relative h-36 bg-slate-100">
                {image ? (
                  <img src={image} alt={report.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-400">
                    <ImageIcon className="h-10 w-10" />
                  </div>
                )}
              </div>

              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-base line-clamp-2">{report.title}</h3>
                  <AlertTriangle className="h-4 w-4 text-slate-400" />
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Tag className="h-4 w-4" />
                  {report.category}
                </div>

                <Badge className={signalementPriorityBadge[priority] || signalementPriorityBadge.Moyenne}>{report.priority}</Badge>

                <div className="flex items-center gap-2 text-sm">
                  <span className={`h-2.5 w-2.5 rounded-full ${signalementStatusDotColor[report.status]}`} />
                  <span>{signalementStatusLabel[report.status]}</span>
                </div>

                {report.localisation && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="h-4 w-4" />
                    {report.localisation}
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="h-4 w-4" />
                  {new Date(report.created_at).toLocaleString("fr-FR")}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-6">
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
    </>
  );
}
