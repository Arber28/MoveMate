type Props = {
  selected: string[];
  onOpen: () => void;
};

export default function Filters({
  selected,
  onOpen,
}: Props) {
  return (
    <div className="px-5 mt-4">
      <button
        onClick={onOpen}
        className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left transition hover:border-violet-500"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">
              Filter
            </p>

            <p className="text-sm text-zinc-400">
              {selected.length === 0
                ? "Keine Filter aktiv"
                : `${selected.length} Filter aktiv`}
            </p>
          </div>

          <div className="rounded-xl bg-violet-500/20 px-3 py-1 text-violet-400">
            Öffnen
          </div>
        </div>
      </button>
    </div>
  );
}