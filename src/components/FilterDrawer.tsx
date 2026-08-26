import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  selected: string[];
  onSelect: React.Dispatch<React.SetStateAction<string[]>>;
};

const filterGroups = [
  {
    title: "🏠 Raum",
    filters: [
      { label: "Wohnzimmer", value: "Wohnzimmer" },
      { label: "Küche", value: "Küche" },
      { label: "Schlafzimmer", value: "Schlafzimmer" },
      { label: "Bad", value: "Bad" },
      { label: "Vorraum", value: "Vorraum" },
      { label: "Abstellraum", value: "Abstellraum" },
      { label: "Büro", value: "Büro" },
      { label: "Waschküche", value: "Waschküche" },
      { label: "Balkon", value: "Balkon" },
      { label: "Garten", value: "Garten" },
    ],
  },

  {
    title: "🔥 Priorität",
    filters: [
      { label: "P0", value: "P0" },
      { label: "P1", value: "P1" },
      { label: "P2", value: "P2" },
      { label: "P3", value: "P3" },
    ],
  },

  {
    title: "📦 Status",
    filters: [
      { label: "Offen", value: "offen" },
      { label: "Gekauft", value: "gekauft" },
    ],
  },

  {
    title: "🌍 Kaufort",
    filters: [
      { label: "🇦🇹 Österreich", value: "AT" },
      { label: "🇽🇰 Kosovo", value: "XK" },
    ],
  },
];

export default function FilterDrawer({
  open,
  onClose,
  selected,
  onSelect,
}: Props) {
  if (!open) return null;

  const toggleFilter = (filter: string) => {
    if (selected.includes(filter)) {
      onSelect(selected.filter((f) => f !== filter));
    } else {
      onSelect([...selected, filter]);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-zinc-800 bg-zinc-950 p-6">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Filter
          </h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-zinc-800"
          >
            <X />
          </button>
        </div>

        <div className="space-y-6">
          {filterGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-3 text-sm font-semibold text-zinc-400">
                {group.title}
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {group.filters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => toggleFilter(filter.value)}
                    className={`rounded-2xl border py-3 transition ${
                      selected.includes(filter.value)
                        ? "border-violet-500 bg-violet-500/15 text-violet-400"
                        : "border-zinc-800 bg-zinc-900 text-white"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => onSelect([])}
          className="mt-8 w-full rounded-2xl border border-red-500 py-3 font-medium text-red-400 transition hover:bg-red-500/10"
        >
          Alle Filter zurücksetzen
        </button>
      </div>
    </>
  );
}