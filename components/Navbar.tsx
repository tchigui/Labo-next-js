import { Suspense } from "react";
import Link from "next/link";
import LiensNavigation, { Liens } from "./LiensNavigation";

/*
  Barre de navigation commune à toutes les pages.
  <Suspense> : l'adresse de la page n'est connue qu'au moment de la visite.
  En attendant, on affiche les mêmes liens sans surlignage (fallback).
*/
export default function Navbar() {
  return (
    <header className="bg-college-fonce text-white shadow">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-4 sm:flex-row sm:justify-between">

        <Link href="/" className="text-xl font-bold tracking-tight">
          Collège ABC
        </Link>

        <Suspense fallback={<Liens chemin={null} />}>
          <LiensNavigation />
        </Suspense>

      </div>
    </header>
  );
}
