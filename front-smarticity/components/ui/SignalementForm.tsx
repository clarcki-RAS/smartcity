"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { LocateFixed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiSignalement, createSignalement } from "@/lib/api";

type SignalementFormProps = {
  onCreated?: (signalement: ApiSignalement) => void;
};

type GpsCandidate = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

export default function SignalementForm({ onCreated }: SignalementFormProps) {
  const [step, setStep] = useState(1);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    titre: "",
    categorie: "",
    priorite: "",
    ville: "Fianarantsoa",
    quartier: "",
    lieu: "",
    repere: "",
    positionAuto: "",
    description: "",
  });

  const progress = (step / 3) * 100;

  const validateStep = () => {
    if (step === 1 && (!formData.titre || !formData.categorie || !formData.priorite)) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return false;
    }
    if (step === 2 && !formData.description) {
      setError("La description est obligatoire.");
      return false;
    }
    setError("");
    return true;
  };

  const next = () => validateStep() && setStep(step + 1);
  const back = () => setStep(step - 1);

  const handleImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    setPreviewUrls(selectedFiles.map((file) => URL.createObjectURL(file)));
  };

  const detectCurrentPosition = () => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas disponible sur ce navigateur.");
      return;
    }

    setIsLocating(true);
    setError("");

    const candidates: GpsCandidate[] = [];
    let watchId: number | null = null;
    let isSettled = false;
    let timerId: number | null = null;

    const finishWithBestCandidate = () => {
      if (isSettled) return;
      isSettled = true;
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (timerId !== null) window.clearTimeout(timerId);
      setIsLocating(false);

      const best = candidates.sort((a, b) => a.accuracy - b.accuracy)[0];
      if (!best) {
        setError("Impossible de récupérer une position exploitable.");
        return;
      }

      setGpsAccuracy(best.accuracy);
      setFormData((current) => ({
        ...current,
        positionAuto: `${best.latitude.toFixed(6)}, ${best.longitude.toFixed(6)}`,
      }));
    };

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const candidate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        candidates.push(candidate);

        if (candidate.accuracy <= 15) {
          finishWithBestCandidate();
        }
      },
      () => {
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        setIsLocating(false);
        setError("Impossible de récupérer la position actuelle.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      }
    );

    timerId = window.setTimeout(finishWithBestCandidate, 12000);
  };

  const buildLocalisation = () => {
    return [
      formData.ville && `Ville: ${formData.ville}`,
      formData.quartier && `Quartier: ${formData.quartier}`,
      formData.lieu && `Rue / lieu: ${formData.lieu}`,
      formData.repere && `Repère: ${formData.repere}`,
      formData.positionAuto && `Position GPS: ${formData.positionAuto}`,
      gpsAccuracy !== null && `Précision GPS: ±${Math.round(gpsAccuracy)} m`,
    ]
      .filter(Boolean)
      .join(" | ");
  };

  const submit = async () => {
    if (!validateStep()) return;

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const description = [
        `Titre: ${formData.titre}`,
        `Catégorie: ${formData.categorie}`,
        `Priorité: ${formData.priorite}`,
        "",
        formData.description,
      ].join("\n");

      const signalement = await createSignalement({
        description,
        localisation: buildLocalisation(),
        images: files,
      });

      setSuccess("Signalement envoyé avec succès.");
      onCreated?.(signalement);
      setStep(1);
      setFiles([]);
      setPreviewUrls([]);
      setGpsAccuracy(null);
      setFormData({
        titre: "",
        categorie: "",
        priorite: "",
        ville: "Fianarantsoa",
        quartier: "",
        lieu: "",
        repere: "",
        positionAuto: "",
        description: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Envoi impossible.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-xl">Signalement citoyen</CardTitle>
        <p className="text-sm text-muted-foreground">Étape {step} sur 3</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>}
        {success && <p className="text-sm text-green-700 bg-green-50 p-3 rounded">{success}</p>}

        {step === 1 && (
          <div className="space-y-4">
            <Input
              className="h-12"
              placeholder="Titre du signalement"
              value={formData.titre}
              onChange={(event) => setFormData({ ...formData, titre: event.target.value })}
            />

            <Select value={formData.categorie} onValueChange={(value) => setFormData({ ...formData, categorie: value })}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Voirie">Voirie</SelectItem>
                <SelectItem value="Éclairage public">Éclairage public</SelectItem>
                <SelectItem value="Déchets / Propreté">Déchets / Propreté</SelectItem>
                <SelectItem value="Sécurité">Sécurité</SelectItem>
                <SelectItem value="Eau / Assainissement">Eau / Assainissement</SelectItem>
                <SelectItem value="Autre">Autre</SelectItem>
              </SelectContent>
            </Select>

            <Select value={formData.priorite} onValueChange={(value) => setFormData({ ...formData, priorite: value })}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Faible">Faible</SelectItem>
                <SelectItem value="Moyenne">Moyenne</SelectItem>
                <SelectItem value="Élevée">Élevée</SelectItem>
                <SelectItem value="Critique">Critique</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Input
              className="h-12"
              placeholder="Ville"
              value={formData.ville}
              onChange={(event) => setFormData({ ...formData, ville: event.target.value })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                className="h-12"
                placeholder="Quartier"
                value={formData.quartier}
                onChange={(event) => setFormData({ ...formData, quartier: event.target.value })}
              />
              <Input
                className="h-12"
                placeholder="Rue, avenue ou lieu"
                value={formData.lieu}
                onChange={(event) => setFormData({ ...formData, lieu: event.target.value })}
              />
            </div>
            <Input
              className="h-12"
              placeholder="Repère proche: école, marché, bâtiment..."
              value={formData.repere}
              onChange={(event) => setFormData({ ...formData, repere: event.target.value })}
            />
            <Button type="button" variant="outline" className="gap-2" onClick={detectCurrentPosition} disabled={isLocating}>
              <LocateFixed className="h-4 w-4" />
              {isLocating ? "Recherche de la meilleure précision..." : "Détecter ma position précisément"}
            </Button>
            {formData.positionAuto && (
              <p className="text-xs text-slate-500">
                Position détectée: {formData.positionAuto}
                {gpsAccuracy !== null ? `, précision environ ±${Math.round(gpsAccuracy)} m` : ""}
              </p>
            )}
            <Textarea
              placeholder="Décrivez le problème en détail"
              rows={7}
              className="text-base"
              value={formData.description}
              onChange={(event) => setFormData({ ...formData, description: event.target.value })}
            />

            <div>
              <label className="text-sm font-medium">Ajouter des images (optionnel)</label>
              <Input type="file" multiple className="mt-2" onChange={handleImages} />
            </div>

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {previewUrls.map((src) => (
                  <img key={src} src={src} alt="preview" className="rounded-lg h-28 w-full object-cover border" />
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="rounded-md border bg-slate-50 p-4 text-sm space-y-2">
            <p>
              <span className="font-medium">Titre:</span> {formData.titre}
            </p>
            <p>
              <span className="font-medium">Catégorie:</span> {formData.categorie}
            </p>
            <p>
              <span className="font-medium">Priorité:</span> {formData.priorite}
            </p>
            <p>
              <span className="font-medium">Localisation:</span> {buildLocalisation() || "Non renseignée"}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center pt-4">
          {step > 1 && (
            <Button variant="outline" onClick={back} type="button">
              Retour
            </Button>
          )}

          {step < 3 ? (
            <Button onClick={next} type="button">
              Suivant
            </Button>
          ) : (
            <Button className="bg-green-600 hover:bg-green-700" onClick={submit} disabled={isSubmitting} type="button">
              {isSubmitting ? "Envoi..." : "Envoyer le signalement"}
            </Button>
          )}
        </div>

        <Progress value={progress} />
      </CardContent>
    </Card>
  );
}
