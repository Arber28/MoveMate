import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import PivotTable from "../components/PivotTable";

import BottomBar from "../components/BottomBar";

type Position = {
  id: number;
  title: string;
  price: number;
  paid_price: number | null;
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

type PivotPosition = Position & {
  room: string;
  project: string;
  priority: string;
};

export default function Pivot() {
  const [projects, setProjects] = useState<Project[]>([]);

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        positions(*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setProjects(data || []);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const positions: PivotPosition[] = projects.flatMap((project) =>
    project.positions.map((position) => ({
      ...position,
      room: project.room,
      project: project.name,
      priority: project.priority,
    }))
  );

  return (
  <div className="min-h-screen bg-zinc-950 pb-24 text-white">
    <div className="px-6 pt-[env(safe-area-inset-top)]">
      <h1 className="mb-6 text-3xl font-bold">
        Pivot
      </h1>

      <PivotTable
        positions={positions}
        status="offen"
      />

      <div className="h-8" />

      <PivotTable
        positions={positions}
        status="gekauft"
      />
    </div>

    <BottomBar onAdd={() => {}} />
  </div>
);
}