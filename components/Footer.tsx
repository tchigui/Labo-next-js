import Link from "next/link";

// Pied de page commun à toutes les pages.
export default function Footer() {
  return (
    <footer className="bg-college-fonce text-white/80">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm sm:grid-cols-3">

        <div>
          <p className="font-bold text-white">Collège ABC</p>
          <p className="mt-2">Des formations pour bâtir votre avenir.</p>
        </div>

        <div>
          <p className="font-bold text-white">Navigation</p>
          <ul className="mt-2 space-y-1">
            <li><Link href="/formations" className="hover:text-white">Formations</Link></li>
            <li><Link href="/etudiants" className="hover:text-white">Étudiants</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-bold text-white">Nous joindre</p>
          <p className="mt-2">123, rue du Collège</p>
          <p>418-555-1234</p>
          <p>info@collegeabc.ca</p>
        </div>

      </div>

      <p className="border-t border-white/10 py-4 text-center text-xs">
        © 2026 Collège ABC — Projet Next.js, Prisma et Tailwind CSS
      </p>
    </footer>
  );
}
