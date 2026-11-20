import Link from "next/link";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import EnTete from "@/components/EnTete";

/*
  Route "/formations" : liste des formations lue dans la base,
  avec un bouton « Voir détails » vers /formations/[id].
  _count : Prisma compte les cours (1 à N) et les étudiants (N à N).
*/
export default async function Formations() {

  await connection();

  const formations = await prisma.formation.findMany({
    include: {
      _count: {
        select: { cours: true, etudiants: true },
      },
    },
    orderBy: { nom: "asc" },
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">

      <EnTete
        titre="Nos formations"
        description="Découvrez les programmes offerts par notre collège."
      />

      {formations.length === 0 ? (

        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-slate-500">
          Aucune formation pour le moment. Ajoutez-en une dans la page Gestion.
        </p>

      ) : (

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {formations.map((formation) => (
            <article
              key={formation.id}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-bold text-college-fonce">{formation.nom}</h2>

              <p className="mt-2 flex-1 text-sm text-slate-600">
                {formation.description || "Aucune description."}
              </p>

              <p className="mt-4 text-xs font-semibold uppercase text-slate-500">
                {formation._count.cours} cours · {formation._count.etudiants} étudiant(s)
              </p>

              <Link
                href={`/formations/${formation.id}`}
                className="mt-4 inline-block rounded-lg bg-college px-4 py-2 text-center text-sm font-semibold text-white hover:bg-college-fonce"
              >
                Voir détails
              </Link>
            </article>
          ))}
        </div>

      )}

    </section>
  );
}
