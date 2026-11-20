import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

/*
  Route dynamique "/formations/[id]" : détails d'UNE formation.
  [id] dans le nom du dossier = partie variable de l'adresse.
  Ex. : /formations/3 -> params.id vaut "3".
*/
export default async function DetailsFormation({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  // Avec Next.js 16, params est une promesse : il faut l'attendre.
  const { id } = await params;
  const formationId = Number(id);

  // Adresse invalide (ex. /formations/abc) -> page 404
  if (!Number.isInteger(formationId) || formationId <= 0) {
    notFound();
  }

  // findUnique : une seule formation, avec ses cours (1 à N) et ses étudiants (N à N)
  const formation = await prisma.formation.findUnique({
    where: { id: formationId },
    include: {
      cours: { orderBy: { titre: "asc" } },
      etudiants: { orderBy: { nom: "asc" } },
    },
  });

  // Formation inexistante (ex. supprimée) -> page 404
  if (!formation) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">

      <Link href="/formations" className="text-sm font-semibold text-accent hover:underline">
        ← Retour aux formations
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-college-fonce">{formation.nom}</h1>
      <p className="mt-3 text-slate-600">
        {formation.description || "Aucune description."}
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-college-fonce">
            Cours ({formation.cours.length})
          </h2>
          {formation.cours.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">Aucun cours pour cette formation.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {formation.cours.map((cours) => (
                <li key={cours.id} className="rounded-md bg-slate-50 px-3 py-2 text-sm">
                  {cours.titre}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-college-fonce">
            Étudiants inscrits ({formation.etudiants.length})
          </h2>
          {formation.etudiants.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">Aucun étudiant inscrit.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {formation.etudiants.map((etudiant) => (
                <li key={etudiant.id} className="rounded-md bg-slate-50 px-3 py-2 text-sm">
                  {etudiant.nom}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

    </section>
  );
}
