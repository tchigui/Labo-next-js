import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import EnTete from "@/components/EnTete";
import {
  createFormation,
  updateFormation,
  deleteFormation,
  createCours,
  deleteCours,
  createEtudiant,
  updateEtudiant,
  deleteEtudiant,
} from "./actions";

// Classes Tailwind réutilisées dans les formulaires.
const CHAMP = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-college focus:outline-none focus:ring-2 focus:ring-college-clair";
const ETIQUETTE = "mb-1 block text-sm font-semibold text-slate-700";
const BOUTON = "rounded-lg bg-college px-4 py-2 text-sm font-semibold text-white hover:bg-college-fonce";
const BOUTON_SUPPRIMER = "rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50";
const CARTE = "rounded-xl border border-slate-200 bg-white p-6 shadow-sm";

/*
  Route "/gestion" : CRUD des formations (section A) et des étudiants (section B).
  Chaque section : colonne 1 = formulaire d'ajout, colonne 2 = liste avec Modifier et Supprimer.
*/
export default async function GestionPage() {

  // Lire la base à chaque visite.
  await connection();

  // READ : formations + leurs cours (1 à N) + leurs étudiants (N à N)
  const formations = await prisma.formation.findMany({
    include: {
      cours: { orderBy: { titre: "asc" } },
      etudiants: true,
    },
    orderBy: { nom: "asc" },
  });

  // READ : étudiants + leur profil (1 à 0..1) + leurs formations (N à N)
  const etudiants = await prisma.etudiant.findMany({
    include: {
      profil: true,
      formations: true,
    },
    orderBy: { nom: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">

      <EnTete
        titre="Gestion"
        description="Ajouter, modifier et supprimer les formations et les étudiants."
      />


      {/* ==================================================
          A — GESTION DES FORMATIONS
      ================================================== */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold text-college-fonce">A — Formations</h2>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* COLONNE 1 : formulaire d'ajout */}
          <div className={`${CARTE} h-fit`}>
            <h3 className="mb-4 text-lg font-bold">Ajouter une formation</h3>

            <form action={createFormation} className="space-y-4">
              <div>
                <label htmlFor="nomFormation" className={ETIQUETTE}>Nom</label>
                <input id="nomFormation" name="nomFormation" type="text" required className={CHAMP} />
              </div>

              <div>
                <label htmlFor="description" className={ETIQUETTE}>Description</label>
                <textarea id="description" name="description" rows={3} className={CHAMP} />
              </div>

              <button type="submit" className={BOUTON}>Ajouter la formation</button>
            </form>
          </div>

          {/* COLONNE 2 : liste avec Modifier / Supprimer */}
          <div className="space-y-4 lg:col-span-2">
            <h3 className="text-lg font-bold">Formations ({formations.length})</h3>

            {formations.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-slate-500">
                Aucune formation.
              </p>
            ) : (
              formations.map((formation) => (
                <article key={formation.id} className={CARTE}>

                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-bold text-college-fonce">{formation.nom}</h4>
                      <p className="mt-1 text-sm text-slate-600">
                        {formation.description || "Aucune description."}
                      </p>
                      <p className="mt-2 text-xs font-semibold uppercase text-slate-500">
                        {formation.cours.length} cours · {formation.etudiants.length} étudiant(s)
                      </p>
                    </div>

                    {/* DELETE : .bind fixe l'id de CETTE formation */}
                    <form action={deleteFormation.bind(null, formation.id)}>
                      <button type="submit" className={BOUTON_SUPPRIMER}>Supprimer</button>
                    </form>
                  </div>

                  {/* UPDATE : formulaire repliable, déjà rempli avec les valeurs actuelles */}
                  <details className="mt-4 rounded-lg bg-slate-50 p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-accent">
                      Modifier
                    </summary>

                    <form action={updateFormation.bind(null, formation.id)} className="mt-4 space-y-3">
                      <div>
                        <label className={ETIQUETTE}>Nom</label>
                        <input name="nomFormation" type="text" defaultValue={formation.nom} required className={CHAMP} />
                      </div>
                      <div>
                        <label className={ETIQUETTE}>Description</label>
                        <textarea name="description" rows={2} defaultValue={formation.description ?? ""} className={CHAMP} />
                      </div>
                      <button type="submit" className={BOUTON}>Enregistrer</button>
                    </form>

                    {/* Cours de la formation (relation 1 à N) */}
                    <div className="mt-6 border-t border-slate-200 pt-4">
                      <p className="mb-2 text-sm font-semibold text-slate-700">Cours</p>

                      <ul className="mb-3 space-y-2">
                        {formation.cours.map((cours) => (
                          <li key={cours.id} className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm">
                            {cours.titre}
                            <form action={deleteCours.bind(null, cours.id)}>
                              <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">
                                Retirer
                              </button>
                            </form>
                          </li>
                        ))}
                      </ul>

                      <form action={createCours.bind(null, formation.id)} className="flex gap-2">
                        <input name="titre" type="text" placeholder="Titre du cours" required className={CHAMP} />
                        <button type="submit" className={BOUTON}>Ajouter</button>
                      </form>
                    </div>
                  </details>

                </article>
              ))
            )}
          </div>

        </div>
      </section>


      {/* ==================================================
          B — GESTION DES ÉTUDIANTS
      ================================================== */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-college-fonce">B — Étudiants</h2>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* COLONNE 1 : formulaire d'ajout */}
          <div className={`${CARTE} h-fit`}>
            <h3 className="mb-4 text-lg font-bold">Ajouter un étudiant</h3>

            <form action={createEtudiant} className="space-y-4">
              <div>
                <label htmlFor="nomEtudiant" className={ETIQUETTE}>Nom</label>
                <input id="nomEtudiant" name="nomEtudiant" type="text" required className={CHAMP} />
              </div>

              <div>
                <label htmlFor="bio" className={ETIQUETTE}>Biographie (profil, facultatif)</label>
                <textarea id="bio" name="bio" rows={3} className={CHAMP} />
              </div>

              {/* N à N : toutes les cases ont le même name="formations" */}
              <fieldset>
                <legend className={ETIQUETTE}>Formations</legend>
                {formations.length === 0 ? (
                  <p className="text-sm text-slate-500">Ajoutez d&apos;abord une formation.</p>
                ) : (
                  <div className="space-y-1">
                    {formations.map((formation) => (
                      <label key={formation.id} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" name="formations" value={formation.id} className="h-4 w-4 accent-college" />
                        {formation.nom}
                      </label>
                    ))}
                  </div>
                )}
              </fieldset>

              <button type="submit" className={BOUTON}>Ajouter l&apos;étudiant</button>
            </form>
          </div>

          {/* COLONNE 2 : liste avec Modifier / Supprimer */}
          <div className="space-y-4 lg:col-span-2">
            <h3 className="text-lg font-bold">Étudiants ({etudiants.length})</h3>

            {etudiants.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-slate-500">
                Aucun étudiant.
              </p>
            ) : (
              etudiants.map((etudiant) => (
                <article key={etudiant.id} className={CARTE}>

                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-bold text-college-fonce">{etudiant.nom}</h4>
                      <p className="mt-1 text-sm text-slate-600">
                        {etudiant.profil?.bio || "Aucune biographie."}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {etudiant.formations.map((formation) => (
                          <span key={formation.id} className="rounded-full bg-college-clair px-3 py-1 text-xs font-semibold text-college">
                            {formation.nom}
                          </span>
                        ))}
                      </div>
                    </div>

                    <form action={deleteEtudiant.bind(null, etudiant.id)}>
                      <button type="submit" className={BOUTON_SUPPRIMER}>Supprimer</button>
                    </form>
                  </div>

                  <details className="mt-4 rounded-lg bg-slate-50 p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-accent">
                      Modifier
                    </summary>

                    <form action={updateEtudiant.bind(null, etudiant.id)} className="mt-4 space-y-3">
                      <div>
                        <label className={ETIQUETTE}>Nom</label>
                        <input name="nomEtudiant" type="text" defaultValue={etudiant.nom} required className={CHAMP} />
                      </div>
                      <div>
                        <label className={ETIQUETTE}>Biographie</label>
                        <textarea name="bio" rows={2} defaultValue={etudiant.profil?.bio ?? ""} className={CHAMP} />
                      </div>
                      <fieldset>
                        <legend className={ETIQUETTE}>Formations</legend>
                        <div className="space-y-1">
                          {formations.map((formation) => (
                            <label key={formation.id} className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                name="formations"
                                value={formation.id}
                                defaultChecked={etudiant.formations.some((f) => f.id === formation.id)}
                                className="h-4 w-4 accent-college"
                              />
                              {formation.nom}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      <button type="submit" className={BOUTON}>Enregistrer</button>
                    </form>
                  </details>

                </article>
              ))
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
