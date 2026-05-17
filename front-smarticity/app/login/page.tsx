"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { jwtDecode } from "jwt-decode";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, setTokens } from "@/lib/api";

type TokenPayload = {
  is_superuser?: boolean;
  role?: "ADMIN" | "CIVIL";
};

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const tokens = await login(username, password);
      setTokens(tokens);
      const payload = jwtDecode<TokenPayload>(tokens.access);
      router.push(payload.is_superuser || payload.role === "ADMIN" ? "/admin" : "/civil");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-muted px-12 py-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Retour</span>
          </Link>

          <div className="flex items-center gap-2 font-semibold">
            <span className="text-lg">SmartCity Feedback</span>
          </div>
        </div>

        <div>
          <h1 className="text-5xl font-bold leading-tight">
            Améliorons <br />
            notre <span className="text-primary">ville</span> <br />
            ensemble
          </h1>
          <p className="mt-4 text-muted-foreground max-w-md">
            Signalez les incidents urbains, suivez leur traitement et participez activement à l&apos;amélioration des services publics.
          </p>
        </div>

        <div className="relative h-[480px]">
          <Image src="/images/civil.png" alt="Smart city illustration" fill className="object-contain" />
        </div>
      </div>

      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-semibold">Connexion</h2>
            <p className="text-muted-foreground mt-2">Accédez à votre espace SmartCity Feedback</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-md">{error}</p>}

            <div className="space-y-2">
              <Label htmlFor="username">Nom d&apos;utilisateur</Label>
              <Input
                id="username"
                type="text"
                placeholder="citoyen"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-primary cursor-pointer hover:underline">
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
