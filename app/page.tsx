import Link from "next/link";

// Route "/" : page d'accueil (contenu statique, aucune base de données).
const SECTIONS = [
  {
    titre: "Formations",
    texte: "Consultez les programmes offerts et le détail de leurs cours.",
    href: "/formations",
    lien: "Voir les formations",
  },
  {
    titre: "Étudiants",
    texte: "Découvrez les étudiants inscrits et leurs formations.",
    href: "/etudiants",
    lien: "Voir les étudiants",
  },
  {
    titre: "Contact",
    texte: "Une question ? Notre équipe vous répond rapidement.",
    href: "/contact",
    lien: "Nous contacter",
  },
];

export default function Accueil() {
  return (
    <div>

      {/* Bannière */}
      <section className="bg-gradient-to-br from-college to-accent text-white">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            Bienvenue au Collège ABC
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/90">
            Découvrez nos programmes, nos étudiants et notre environnement
            d&apos;apprentissage.
          </p>
          <Link
            href="/formations"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-college hover:bg-college-clair"
          >
            Voir nos formations
          </Link>
        </div>
      </section>

      {/* Cartes : 1 colonne sur cellulaire, 3 sur ordinateur */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-college-fonce">
          Découvrez notre collège
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {SECTIONS.map((section) => (
            <div
              key={section.href}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-college-fonce">{section.titre}</h3>
              <p className="mt-2 text-slate-600">{section.texte}</p>
              <Link
                href={section.href}
                className="mt-4 inline-block font-semibold text-accent hover:underline"
              >
                {section.lien} →
              </Link>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
