import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import EnTete from "@/components/EnTete";

/*
  Route "/etudiants" : liste des étudiants lue dans la base.
  include :
    - formations : relation N à N (Etudiant <-> Formation)
    - profil     : relation 1 à 0..1 (Etudiant -> Profil)
*/
export default async function Etudiants() {

  // Lire la base à chaque visite (et non une seule fois au moment du build).
  await connection();

  const etudiants = await prisma.etudiant.findMany({
    include: {
      formations: true,
      profil: true,
    },
    orderBy: { nom: "asc" },
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">

      <EnTete
        titre="Nos étudiants"
        description="Les étudiants inscrits au Collège ABC et leurs formations."
      />

      {etudiants.length === 0 ? (

        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-slate-500">
          Aucun étudiant pour le moment. Ajoutez-en un dans la page Gestion.
        </p>

      ) : (

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {etudiants.map((etudiant) => (
            <article
              key={etudiant.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-college-clair text-lg font-bold text-college">
                  {etudiant.nom.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-lg font-bold text-college-fonce">{etudiant.nom}</h2>
              </div>

              {/* 1 à 0..1 : profil est un objet ou null */}
              <p className="mt-4 text-sm text-slate-600">
                {etudiant.profil?.bio || "Aucune biographie."}
              </p>

              {/* N à N : formations est un tableau */}
              <div className="mt-4 flex flex-wrap gap-2">
                {etudiant.formations.length === 0 ? (
                  <span className="text-sm text-slate-400">Aucune formation</span>
                ) : (
                  etudiant.formations.map((formation) => (
                    <span
                      key={formation.id}
                      className="rounded-full bg-college-clair px-3 py-1 text-xs font-semibold text-college"
                    >
                      {formation.nom}
                    </span>
                  ))
                )}
              </div>
            </article>
          ))}
        </div>

      )}

    </section>
  );
}
