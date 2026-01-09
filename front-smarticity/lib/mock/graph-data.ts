import { reports } from "./reports";

export const categories = Object.values(
  reports.reduce((acc, r) => {
    if (!acc[r.category]) acc[r.category] = { category: r.category, count: 0 };
    acc[r.category].count += 1;
    return acc;
  }, {} as Record<string, { category: string; count: number }>)
);

export const statusData = [
  { status: "À traiter", count: reports.filter(r => r.status === "En attente").length },
  { status: "Critiques", count: reports.filter(r => r.priority === "Critique").length },
  { status: "En cours", count: reports.filter(r => r.status === "En cours").length },
  { status: "Résolus", count: reports.filter(r => r.status === "Résolu").length },
];
