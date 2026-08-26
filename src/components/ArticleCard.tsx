import {
  Pencil,
  Circle,
  CheckCircle2,
} from "lucide-react";

type Article = {
  name: string;
  room: string;
  country: "AT" | "XK";
  price: number;
  priority: 0 | 1 | 2 | 3;
  status: "offen" | "gekauft";
  image: string;
};

type Props = {
  article: Article;
};

export default function ArticleCard({ article }: Props) {
  const priority = [
    {
      text: "P0",
      className: "bg-red-500/15 text-red-400",
    },
    {
      text: "P1",
      className: "bg-orange-500/15 text-orange-400",
    },
    {
      text: "P2",
      className: "bg-yellow-500/15 text-yellow-400",
    },
    {
      text: "P3",
      className: "bg-green-500/15 text-green-400",
    },
  ];

  return (
    <div className="mx-4 rounded-3xl border border-zinc-800 bg-zinc-900 p-3">

      <div className="flex gap-4">

        <img
          src={article.image}
          alt={article.name}
          className="h-24 w-24 rounded-2xl object-cover bg-zinc-800"
        />

        <div className="flex flex-1 flex-col">

          <div className="flex items-start justify-between">

            <div>
              <h3 className="text-lg font-semibold text-white">
                {article.name}
              </h3>

              <p className="mt-1 text-sm text-zinc-400">
                🛋 {article.room}
              </p>
            </div>

            <button className="rounded-xl p-2 hover:bg-zinc-800 transition">
              <Pencil
                size={18}
                className="text-zinc-300"
              />
            </button>

          </div>

          <div className="mt-3 flex flex-wrap gap-2">

            <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-white">
              {article.country === "AT" ? "🇦🇹 AT" : "🇽🇰 XK"}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                priority[article.priority].className
              }`}
            >
              {priority[article.priority].text}
            </span>

            {article.status === "offen" ? (
              <span className="flex items-center gap-1 rounded-full bg-orange-500/15 px-3 py-1 text-xs font-medium text-orange-400">
                <Circle size={11} />
                Offen
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-400">
                <CheckCircle2 size={11} />
                Gekauft
              </span>
            )}

          </div>

          <div className="mt-auto pt-4">

            <p className="text-2xl font-bold text-violet-400">
              {article.price.toFixed(2)} €
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}