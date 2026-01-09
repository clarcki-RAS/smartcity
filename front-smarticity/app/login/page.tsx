import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"



export default async function LoginPage() {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      
      {/* LEFT – HERO */}
      <div className="hidden lg:flex flex-col justify-between bg-muted px-12 py-10">
        <div className="flex items-center justify-between">
        {/* Back arrow */}
        <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
        >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">Retour</span>
        </Link>

        {/* Brand */}
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
            Signalez les incidents urbains, suivez leur traitement
            et participez activement à l’amélioration des services publics.
          </p>
        </div>

        <div className="relative h-[480px]">
          <Image
            src="/images/civil.png"
            alt="Smart city illustration"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* RIGHT – FORM */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-8">
          
          <div>
            <h2 className="text-3xl font-semibold">
              Connexion
            </h2>
            <p className="text-muted-foreground mt-2">
              Accédez à votre espace SmartCity Feedback
            </p>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                placeholder="citoyen@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
              />
            </div>

            <Button asChild className="w-full">
              <Link href="/civil">
                Se connecter
              </Link>
            </Button>
          </form>

          {/* Footer links */}
          <div className="text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <span className="text-primary cursor-pointer hover:underline">
              Créer un compte
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
