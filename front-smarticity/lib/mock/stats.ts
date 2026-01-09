import { reports } from "./reports";

const totalATraiter = reports.filter(r => r.status === "En attente").length;
const totalEnCours = reports.filter(r => r.status === "En cours").length;
const totalResolus = reports.filter(r => r.status === "Résolu").length;
const totalCritiques = reports.filter(r => r.priority === "Critique").length;

export const stats = [
  { label: "Total à traiter", value: totalATraiter, delta: "+1 aujourd’hui", color: "blue" },
  { label: "Critiques", value: totalCritiques, delta: "+0 aujourd’hui", color: "red" },
  { label: "En cours", value: totalEnCours, delta: "+2 aujourd’hui", color: "orange" },
  { label: "Résolus", value: totalResolus, delta: "+1 aujourd’hui", color: "green" },
];
