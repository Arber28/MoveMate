import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import StatCards from "../components/StatCards";
import Filters from "../components/Filters";
import BottomBar from "../components/BottomBar";
import AddItemDrawer from "../components/AddItemDrawer";
import FilterDrawer from "../components/FilterDrawer";
import { Pencil, Trash2 } from "lucide-react";

type Item = {
  id: number;
  title: string;
  room: string;
  priority: string;
  link: string;
  price: number;
  paid_price: number | null;
  country: "AT" | "XK";
  status: "offen" | "gekauft";
  image_url: string;
};

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const [items, setItems] = useState<Item[]>([]); 

  const [search, setSearch] = useState("");

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);


  const [filterOpen, setFilterOpen] = useState(false);

  const loadItems = async () => {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setItems(data || []);
};

const deleteItem = async (id: number) => {
  if (!confirm("Produkt wirklich löschen?")) return;

  const { error } = await supabase
    .from("items")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  loadItems();
};

useEffect(() => {
  loadItems();
}, []);

const priorityFilters = selectedFilters.filter((f) =>
  ["P0", "P1", "P2", "P3"].includes(f)
);

const roomFilters = selectedFilters.filter((f) =>
  ["Wohnzimmer", "Küche", "Schlafzimmer", "Bad"].includes(f)
);

const statusFilters = selectedFilters.filter((f) =>
  ["offen", "gekauft"].includes(f)
);

const filteredItems = items.filter((item) => {
  const matchesSearch =
    item.title.toLowerCase().includes(search.toLowerCase());

  const matchesPriority =
    priorityFilters.length === 0 ||
    priorityFilters.includes(item.priority);

  const matchesRoom =
    roomFilters.length === 0 ||
    roomFilters.some((r) => item.room.includes(r));

  const matchesStatus =
    statusFilters.length === 0 ||
    statusFilters.includes(item.status);

  return (
    matchesSearch &&
    matchesPriority &&
    matchesRoom &&
    matchesStatus
  );
});

const budget = filteredItems.reduce(
  (sum, item) => sum + item.price,
  0
);

const spent = filteredItems.reduce(
  (sum, item) =>
    sum +
    (item.status === "gekauft"
      ? item.paid_price ?? item.price
      : 0),
  0
);

const saved = filteredItems.reduce(
  (sum, item) => {
    if (
      item.status !== "gekauft" ||
      item.paid_price == null
    )
      return sum;

    return sum + (item.price - item.paid_price);
  },
  0
);

const bought = filteredItems.filter(
  (i) => i.status === "gekauft"
).length;

const openCount = filteredItems.filter(
  (i) => i.status === "offen"
).length;

const progress =
  items.length === 0
    ? 0
    : Math.round((bought / items.length) * 100);

  return (


    
    <div className="min-h-screen bg-zinc-950 pb-24 text-white">
      <Header />

      <SearchBar
  value={search}
  onChange={setSearch}
/>

<StatCards
  budget={budget}
  spent={spent}
  saved={saved}
  bought={bought}
  openCount={openCount}
  progress={progress}
/>

<Filters
  selected={selectedFilters}
  onOpen={() => setFilterOpen(true)}
/>

<div className="mt-4 space-y-4 px-5">
  {filteredItems.map((item) => (
    <div
      key={item.id}
      className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900"
    >
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.title}
          className="h-56 w-full object-cover"
        />
      )}

      <div className="p-5">

        <div className="flex items-start justify-between">

          <div>
            <h2 className="text-xl font-bold">
              {item.title}
            </h2>

            <p className="mt-1 text-zinc-400">
              {item.room}
            </p>
          </div>

          <span className="rounded-full bg-violet-500/15 px-3 py-1 text-violet-400">
            {item.priority}
          </span>

        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">

          <div className="rounded-2xl bg-zinc-950 p-4">
            <p className="text-zinc-500">Preis</p>

            <p className="mt-1 text-lg font-bold text-violet-400">
              {item.price.toFixed(2)} €
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-950 p-4">
            <p className="text-zinc-500">Status</p>

            <p className="mt-1 font-semibold">
              {item.status === "gekauft"
                ? "✅ Gekauft"
                : "🛒 Offen"}
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-950 p-4">
            <p className="text-zinc-500">Kaufort</p>

            <p className="mt-1">
              {item.country === "AT"
                ? "🇦🇹 Österreich"
                : "🇽🇰 Kosovo"}
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-950 p-4">
            <p className="text-zinc-500">Bezahlt</p>

            <p className="mt-1">
              {item.paid_price == null
                ? "-"
                : `${item.paid_price.toFixed(2)} €`}
            </p>
          </div>

        </div>

        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="mt-5 block rounded-2xl bg-violet-600 py-3 text-center font-semibold transition hover:bg-violet-500"
          >
            Zum Produkt
          </a>
        )}

        <div className="mt-5 flex gap-3">

          <button
            onClick={() => {
              setSelectedItem(item);
              setDrawerOpen(true);
            }}
            className="flex-1 rounded-2xl bg-zinc-800 py-3"
          >
            <Pencil className="mx-auto" size={18} />
          </button>

          <button
            onClick={() => deleteItem(item.id)}
            className="flex-1 rounded-2xl bg-red-500/10 py-3 text-red-400"
          >
            <Trash2 className="mx-auto" size={18} />
          </button>

        </div>

      </div>
    </div>
  ))}
</div>

<BottomBar
  onAdd={() => {
    setSelectedItem(null);
    setDrawerOpen(true);
  }}
/>

<AddItemDrawer
  open={drawerOpen}
  item={selectedItem}
  onClose={() => {
    setDrawerOpen(false);
    loadItems();
  }}
/>
  
<FilterDrawer
  open={filterOpen}
  onClose={() => setFilterOpen(false)}
  selected={selectedFilters}
  onSelect={setSelectedFilters}
/>

    </div>
  );
}