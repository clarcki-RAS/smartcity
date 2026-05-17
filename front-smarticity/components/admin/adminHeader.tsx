"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ApiSignalement, getCurrentTokenPayload, listSignalements, listUsers } from "@/lib/api";
import { getSignalementMetadata } from "@/lib/signalements";

function getDisplayName(firstName?: string, lastName?: string, username?: string) {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  return fullName || username || "Admin";
}

export function AdminHeader() {
  const [displayName, setDisplayName] = useState(() => {
    const payload = getCurrentTokenPayload();
    return getDisplayName(payload?.first_name, payload?.last_name, payload?.username);
  });
  const [signalements, setSignalements] = useState<ApiSignalement[]>([]);

  useEffect(() => {
    const payload = getCurrentTokenPayload();

    async function loadHeaderData() {
      const [reports, users] = await Promise.all([listSignalements(), listUsers()]);
      setSignalements(reports);

      const currentUser = users.find((user) => user.id === payload?.user_id);
      if (currentUser) {
        setDisplayName(getDisplayName(currentUser.first_name, currentUser.last_name, currentUser.username));
      }
    }

    loadHeaderData().catch(() => undefined);
  }, []);

  const criticalCount = useMemo(() => {
    return signalements.filter((signalement) => getSignalementMetadata(signalement).priority === "Critique").length;
  }, [signalements]);

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Bonjour {displayName},</h1>
        <p className="text-slate-500">
          <span className="font-semibold text-red-500">
            {criticalCount} signalement{criticalCount > 1 ? "s" : ""} critique{criticalCount > 1 ? "s" : ""}
          </span>{" "}
          nécessitent votre attention aujourd&apos;hui.
        </p>
      </div>

      <Button asChild variant="destructive" className="gap-2">
        <Link href="/admin/signalements?urgence=1">
          <AlertTriangle className="h-4 w-4" />
          Voir les urgences
        </Link>
      </Button>
    </div>
  );
}
