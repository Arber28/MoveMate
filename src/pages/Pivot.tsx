import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import PivotTable from "../components/PivotTable";
import BottomBar from "../components/BottomBar";

type PivotPosition = {
  id: number;
  title: string;
  room: string;
  priority: string;
  price: number;
  paid_price: number | null;
  status: "offen" | "gekauft";
  image_url: string;
};

export default function Pivot() {
  const [positions, setPositions] = useState<PivotPosition[]>([]);

  const loadItems = async () => {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setPositions(data || []);
  };

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 pb-24 text-white">
      <div
        className="px-6"
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 20px)",
        }}
      >
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