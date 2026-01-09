/* eslint-disable @next/next/no-img-element */
'use client';

// app/page.tsx
import Image from "next/image";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Button } from "@/components/ui/button";
import { useEffect, useRef,useState } from "react";
import clsx from "clsx";
import Link from "next/link";



// Simple fade + slide animations
const sectionBase =
  "min-h-screen snap-start flex flex-col items-center justify-center px-6 text-center transition-opacity duration-700 ease-out";

function useReveal(ref: any) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("opacity-100", "translate-y-0");
        else el.classList.remove("opacity-100", "translate-y-0");
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
}

function AnimatedSection({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <div
      ref={ref}
      className={clsx(
        "opacity-0 translate-y-6 transition-all duration-700",
        compact ? "py-0" : "py-24"
      )}
    >
      {/* ⬇️ PLUS DE max-w ICI */}
      <div className="w-full text-center">
        {children}
      </div>
    </div>
  );
}

function Navbar() {
  return (
<header className="fixed top-0 left-0 w-full z-50">
  <nav className="flex items-center justify-between px-8 py-4 backdrop-blur-md bg-black/30">
    
    {/* Logo SmartCity */}
    <div className="flex items-center gap-3 cursor-pointer">
      <img
        src="/images/logo-smartcity.png"   
        alt="SmartCity Logo"
        className="w-10 h-10 rounded-full"
      />
    <span className="text-white font-bold text-xl sm:text-2xl md:text-3xl tracking-wide">
      SmartCity
    </span>

    </div>

    {/* Actions */}

<div className="flex gap-4">
  <Button asChild className="px-4 py-2 transition active:scale-95">
    <Link href="/login">Connexion</Link>
  </Button>

  <Button asChild variant="outline" className="px-4 py-2 transition active:scale-95">
    <Link href="/register">Créer un compte</Link>
  </Button>
</div>


  </nav>
</header>

  );
}


export default function Home() {
  const [active, setActive] = useState("ville");
  return (
    <><Navbar /> 
    <main className="w-full scroll-smooth">


      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 min-h-screen flex items-center text-white">
  {/* Background */}
  <div className="absolute inset-0 -z-10">
    <Image
      src="/images/background.jpg"
      alt="Ville SmartCity"
      fill
      priority
      className="object-cover brightness-75"
    />
    <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70" />
  </div>

  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
    
    {/* LEFT — TEXTE */}
    <div className="space-y-6">
      <span className="inline-block px-4 py-1 text-sm rounded-full bg-white/10 backdrop-blur">
        Plateforme citoyenne
      </span>

      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
        Votre ville mérite mieux. <br />
        <span className="text-sky-400">Agissez dès maintenant.</span>
      </h1>

      <p className="text-lg md:text-xl opacity-90 max-w-xl">
        SmartCity connecte citoyens et services urbains pour signaler,
        suivre et résoudre les problèmes du quotidien.
      </p>
    </div>

    {/* RIGHT — STATS */}
    <div className="hidden md:grid grid-cols-2 gap-6">
      <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
        <p className="text-3xl font-bold">+1200</p>
        <p className="text-sm opacity-80">Signalements traités</p>
      </div>
      <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
        <p className="text-3xl font-bold">24h</p>
        <p className="text-sm opacity-80">Temps moyen de réponse</p>
      </div>
      <div className="bg-white/10 backdrop-blur rounded-2xl p-6 col-span-2">
        <p className="text-sm opacity-80">
          Une ville plus propre, plus sûre et plus intelligente.
        </p>
      </div>
    </div>

  </div>
  
</section>
<section className="w-full bg-black text-white py-24 px-6">
  <AnimatedSection>
    {/* ILLUSTRATION / VISUEL */}
    <div className="flex justify-center mb-10">
      <img
        src="/images/illustration.png"
        alt="Citoyens connectés à leur ville"
        className="w-64 md:w-80 opacity-90"
      />
    </div>

    {/* MESSAGE PRINCIPAL */}
    <h2 className="text-4xl md:text-6xl font-extrabold leading-tight max-w-4xl mx-auto mb-6">
      Construisons ensemble <br />
      <span className="text-blue-400">une ville qui écoute</span>
    </h2>

    {/* SOUS-TEXTE */}
    <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
      SmartCity permet aux citoyens de signaler les problèmes urbains,
      de suivre les interventions et de participer activement
      à l’amélioration de leur environnement.
    </p>
  </AnimatedSection>
</section>



{/* CTA */}
<section className="w-full flex justify-center px-6  py-20 bg-linear-to-b from-black to-black/95 text-white">
  <div className="max-w-4xl w-full">
    <AnimatedSection compact>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        Rejoignez la communauté SmartCity
      </h2>
      <p className="text-base mb-8 opacity-80">
        Connectez-vous pour accéder à votre espace citoyen ou créez un compte.
      </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button asChild className="px-6 py-3 text-base">
        <Link href="/login">Connexion</Link>
      </Button>

      <Button asChild variant="secondary" className="px-6 py-3 text-base">
        <Link href="/register">Créer un compte</Link>
      </Button>
    </div>
    </AnimatedSection>
  </div>
</section>

      <footer className="w-full bg-black text-white py-12 px-8 snap-start">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
        <h3 className="text-xl font-bold mb-3">SmartCity</h3>
        <p className="text-sm opacity-75">La plateforme qui connecte citoyens et services urbains pour une ville plus intelligente.</p>
        </div>
        <div>
        <h4 className="text-lg font-semibold mb-2">Navigation</h4>
        <ul className="space-y-1 text-sm opacity-80">
        <li className="hover:opacity-100 cursor-pointer">Accueil</li>
        <li className="hover:opacity-100 cursor-pointer">Signalements</li>
        <li className="hover:opacity-100 cursor-pointer">Tableau de bord</li>
        <li className="hover:opacity-100 cursor-pointer">Support</li>
        </ul>
        </div>
        <div>
        <h4 className="text-lg font-semibold mb-2">Réseaux sociaux</h4>
        <ul className="space-y-1 text-sm opacity-80">
        <li className="flex items-center gap-2 hover:opacity-100 cursor-pointer">
          <i className="bi bi-facebook"></i> Facebook
        </li>
        <li className="flex items-center gap-2 hover:opacity-100 cursor-pointer">
          <i className="bi bi-instagram"></i> Instagram
        </li>
        <li className="flex items-center gap-2 hover:opacity-100 cursor-pointer">
          <i className="bi bi-twitter"></i> Twitter
        </li>
        <li className="flex items-center gap-2 hover:opacity-100 cursor-pointer">
          <i className="bi bi-linkedin"></i> LinkedIn
        </li>

        </ul>
        </div>
        <div>
        <h4 className="text-lg font-semibold mb-2">Contact</h4>
        <p className="text-sm opacity-80">contact@smartcity.com</p>
        <p className="text-sm opacity-80">+261 34 00 000 00</p>
        <p className="text-sm opacity-80 mt-2">Madagascar</p>
        </div>
        </div>
        <div className="text-center text-xs mt-10 opacity-60">© 2025 SmartCity — Tous droits réservés</div>
        </footer>
    </main>
    </>
  );
}

