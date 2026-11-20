// Titre et sous-titre en haut des pages intérieures (même style partout).
export default function EnTete({
  titre,
  description,
}: {
  titre: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-college-fonce">{titre}</h1>
      <p className="mt-2 text-slate-600">{description}</p>
    </div>
  );
}
