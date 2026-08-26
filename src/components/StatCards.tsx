import { Wallet, CheckCircle2, Circle } from "lucide-react";

type Props = {
  budget: number;
  spent: number;
  saved: number;
  bought: number;
  openCount: number;
  progress: number;
};

export default function StatCards({
  budget,
  spent,
  saved,
  bought,
  openCount,
  progress,
}: Props) {
  return (
    <div className="px-4 mt-4">
      <div className="rounded-2xl border border-violet-500/20 bg-zinc-900 p-4">

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-400">
              Budget
            </p>

            <h2 className="mt-1 text-3xl font-bold text-white">
              {budget.toFixed(2)} €
            </h2>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400">
            <Wallet size={22} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">

          <div className="flex justify-between">
            <span className="text-zinc-400">Ist</span>
            <span className="font-semibold">{spent.toFixed(2)} €</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Gespart</span>
            <span className="font-semibold text-green-400">{saved.toFixed(2)} €</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-zinc-400">
              <CheckCircle2 size={14} />
              Gekauft
            </span>

            <span className="font-semibold">{bought}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-zinc-400">
              <Circle size={14} />
              Offen
            </span>

            <span className="font-semibold">{openCount}</span>
          </div>

        </div>

        <div className="mt-4">

  <div className="mb-2 flex items-center justify-between text-xs">
    <span className="text-zinc-400">
      Fortschritt
    </span>

    <span className="font-medium text-violet-400">
      {progress} %
    </span>
  </div>

  <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
    <div
  className="h-full rounded-full bg-violet-500"
  style={{ width: `${progress}%` }}
/>
  </div>

</div>

      </div>
    </div>
  );
}