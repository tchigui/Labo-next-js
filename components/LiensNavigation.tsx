"use client";

/*
  Liens du menu. "use client" : usePathname() lit l'adresse de la page
  dans le navigateur pour surligner le lien de la page active.
*/

import Link from "next/link";
import { usePathname } from "next/navigation";

const LIENS = [
  { href: "/", texte: "Accueil" },
  { href: "/etudiants", texte: "Étudiants" },
  { href: "/formations", texte: "Formations" },
  { href: "/gestion", texte: "Gestion" },
  { href: "/contact", texte: "Contact" },
];

// Affichage des liens. chemin = adresse actuelle (null si pas encore connue).
export function Liens({ chemin }: { chemin: string | null }) {

  // Un lien est actif si on est sur sa page ou une sous-page (ex. /formations/3).
  function estActif(href: string) {
    if (chemin === null) return false;
    return href === "/" ? chemin === "/" : chemin.startsWith(href);
  }

  return (
    <nav className="flex flex-wrap justify-center gap-1">
      {LIENS.map((lien) => (
        <Link
          key={lien.href}
          href={lien.href}
          className={
            estActif(lien.href)
              ? "rounded-md bg-white px-3 py-2 text-sm font-semibold text-college-fonce"
              : "rounded-md px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/10"
          }
        >
          {lien.texte}
        </Link>
      ))}
    </nav>
  );
}

// Version qui connaît la page active.
export default function LiensNavigation() {
  const chemin = usePathname();
  return <Liens chemin={chemin} />;
}
