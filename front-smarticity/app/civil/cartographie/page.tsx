"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { LocateFixed, MapPinned } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { ApiSignalement, listSignalements } from "@/lib/api";
import { extractGpsPosition, getSignalementMetadata } from "@/lib/signalements";

const IncidentsMap = dynamic(() => import("@/components/civil/IncidentsMap").then((mod) => mod.IncidentsMap), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-sm text-slate-500">Chargement de la carte...</div>,
});

export default function CivilCartographiePage() {
  const [signalements, setSignalements] = useState<ApiSignalement[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listSignalements()
      .then(setSignalements)
      .catch((err) => setError(err instanceof Error ? err.message : "Chargement impossible."))
      .finally(() => setIsLoading(false));
  }, []);

  const incidents = useMemo(
    () => signalements.map((signalement) => ({ ...signalement, ...getSignalementMetadata(signalement) })),
    [signalements]
  );

  const gpsCount = incidents.filter((incident) => extractGpsPosition(incident.localisation)).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Cartographie des incidents</h1>
          <p className="text-sm text-slate-500 mt-1">Carte centrée sur Fianarantsoa. Zoomez, déplacez la carte, puis cliquez sur un point.</p>
        </div>

        <Card className="w-full md:w-auto">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-100 text-blue-700">
              <LocateFixed className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">{incidents.length} incident(s)</p>
              <p className="text-xs text-slate-500">{gpsCount} avec GPS précis</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-md">{error}</p>}
      {isLoading && <p className="text-sm text-slate-500">Chargement des incidents...</p>}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="h-[calc(100vh-190px)] min-h-[680px] overflow-hidden rounded-lg border bg-white shadow-sm">
          {!isLoading && incidents.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">Aucun signalement à afficher.</div>
          ) : (
            <IncidentsMap incidents={incidents} />
          )}
        </div>

        <aside className="space-y-4">
          <Card>
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center gap-2">
                <MapPinned className="h-5 w-5 text-slate-700" />
                <h2 className="font-semibold text-slate-900">Légende</h2>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="h-4 w-4 rounded-full bg-red-600" />
                  <span>Critique</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-4 w-4 rounded-full bg-orange-600" />
                  <span>Élevée</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-4 w-4 rounded-full bg-yellow-600" />
                  <span>Moyenne</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-4 w-4 rounded-full bg-green-600" />
                  <span>Faible</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <span className="h-4 w-4 rounded-full border-2 border-slate-900 bg-slate-100" />
                  <span>Coordonnées GPS précises</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-4 w-4 rounded-full border-2 border-slate-500 bg-slate-100" />
                  <span>Position estimée dans Fianarantsoa</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-2 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-900">Positionnement</p>
              <p>Les signalements sans GPS sont maintenant estimés autour de Fianarantsoa.</p>
              <p>Pour une position exacte, il faut utiliser la détection GPS ou ajouter une conversion adresse → coordonnées côté backend.</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
