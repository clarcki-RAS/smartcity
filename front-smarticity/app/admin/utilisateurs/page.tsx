"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, User } from "lucide-react";
import { ApiUser, listUsers } from "@/lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listUsers()
      .then(setUsers)
      .catch((err) => setError(err instanceof Error ? err.message : "Chargement impossible."))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6 pl-64">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Gestion des utilisateurs</h1>
        <p className="text-sm text-slate-500 mt-1">Administration des comptes SmartCity</p>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-md">{error}</p>}
      {isLoading && <p className="text-sm text-slate-500">Chargement des utilisateurs...</p>}

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Date de création</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell className="font-medium py-3">
                  {[user.first_name, user.last_name].filter(Boolean).join(" ") || user.username}
                </TableCell>
                <TableCell className="text-slate-600 py-3">{user.email}</TableCell>
                <TableCell className="py-3">
                  <Badge variant="secondary" className="gap-1 px-2 py-1 flex items-center w-fit">
                    {user.role === "CIVIL" ? <User className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                    {user.role === "CIVIL" ? "Civil" : "Admin"}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-600 py-3">{new Date(user.date_joined).toLocaleString("fr-FR")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
