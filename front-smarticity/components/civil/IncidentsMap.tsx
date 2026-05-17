"use client";

import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { ApiSignalement } from "@/lib/api";
import {
  extractGpsPosition,
  getSignalementMetadata,
  signalementPriorityBadge,
  signalementStatusLabel,
} from "@/lib/signalements";
import { Badge } from "@/components/ui/badge";

const FIANARANTSOA_CENTER: [number, number] = [-21.4527, 47.0857];

type Incident = ApiSignalement & ReturnType<typeof getSignalementMetadata>;

function getMarkerPosition(incident: Incident, index: number): { position: [number, number]; isGps: boolean } {
  const gps = extractGpsPosition(incident.localisation);
  if (gps) {
    return { position: [gps.latitude, gps.longitude], isGps: true };
  }

  const ring = 0.006 + (index % 5) * 0.004;
  const angle = ((index * 137.5) % 360) * (Math.PI / 180);
  return {
    position: [FIANARANTSOA_CENTER[0] + Math.sin(angle) * ring, FIANARANTSOA_CENTER[1] + Math.cos(angle) * ring],
    isGps: false,
  };
}

function markerColor(priority: string) {
  if (priority === "Critique") return "#dc2626";
  if (priority === "Élevée") return "#ea580c";
  if (priority === "Faible") return "#16a34a";
  return "#ca8a04";
}

export function IncidentsMap({ incidents }: { incidents: Incident[] }) {
  const gpsIncidents = incidents
    .map((incident, index) => ({ incident, ...getMarkerPosition(incident, index) }))
    .filter((item) => item.isGps);

  const center = gpsIncidents[0]?.position || FIANARANTSOA_CENTER;

  return (
    <MapContainer center={center} zoom={14} minZoom={3} maxZoom={19} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {incidents.map((incident, index) => {
        const { position, isGps } = getMarkerPosition(incident, index);
        const color = markerColor(incident.priority);

        return (
          <CircleMarker
            key={incident.id}
            center={position}
            radius={isGps ? 10 : 8}
            pathOptions={{
              color: isGps ? "#0f172a" : "#64748b",
              fillColor: color,
              fillOpacity: 0.88,
              weight: isGps ? 3 : 2,
            }}
          >
            <Popup>
              <div className="w-64 space-y-3">
                <div>
                  <p className="font-semibold text-slate-900">{incident.title}</p>
                  <p className="text-xs text-slate-500">{incident.category}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className={signalementPriorityBadge[incident.priority as keyof typeof signalementPriorityBadge] || signalementPriorityBadge.Moyenne}>
                    {incident.priority}
                  </Badge>
                  <Badge variant="outline">{signalementStatusLabel[incident.status]}</Badge>
                  <Badge variant="outline">{isGps ? "GPS précis" : "Position estimée"}</Badge>
                </div>

                {incident.localisation && <p className="text-xs text-slate-600">{incident.localisation}</p>}
                <p className="text-[11px] text-slate-500">{new Date(incident.created_at).toLocaleString("fr-FR")}</p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
