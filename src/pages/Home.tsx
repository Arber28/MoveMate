import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import StatCards from "../components/StatCards";
import Filters from "../components/Filters";
import BottomBar from "../components/BottomBar";
import AddProjectDrawer from "../components/AddProjectDrawer";
import FilterDrawer from "../components/FilterDrawer";
import { Pencil, Trash2 } from "lucide-react";

type Position = {
  id: number;
  title: string;
  link: string;
  price: number;
  paid_price: number | null;
  country: "AT" | "XK";
  status: "offen" | "gekauft";
  image_url: string;
};

type Project = {
  id: number;
  name: string;
  room: string;
  priority: string;
  total_price: number;
  positions: Position[];
};

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);

  const [search, setSearch] = useState("");

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);


  const [filterOpen, setFilterOpen] = useState(false);

  const loadProjects = async () => {
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      positions (*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setProjects(data || []);
};

const deleteProject = async (id: number) => {
  if (!confirm("Projekt wirklich löschen?")) return;

  await supabase
    .from("positions")
    .delete()
    .eq("project_id", id);

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  loadProjects();
};

useEffect(() => {
  loadProjects();
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

const filteredProjects = projects
  .map((project) => {
    const matchesPriority =
      priorityFilters.length === 0 ||
      priorityFilters.includes(project.priority);

    const matchesRoom =
      roomFilters.length === 0 ||
      roomFilters.some((room) => project.room.includes(room));

    if (!matchesPriority || !matchesRoom) return null;

    const positions = project.positions.filter((position) => {
      const matchesSearch =
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        position.title.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (
        statusFilters.length > 0 &&
        !statusFilters.includes(position.status)
      ) {
        return false;
      }

      return true;
    });

    if (positions.length === 0) return null;

    return {
      ...project,
      positions,
      total_price: positions.reduce(
        (sum, p) => sum + p.price,
        0
      ),
    };
  })
  .filter(Boolean) as Project[];

const budget = filteredProjects.reduce(
  (sum, project) => sum + project.total_price,
  0
);

const spent = filteredProjects.reduce(
  (sum, project) =>
    sum +
    project.positions
      .filter((p) => p.status === "gekauft")
      .reduce((s, p) => s + (p.paid_price ?? p.price), 0),
  0
);

const saved = filteredProjects.reduce(
  (sum, project) =>
    sum +
    project.positions.reduce((s, p) => {
      if (p.status !== "gekauft" || p.paid_price === null) return s;

      return s + (p.price - p.paid_price);
    }, 0),
  0
);



const bought = filteredProjects.reduce(
  (sum, project) =>
    sum +
    project.positions.filter((p) => p.status === "gekauft").length,
  0
);

const openCount = filteredProjects.reduce(
  (sum, project) =>
    sum +
    project.positions.filter((p) => p.status === "offen").length,
  0
);

const totalPositions = bought + openCount;

const progress =
  totalPositions === 0
    ? 0
    : Math.round((bought / totalPositions) * 100);

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
  {filteredProjects.map((project) => (
    <div
      key={project.id}
      className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5"
    >
      <div className="flex items-start justify-between">
  <div>
    <h2 className="text-xl font-bold">
      {project.name}
    </h2>

    <p className="mt-2 text-zinc-400">
      {project.room}
    </p>
  </div>

  <div className="flex items-center gap-2">

    <button
  onClick={() => {
    setSelectedProject(project);
    setDrawerOpen(true);
  }}
  className="rounded-xl bg-zinc-800 p-2"
>
  <Pencil size={18}/>
</button>

<button
  onClick={() => deleteProject(project.id)}
  className="rounded-xl bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20"
>
  <Trash2 size={18} />
</button>

    <span className="rounded-full bg-violet-500/15 px-3 py-1 text-violet-400">
      {project.priority}
    </span>

  </div>
</div>

      <div className="mt-5 space-y-2">
        {project.positions.map((position) => (
          <div
            key={position.id}
            className="flex items-center justify-between rounded-xl bg-zinc-950 p-3"
          >
            <div className="flex items-center gap-3">
  {position.image_url && (
    <img
      src={position.image_url}
      alt={position.title}
      className="h-16 w-16 rounded-xl object-cover"
    />
  )}

  <div>
    <p className="font-medium">{position.title}</p>

    <p className="text-sm text-zinc-500">
      {position.country} • {position.status}
    </p>
  </div>
</div>

            <div className="text-right">
  <p className="font-semibold text-violet-400">
    {position.price.toFixed(2)} €
  </p>

  {position.status === "gekauft" &&
    position.paid_price !== null && (
      <p className="text-sm text-green-400">
        Bezahlt: {position.paid_price.toFixed(2)} €
      </p>
    )}
</div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-between border-t border-zinc-800 pt-4">
        <span className="text-zinc-400">Gesamt</span>

        <span className="text-2xl font-bold text-violet-400">
          {project.total_price.toFixed(2)} €
        </span>
      </div>
    </div>
  ))}
</div>

      <BottomBar
  onAdd={() => {
    setSelectedProject(null);
    setDrawerOpen(true);
  }}
/>

      <AddProjectDrawer
  open={drawerOpen}
  project={selectedProject}
  onClose={() => {
    setDrawerOpen(false);
    loadProjects();
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