"use server";

/*
  Actions serveur de la page Gestion (CRUD).
  "use server" : ces fonctions s'exécutent sur le serveur, jamais dans le navigateur.
  Chaque formulaire de la page appelle une de ces fonctions avec <form action={...}>.
*/

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


// Après chaque modification : réafficher toutes les pages qui montrent ces données
// (Gestion, Étudiants, Formations et les pages de détails).
function revaliderSite() {
  revalidatePath("/", "layout");
}

// Lire un champ texte du formulaire, sans espaces au début et à la fin.
function lireTexte(formData: FormData, nom: string) {
  return String(formData.get(nom) ?? "").trim();
}

// Lire les cases cochées (même name) et les transformer en liste d'id.
function lireIds(formData: FormData, nom: string) {
  return formData
    .getAll(nom)
    .map((id) => Number(id))
    .filter((id) => !Number.isNaN(id));
}


// ==========================================================
// A — FORMATIONS
// ==========================================================

// CREATE
export async function createFormation(formData: FormData) {
  const nom = lireTexte(formData, "nomFormation");
  const description = lireTexte(formData, "description");

  if (!nom) {
    return;
  }

  await prisma.formation.create({
    data: {
      nom,
      description: description || null,
    },
  });

  revaliderSite();
}

// UPDATE (id fixé avec .bind dans la page)
export async function updateFormation(id: number, formData: FormData) {
  const nom = lireTexte(formData, "nomFormation");
  const description = lireTexte(formData, "description");

  if (!nom) {
    return;
  }

  await prisma.formation.update({
    where: { id },
    data: {
      nom,
      description: description || null,
    },
  });

  revaliderSite();
}

// DELETE
// Les cours ont une clé étrangère obligatoire vers la formation :
// on les supprime d'abord, dans une transaction (tout réussit ou rien).
// Les liens avec les étudiants (N à N) sont supprimés automatiquement.
export async function deleteFormation(id: number) {
  await prisma.$transaction([
    prisma.cours.deleteMany({ where: { formationId: id } }),
    prisma.formation.delete({ where: { id } }),
  ]);

  revaliderSite();
}


// ----- Cours d'une formation (relation 1 à N) -----

export async function createCours(formationId: number, formData: FormData) {
  const titre = lireTexte(formData, "titre");

  if (!titre) {
    return;
  }

  await prisma.cours.create({
    data: {
      titre,
      formationId,
    },
  });

  revaliderSite();
}

export async function deleteCours(id: number) {
  await prisma.cours.delete({ where: { id } });

  revaliderSite();
}


// ==========================================================
// B — ÉTUDIANTS
// ==========================================================

// CREATE
// N à N : connect relie l'étudiant aux formations cochées.
// 1 à 0..1 : si une biographie est saisie, on crée son profil en même temps.
export async function createEtudiant(formData: FormData) {
  const nom = lireTexte(formData, "nomEtudiant");
  const bio = lireTexte(formData, "bio");
  const formationIds = lireIds(formData, "formations");

  if (!nom) {
    return;
  }

  await prisma.etudiant.create({
    data: {
      nom,
      formations: {
        connect: formationIds.map((id) => ({ id })),
      },
      profil: bio ? { create: { bio } } : undefined,
    },
  });

  revaliderSite();
}

// UPDATE
// set remplace TOUTE la liste des formations par celles qui sont cochées.
// upsert : met à jour le profil s'il existe, sinon le crée.
export async function updateEtudiant(id: number, formData: FormData) {
  const nom = lireTexte(formData, "nomEtudiant");
  const bio = lireTexte(formData, "bio");
  const formationIds = lireIds(formData, "formations");

  if (!nom) {
    return;
  }

  await prisma.etudiant.update({
    where: { id },
    data: {
      nom,
      formations: {
        set: formationIds.map((formationId) => ({ id: formationId })),
      },
      profil: bio
        ? { upsert: { create: { bio }, update: { bio } } }
        : undefined,
    },
  });

  // Biographie vidée : on retire le profil.
  if (!bio) {
    await prisma.profil.deleteMany({ where: { etudiantId: id } });
  }

  revaliderSite();
}

// DELETE
// Le profil a une clé étrangère obligatoire vers l'étudiant : on le supprime d'abord.
export async function deleteEtudiant(id: number) {
  await prisma.$transaction([
    prisma.profil.deleteMany({ where: { etudiantId: id } }),
    prisma.etudiant.delete({ where: { id } }),
  ]);

  revaliderSite();
}
