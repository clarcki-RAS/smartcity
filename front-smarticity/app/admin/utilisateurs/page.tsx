'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { CheckCircle, XCircle, Trash2, Shield , User } from "lucide-react";

// Import des utilisateurs statiques
import { users } from "@/lib/mock/users";

export default function UsersPage() {
  return (
    <div className="ml-[250px] space-y-6 p-4">

  {/* Header */}
  <div className="mb-4">
    <h1 className="text-2xl font-semibold text-slate-900">Gestion des utilisateurs</h1>
    <p className="text-sm text-slate-500 mt-1">Administration des comptes SmartCity</p>
  </div>

  {/* Table card */}
  <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
    <Table>
      <TableHeader className="bg-gray-50">
        <TableRow>
          <TableHead>Utilisateur</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rôle</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} className="hover:bg-gray-50">
            <TableCell className="font-medium py-3">{user.name}</TableCell>
            <TableCell className="text-slate-600 py-3">{user.email}</TableCell>
            <TableCell className="py-3">
              <Badge variant="secondary" className="gap-1 px-2 py-1 flex items-center">
                {user.role === "Civil" ? <User className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                {user.role}
              </Badge>
            </TableCell>
            <TableCell className="py-3">
              {user.status === "active" ? (
                <Badge className="bg-green-100 text-green-700 px-2 py-1">Actif</Badge>
              ) : (
                <Badge variant="outline" className="text-slate-500 px-2 py-1">Inactif</Badge>
              )}
            </TableCell>
            <TableCell className="text-right py-3 flex justify-end gap-2">
              {user.status === "active" ? (
                <Button size="sm" variant="outline" disabled className="gap-1">
                  <CheckCircle className="h-4 w-4" /> Actif
                </Button>
              ) : (
                <Button size="sm" variant="outline" className="gap-1 px-3">
                  <XCircle className="h-4 w-4" /> Activer
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="text-red-600 hover:bg-red-50"
                disabled={user.status === "active"}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>

</div>

  );
}
