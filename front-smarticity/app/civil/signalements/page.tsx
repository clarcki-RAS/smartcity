"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import { Calendar, Image as ImageIcon, MapPin, Plus, Search, Tag } from "lucide-react";

import SignalementForm from "@/components/ui/SignalementForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ApiSignalement, getMediaUrl, listSignalements } from "@/lib/api";
import {
  getSignalementMetadata,
  signalementPriorityBadge,
  signalementStatusDotColor,
  signalementStatusLabel,
} from "@/lib/signalements";

export default function CivilSignalementsPage() {
  const [signalements, setSignalements] = useState<ApiSignalement[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listSignalements()
      .then(setSignalements)
      .catch((err) => setError(err instanceof Error ? err.message : "Chargement impossible."))
      .finally(() => setIsLoading(false));
  }, []);

  const reports = useMemo(
    () =>
      signalements
        .map((signalement) => ({ ...signalement, ...getSignalementMetadata(signalement) }))
        .filter((report) => {
          const searchable = `${report.title} ${report.category} ${report.localisation || ""}`.toLowerCase();
          return searchable.includes(search.toLowerCase());
        }),
    [signalements, search]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Mes signalements</h1>
          <p className="text-sm text-slate-500 mt-1">Suivez les incidents que vous avez envoyés.</p>
        </div>
        <Button className="gap-2 self-start" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          Nouveau signalement
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          className="h-11 pl-9"
          placeholder="Rechercher par titre, catégorie ou localisation..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-start pt-20 z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mb-10">
            <SignalementForm
              onCreated={(signalement) => {
                setSignalements((current) => [signalement, ...current]);
                setShowForm(false);
              }}
            />
            <Button variant="outline" className="mt-4" onClick={() => setShowForm(false)}>
              Fermer
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-md">{error}</p>}
      {isLoading && <p className="text-sm text-slate-500">Chargement de vos signalements...</p>}
      {!isLoading && reports.length === 0 && <p className="text-sm text-slate-500">Aucun signalement trouvé.</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => {
          const image = getMediaUrl(report.uploaded_images?.[0]?.image_url);
          const priority = report.priority as keyof typeof signalementPriorityBadge;

          return (
            <Card key={report.id} className="overflow-hidden">
              <div className="grid min-h-44 grid-cols-1 sm:grid-cols-[180px_1fr]">
                <div className="h-40 bg-slate-100 sm:h-full">
                  {image ? (
                    <img src={image} alt={report.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <ImageIcon className="h-9 w-9" />
                    </div>
                  )}
                </div>

                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-semibold text-slate-900">{report.title}</h2>
                    <Badge className={signalementPriorityBadge[priority] || signalementPriorityBadge.Moyenne}>{report.priority}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      {report.category}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className={`h-2.5 w-2.5 rounded-full ${signalementStatusDotColor[report.status]}`} />
                      {signalementStatusLabel[report.status]}
                    </span>
                  </div>

                  {report.localisation && (
                    <p className="flex items-start gap-2 text-sm text-slate-500">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{report.localisation}</span>
                    </p>
                  )}

                  <p className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="h-4 w-4" />
                    {new Date(report.created_at).toLocaleString("fr-FR")}
                  </p>
                </CardContent>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
