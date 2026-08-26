import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddArticleDrawer({
  open,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <>
      {/* Hintergrund */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-zinc-950 border-t border-zinc-800 p-6 max-h-[90vh] overflow-y-auto">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold text-white">
            Artikel hinzufügen
          </h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-zinc-800"
          >
            <X />
          </button>

        </div>

        {/* Bild */}

        <button className="mb-6 flex h-32 w-full items-center justify-center rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-900 text-zinc-400">
          📷 Bild auswählen
        </button>

        {/* Name */}

        <div className="mb-4">
          <label className="mb-2 block text-sm text-zinc-400">
            Name
          </label>

          <input
            className="w-full rounded-xl bg-zinc-900 border border-zinc-700 p-4 text-white outline-none focus:border-violet-500"
            placeholder="z.B. Sofa"
          />
        </div>

        {/* Preis */}

        <div className="mb-6">
          <label className="mb-2 block text-sm text-zinc-400">
            Preis
          </label>

          <input
            type="number"
            className="w-full rounded-xl bg-zinc-900 border border-zinc-700 p-4 text-white outline-none focus:border-violet-500"
            placeholder="699"
          />
        </div>

        {/* Platzhalter */}

        <div className="rounded-2xl bg-zinc-900 p-4 text-center text-zinc-500">
          🇦🇹 Land • Raum • Priorität • Status
          <br />
          (bauen wir als Nächstes)
        </div>

        <button className="mt-8 w-full rounded-xl bg-violet-600 p-4 font-semibold text-white">
          Speichern
        </button>

      </div>
    </>
  );
}