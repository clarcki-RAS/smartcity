/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from "react";
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

export default function SignalementForm() {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    titre: "",
    categorie: "",
    priorite: "",
    description: "",
    statut: "",
  });

  const progress = (step / 3) * 100;

  /* 🔐 VALIDATION */
  const validateStep = () => {
    if (step === 1) {
      if (!formData.titre || !formData.categorie || !formData.priorite) {
        setError("Veuillez remplir tous les champs obligatoires.");
        return false;
      }
    }
    if (step === 2) {
      if (!formData.description) {
        setError("La description est obligatoire.");
        return false;
      }
    }
    setError("");
    return true;
  };

  const next = () => validateStep() && setStep(step + 1);
  const back = () => setStep(step - 1);

  /* 📸 IMAGE PREVIEW (non obligatoire) */
  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImages(previews);
  };

  return (
    <Card className="max-w-3xl mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-xl">
          Signalement citoyen
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Étape {step} sur 3
        </p>
      </CardHeader>

      <CardContent className="space-y-6">

        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </p>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <Input
              className="h-12"
              placeholder="Titre du signalement"
              value={formData.titre}
              onChange={(e) =>
                setFormData({ ...formData, titre: e.target.value })
              }
            />

            <Select onValueChange={(v) =>
              setFormData({ ...formData, categorie: v })
            }>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="voirie">Voirie</SelectItem>
                <SelectItem value="eclairage">Éclairage public</SelectItem>
                <SelectItem value="dechets">Déchets / Propreté</SelectItem>
                <SelectItem value="securite">Sécurité</SelectItem>
                <SelectItem value="eau">Eau / Assainissement</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(v) =>
              setFormData({ ...formData, priorite: v })
            }>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="faible">Faible</SelectItem>
                <SelectItem value="moyenne">Moyenne</SelectItem>
                <SelectItem value="elevee">Élevée</SelectItem>
                <SelectItem value="critique">Critique</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <Textarea
              placeholder="Décrivez le problème en détail"
              rows={7}
              className="text-base"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <div>
              <label className="text-sm font-medium">
                Ajouter des images (optionnel)
              </label>
              <Input
                type="file"
                multiple
                className="mt-2"
                onChange={handleImages}
              />
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="preview"
                    className="rounded-lg h-28 w-full object-cover border"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <Select onValueChange={(v) =>
            setFormData({ ...formData, statut: v })
          }>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Statut du signalement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nouveau">Nouveau</SelectItem>
              <SelectItem value="en_cours">En cours</SelectItem>
              <SelectItem value="resolu">Résolu</SelectItem>
              <SelectItem value="rejete">Rejeté</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* ACTIONS */}
        <div className="flex justify-between items-center pt-4">
          {step > 1 && (
            <Button variant="outline" onClick={back}>
              Retour
            </Button>
          )}

          {step < 3 ? (
            <Button onClick={next}>Suivant</Button>
          ) : (
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => console.log(formData)}
            >
              Envoyer le signalement
            </Button>
          )}
        </div>

        {/* PROGRESS BAR EN BAS */}
        <Progress value={progress} />
      </CardContent>
    </Card>
  );
}
