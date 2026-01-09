/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  AlertTriangle,
  Check,
  Trash2,
  Calendar,
  Tag,
  Image as ImageIcon,
} from "lucide-react";

import { reports } from "@/lib/mock/reports";
import Link from "next/link";
import SignalementForm from "../ui/SignalementForm";

const ITEMS_PER_PAGE = 8;

const priorityBorder = {
  Critique: "border-red-500",
  Élevée: "border-orange-500",
  Moyenne: "border-yellow-400",
  Faible: "border-green-500",
};

const priorityBadge = {
  Critique: "bg-red-100 text-red-700",
  Élevée: "bg-orange-100 text-orange-700",
  Moyenne: "bg-yellow-100 text-yellow-700",
  Faible: "bg-green-100 text-green-700",
};

const statusDotColor = {
  "En attente": "bg-slate-400",
  "En cours": "bg-blue-500",
  Résolu: "bg-green-500",
};

export function SignalementsCards() {
    const [searchText, setSearchText] = useState("");


    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");

    const filteredReports = reports.filter((r) => {
    return (
        (categoryFilter === "all" || r.category === categoryFilter) &&
        (statusFilter === "all" || r.status === statusFilter) &&
        (priorityFilter === "all" || r.priority === priorityFilter) &&
        r.title.toLowerCase().includes(searchText.toLowerCase())
    );
    });

  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);


  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedReports = filteredReports.slice(start, end);


  return (
    
    <>
    {/* HEADER ACTIONS */}
    {/* RECHERCHE */}
<div className="flex items-center gap-3 flex-grow">
  <input
    type="text"
    placeholder="Rechercher un signalement..."
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
    className="border rounded-md px-3 py-2 text-sm flex-grow"
  />
</div>

<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
  {/* FILTRES */}
  <div className="flex flex-wrap gap-3">
    {/* Catégorie */}
    <select
      className="border rounded-md px-3 py-2 text-sm"
      value={categoryFilter}
      onChange={(e) => setCategoryFilter(e.target.value)}
    >
      <option value="all">Toutes catégories</option>
      <option value="Voirie">Voirie</option>
      <option value="Éclairage public">Éclairage public</option>
      <option value="Déchets">Déchets</option>
      <option value="Sécurité">Sécurité</option>
    </select>

    {/* Statut */}
    <select
      className="border rounded-md px-3 py-2 text-sm"
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="all">Tous statuts</option>
      <option value="En attente">En attente</option>
      <option value="En cours">En cours</option>
      <option value="Résolu">Résolu</option>
    </select>

    {/* Priorité */}
    <select
      className="border rounded-md px-3 py-2 text-sm"
      value={priorityFilter}
      onChange={(e) => setPriorityFilter(e.target.value)}
    >
      <option value="all">Toutes priorités</option>
      <option value="Critique">Critique</option>
      <option value="Élevée">Élevée</option>
      <option value="Moyenne">Moyenne</option>
      <option value="Faible">Faible</option>
    </select>
  </div>

  {/* ADD BUTTON */}
<Button
  className="bg-blue-600 hover:bg-blue-700 self-start md:self-auto"
  onClick={() => setShowForm(true)}
>
  + Ajouter un signalement
</Button>


{showForm && (
  <div className="fixed inset-0 bg-black/30 flex justify-center items-start pt-20 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
      <SignalementForm />
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => setShowForm(false)}
      >
        Fermer
      </Button>
    </div>
  </div>
)}

</div>

      {/* GRID */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {paginatedReports.map((r, i) => (
          <Card
            key={i}
            className={`group overflow-hidden border-l-4 ${priorityBorder[r.priority as keyof typeof priorityBorder]}
            transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
          >
            {/* IMAGE HEADER */}
            <div className="relative h-36 bg-slate-100">
              {r.image ? (
                <img
                  src={r.image}
                  alt={r.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-400">
                  <ImageIcon className="h-10 w-10" />
                </div>
              )}

              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition" />
            </div>

            <CardContent className="p-5 space-y-4">
              {/* HEADER */}
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-base line-clamp-2">
                  {r.title}
                </h3>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem className="gap-2">
                      <Eye className="h-4 w-4" />
                      Voir détails
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Pencil className="h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Changer priorité
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Check className="h-4 w-4" />
                      Changer statut
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 text-red-600">
                      <Trash2 className="h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* CATEGORY */}
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Tag className="h-4 w-4" />
                {r.category}
              </div>

              {/* PRIORITY */}
              <Badge className={priorityBadge[r.priority as keyof typeof priorityBadge]}>
                {r.priority}
              </Badge>

              {/* STATUS */}
              <div className="flex items-center gap-2 text-sm">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    statusDotColor[r.status as keyof typeof statusDotColor]
                  }`}
                />
                <span>{r.status}</span>
              </div>

              {/* DATE */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="h-4 w-4" />
                {r.date}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-6">
        <span className="text-sm text-slate-500">
          Page {page} sur {totalPages}
        </span>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </Button>
        </div>
      </div>
    </>
  );
}
