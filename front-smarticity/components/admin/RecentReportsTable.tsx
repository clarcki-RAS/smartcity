"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Pencil, AlertTriangle, Check, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { reports } from "@/lib/mock/reports";
import { Search, X } from "lucide-react";

const ITEMS_PER_PAGE = 8;

const priorityColor = {
  Critique: "bg-red-100 text-red-700 border-red-200",
  Élevée: "bg-orange-100 text-orange-700 border-orange-200",
  Moyenne: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Faible: "bg-green-100 text-green-700 border-green-200",
};

const statusDotColor = {
  "En attente": "bg-slate-400",
  "En cours": "bg-blue-500",
  Résolu: "bg-green-500",
};



export function RecentReportsTable() {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  const paginatedReports = reports.slice(start, end);

  return (
    <div  className=" bg-white rounded-xl border p-4">
      <h2 className="text-lg font-semibold mb-4">
        Signalements récents
      </h2>
      {/* Filtres */}
<div className="mb-4 space-y-3">
  {/* Recherche large */}
  <div className="relative w-full">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
    <Input
      placeholder="Rechercher un signalement, une catégorie, un statut..."
      className="pl-9 h-11"
    />
  </div>

  {/* Filtres */}
  <div className="flex flex-wrap items-center gap-3">
    {/* Catégorie */}
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Catégorie" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="infrastructure">Infrastructure</SelectItem>
        <SelectItem value="securite">Sécurité</SelectItem>
        <SelectItem value="transport">Transport</SelectItem>
        <SelectItem value="environnement">Environnement</SelectItem>
      </SelectContent>
    </Select>

    {/* Priorité */}
    <Select>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Priorité" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="critique">Critique</SelectItem>
        <SelectItem value="elevee">Élevée</SelectItem>
        <SelectItem value="moyenne">Moyenne</SelectItem>
        <SelectItem value="faible">Faible</SelectItem>
      </SelectContent>
    </Select>

    {/* Statut */}
    <Select>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Statut" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en-attente">En attente</SelectItem>
        <SelectItem value="en-cours">En cours</SelectItem>
        <SelectItem value="resolu">Résolu</SelectItem>
      </SelectContent>
    </Select>

    {/* Reset */}
    <Button
      variant="outline"
      size="sm"
      className="ml-auto gap-2"
    >
      <X className="h-4 w-4" />
      Réinitialiser
    </Button>
  </div>
</div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Signalement</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Priorité</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedReports.map((r, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">
                {r.title}
              </TableCell>
              <TableCell>{r.category}</TableCell>

              <TableCell>
                <Badge
                  className={
                    priorityColor[
                      r.priority as keyof typeof priorityColor
                    ]
                  }
                >
                  {r.priority}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      statusDotColor[
                        r.status as keyof typeof statusDotColor
                      ]
                    }`}
                  />
                  <span className="text-slate-700">
                    {r.status}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-slate-500">
                {r.date}
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
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

                    <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-600">
                      <Trash2 className="h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>

            </TableRow>
            
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
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
    </div>
  );
}
