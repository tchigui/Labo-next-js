// Message affiché pendant que la page attend la base de données.
export default function Chargement({ texte }: { texte: string }) {
  return (
    <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-16 text-slate-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-college" />
      {texte}
    </div>
  );
}
