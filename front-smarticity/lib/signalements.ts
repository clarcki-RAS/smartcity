import { ApiSignalement } from "@/lib/api";

export const signalementStatusLabel = {
  PENDING: "En attente",
  IN_PROGRESS: "En cours",
  RESOLVED: "Résolu",
};

export const signalementStatusDotColor = {
  PENDING: "bg-slate-400",
  IN_PROGRESS: "bg-blue-500",
  RESOLVED: "bg-green-500",
};

export const signalementPriorityBadge = {
  Critique: "bg-red-100 text-red-700",
  Élevée: "bg-orange-100 text-orange-700",
  Moyenne: "bg-yellow-100 text-yellow-700",
  Faible: "bg-green-100 text-green-700",
};

function normalizeText(value: string) {
  return value
    .replaceAll("Ã©", "é")
    .replaceAll("Ã¨", "è")
    .replaceAll("Ã‰", "É")
    .replaceAll("Ãª", "ê")
    .replaceAll("Ã´", "ô")
    .replaceAll("Ã ", "à")
    .replaceAll("Â±", "±");
}

function normalizePriority(value: string) {
  const normalized = normalizeText(value);
  if (normalized.toLowerCase() === "élevée") return "Élevée";
  return normalized;
}

export function getSignalementMetadata(signalement: ApiSignalement) {
  const lines = normalizeText(signalement.description).split("\n");
  const read = (...labels: string[]) => {
    for (const label of labels) {
      const value = lines.find((line) => line.startsWith(`${label}:`))?.replace(`${label}:`, "").trim();
      if (value) return value;
    }
    return undefined;
  };

  return {
    title: read("Titre") || signalement.description.split("\n").find(Boolean) || `Signalement #${signalement.id}`,
    category: read("Catégorie", "CatÃ©gorie") || "Autre",
    priority: normalizePriority(read("Priorité", "PrioritÃ©") || "Moyenne"),
    details: lines.filter((line) => line && !line.startsWith("Titre:") && !line.startsWith("Catégorie:") && !line.startsWith("Priorité:")).join("\n"),
  };
}

export function extractGpsPosition(localisation?: string | null) {
  if (!localisation) return null;

  const match = localisation.match(/Position GPS:\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
  if (!match) return null;

  return {
    latitude: Number(match[1]),
    longitude: Number(match[2]),
  };
}

export function getVisualPosition(signalement: ApiSignalement) {
  const gps = extractGpsPosition(signalement.localisation);
  if (gps) {
    return {
      x: Math.min(92, Math.max(8, ((gps.longitude + 180) / 360) * 100)),
      y: Math.min(88, Math.max(12, ((90 - gps.latitude) / 180) * 100)),
      isGps: true,
    };
  }

  const seed = signalement.id * 37;
  return {
    x: 12 + (seed % 72),
    y: 18 + ((seed * 11) % 64),
    isGps: false,
  };
}
