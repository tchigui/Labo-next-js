import EnTete from "@/components/EnTete";

// Route "/contact" : coordonnées + formulaire (contenu statique).
const COORDONNEES = [
  { titre: "Adresse", valeur: "123, rue du Collège" },
  { titre: "Téléphone", valeur: "418-555-1234" },
  { titre: "Courriel", valeur: "info@collegeabc.ca" },
];

const CHAMP = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-college focus:outline-none focus:ring-2 focus:ring-college-clair";

export default function Contact() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">

      <EnTete
        titre="Contact"
        description="Vous avez une question ? Contactez-nous."
      />

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Coordonnées */}
        <div className="space-y-4">
          {COORDONNEES.map((item) => (
            <div key={item.titre} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase text-slate-500">{item.titre}</p>
              <p className="mt-1 font-semibold text-college-fonce">{item.valeur}</p>
            </div>
          ))}
        </div>

        {/* Formulaire : l'envoi ouvre le logiciel de courriel (l'envoi réel est facultatif) */}
        <form
          action="mailto:info@collegeabc.ca"
          method="post"
          encType="text/plain"
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="nom" className="mb-1 block text-sm font-semibold">Nom</label>
              <input id="nom" name="nom" type="text" required className={CHAMP} />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-semibold">Courriel</label>
              <input id="email" name="email" type="email" required className={CHAMP} />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-semibold">Message</label>
            <textarea id="message" name="message" rows={5} required className={CHAMP} />
          </div>

          <button type="submit" className="rounded-lg bg-college px-5 py-2 text-sm font-semibold text-white hover:bg-college-fonce">
            Envoyer
          </button>
        </form>

      </div>

    </section>
  );
}
