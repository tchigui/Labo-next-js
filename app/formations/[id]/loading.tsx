import Chargement from "@/components/Chargement";

// loading.tsx : affiché par Next.js pendant que page.tsx lit la base.
export default function Loading() {
  return <Chargement texte="Chargement de la formation..." />;
}
