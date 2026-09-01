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
  {filteredItems.map((item) => {
  const currentPrice =
    item.status === "gekauft"
      ? item.paid_price ?? item.price
      : item.price;

  return (
  <div
    key={item.id}
    className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-3"
  >
    <img
      src={
        item.image_url ||
        "https://placehold.co/80x80/27272a/ffffff?text=%F0%9F%93%A6"
      }
      alt={item.title}
      className="h-20 w-20 rounded-xl object-cover"
    />

    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <h2 className="truncate font-semibold text-white">
          {item.title}
        </h2>

        <span className="rounded-full bg-violet-500/15 px-2 py-1 text-xs text-violet-400">
          {item.priority}
        </span>
      </div>

      <p className="mt-1 text-sm text-zinc-400">
        {item.room}
      </p>

      <div className="mt-2 flex items-center gap-3 text-sm">
        <span className="font-bold text-violet-400">
          {currentPrice.toFixed(2)} €
        </span>

        <span>
          {item.country === "AT"
            ? "🇦🇹"
            : "🇽🇰"}
        </span>

        <span
          className={
            item.status === "gekauft"
              ? "text-green-400"
              : "text-yellow-400"
          }
        >
          {item.status === "gekauft"
            ? "✔ Gekauft"
            : "🛒 Offen"}
        </span>
      </div>
    </div>

    <div className="flex flex-col gap-2">
      <button
        onClick={() => {
          setSelectedItem(item);
          setDrawerOpen(true);
        }}
        className="rounded-lg bg-zinc-800 p-2 hover:bg-zinc-700"
      >
        <Pencil size={18} />
      </button>

      <button
        onClick={() => deleteItem(item.id)}
        className="rounded-lg bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
      >
        <Trash2 size={18} />
      </button>
    </div>
  </div>
);
})}
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