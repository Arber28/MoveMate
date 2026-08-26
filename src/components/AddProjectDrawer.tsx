import { X, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

type Project = {
  id: number;
  name: string;
  room: string;
  priority: string;
  positions: Position[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  project: Project | null;
};

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

export default function AddProjectDrawer({
  open,
  onClose,
  project,
}: Props) {

const [positions, setPositions] = useState<Position[]>([
  {
    id: 1,
    title: "",
    link: "",
    price: 0,
    paid_price: null,
    country: "AT",
    status: "offen",
    image_url: "",
  },
]);



const addPosition = () => {
  setPositions((prev) => [
    ...prev,
    {
  id: Date.now(),
  title: "",
  link: "",
  price: 0,
  paid_price: null,
  country: "AT",
  status: "offen",
  image_url: "",
},
  ]);
};

const removePosition = (id: number) => {
  if (positions.length === 1) return;

  setPositions((prev) => prev.filter((p) => p.id !== id));
};

const updatePosition = <K extends keyof Position>(
  id: number,
  field: K,
  value: Position[K]
) => {
  setPositions((prev) =>
    prev.map((position) =>
      position.id === id
        ? { ...position, [field]: value }
        : position
    )
  );
};

const uploadImage = async (
  id: number,
  file: File
) => {
  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("position-images")
    .upload(fileName, file);

  if (error) {
    alert(error.message);
    return;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("position-images")
    .getPublicUrl(fileName);

  updatePosition(id, "image_url", publicUrl);
};

const totalPrice = positions.reduce(
  (sum, position) => sum + position.price,
  0
);


const saveProject = async () => {
  if (project) {
    // Projekt aktualisieren
    const { error } = await supabase
      .from("projects")
      .update({
        name: projectName,
        room: selectedRoom,
        priority: priority,
        total_price: totalPrice,
      })
      .eq("id", project.id);

    if (error) {
      alert(error.message);
      return;
    }

    

    // Alte Positionen löschen
    await supabase
      .from("positions")
      .delete()
      .eq("project_id", project.id);

    // Neue Positionen speichern
    const { error: positionsError } = await supabase
      .from("positions")
      .insert(
        positions.map((position) => ({
          project_id: project.id,
          title: position.title,
          link: position.link,
          price: position.price,
          paid_price: position.paid_price,
          country: position.country,
          status: position.status,
          image_url: position.image_url,
        }))
      );

    if (positionsError) {
      alert(positionsError.message);
      return;
    }

    alert("Projekt aktualisiert!");
    onClose();
    return;
  }

  // Neues Projekt erstellen
const { data: newProject, error: projectError } = await supabase
  .from("projects")
  .insert({
    name: projectName,
    room: selectedRoom,
    priority: priority,
    total_price: totalPrice,
  })
  .select()
  .single();

if (projectError) {
  alert(projectError.message);
  return;
}

// Positionen speichern
const { error: positionsError } = await supabase
  .from("positions")
  .insert(
    positions.map((position) => ({
      project_id: newProject.id,
      title: position.title,
      link: position.link,
      price: position.price,
      paid_price: position.paid_price,
      country: position.country,
      status: position.status,
      image_url: position.image_url,
    }))
  );

if (positionsError) {
  alert(positionsError.message);
  return;
}

alert("Projekt erfolgreich gespeichert!");
onClose();
};

const [selectedRoom, setSelectedRoom] = useState("🛋 Wohnzimmer");
const [priority, setPriority] = useState("P0");

const [projectName, setProjectName] = useState("");


useEffect(() => {
  if (!project) return;

  setProjectName(project.name);
  setSelectedRoom(project.room);
  setPriority(project.priority);
  setPositions(project.positions);
}, [project]);

  if (!open) return null;

  return (
    <>
      {/* Hintergrund */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-[92vh] flex-col rounded-t-3xl border-t border-zinc-800 bg-zinc-950">

        {/* Header */}

        <div className="sticky top-0 flex items-center justify-between border-b border-zinc-800 bg-zinc-950 p-5">

          <h2 className="text-xl font-bold text-white">
  {project ? "Projekt bearbeiten" : "Neues Projekt"}
</h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-zinc-800"
          >
            <X />
          </button>

        </div>

        {/* Inhalt */}

        <div className="flex-1 space-y-6 overflow-y-auto p-5 pb-40">

          <div className="space-y-6">

  {/* Projektname */}

  <div>
    <p className="mb-2 text-sm font-medium text-zinc-400">
      Projektname
    </p>

    <input
  value={projectName}
  onChange={(e) => setProjectName(e.target.value)}
  placeholder="z.B. Wohnzimmer"
  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-white outline-none transition focus:border-violet-500"
/>

  </div>

  {/* Raum */}

  <div>
    <p className="mb-3 text-sm font-medium text-zinc-400">
      Raum
    </p>

    <div className="grid grid-cols-2 gap-2">

      {[
  "🛋 Wohnzimmer",
  "🍳 Küche",
  "🛏 Schlafzimmer",
  "🚿 Bad",
  "🚪 Vorraum",
  "📦 Abstellraum",
  "💼 Büro",
  "➕ Flur",
].map((room) => (
  <button
    key={room}
    onClick={() => setSelectedRoom(room)}
    className={`rounded-2xl border py-3 text-sm transition ${
      selectedRoom === room
        ? "border-violet-500 bg-violet-500/15 text-violet-400"
        : "border-zinc-800 bg-zinc-900 hover:border-violet-500"
    }`}
  >
    {room}
  </button>
))}

    </div>
  </div>

  {/* Priorität */}

   <div>
  <p className="mb-3 text-sm font-medium text-zinc-400">
    Priorität
  </p>

  <div className="grid grid-cols-4 gap-2">
    {["P0", "P1", "P2", "P3"].map((p) => (
      <button
        key={p}
        onClick={() => setPriority(p)}
        className={`rounded-2xl border py-3 font-semibold transition ${
          priority === p
            ? "border-violet-500 bg-violet-500/15 text-violet-400"
            : "border-zinc-800 bg-zinc-900 hover:border-violet-500"
        }`}
      >
        {p}
      </button>
    ))}
  </div>
</div>


</div>

          <div className="space-y-5">

            <hr className="border-zinc-800" />

  <div className="flex items-center justify-between">
  <h3 className="text-lg font-semibold">
    Positionen
  </h3>

  <span className="rounded-full bg-violet-500/15 px-3 py-1 text-sm text-violet-400">
  {positions.length} {positions.length === 1 ? "Position" : "Positionen"}
</span>
</div>

  {positions.map((position, index) => (
  <div
    key={position.id}
    className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4"
  >

    <div className="mb-4 flex items-center justify-between">

  <h4 className="font-semibold">
    Position {index + 1}
  </h4>

  {positions.length > 1 && (
    <button
      onClick={() => removePosition(position.id)}
      className="rounded-full p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
    >
      <Trash2 size={18} />
    </button>
  )}

</div>

    {/* Bild */}

    <div className="mb-4">
  <label className="flex h-28 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-zinc-700 transition hover:border-violet-500">

    {position.image_url ? (
      <img
        src={position.image_url}
        alt={position.title}
        className="h-full w-full object-cover"
      />
    ) : (
      <span className="text-zinc-500">
        📷 Bild hinzufügen
      </span>
    )}

    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        if (e.target.files?.[0]) {
          uploadImage(position.id, e.target.files[0]);
        }
      }}
    />
  </label>
</div>

    {/* Bezeichnung */}

    <div className="mb-4">
      <p className="mb-2 text-sm text-zinc-400">
        Bezeichnung
      </p>

      <input
  value={position.title}
  onChange={(e) =>
    updatePosition(position.id, "title", e.target.value)
  }
  placeholder="z.B. Sofa"
  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 outline-none focus:border-violet-500"
/>

</div>

    {/* Link */}

    <div className="mb-4">
  <p className="mb-2 text-sm text-zinc-400">
    Link
  </p>

  <input
    value={position.link}
    onChange={(e) =>
      updatePosition(position.id, "link", e.target.value)
    }
    placeholder="https://..."
    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 outline-none focus:border-violet-500"
  />
</div>

    {/* Preis */}

    <div className="mb-4">
      <p className="mb-2 text-sm text-zinc-400">
        Preis
      </p>

      <input
  type="number"
  value={position.price}
  onChange={(e) =>
    updatePosition(
      position.id,
      "price",
      Number(e.target.value)
    )
  }
  placeholder="0"
  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 outline-none focus:border-violet-500"
/>
    </div>

    {/* Kaufort */}

    <div className="mb-4">
      <p className="mb-2 text-sm text-zinc-400">
        Kaufort
      </p>

      <div className="grid grid-cols-2 gap-2">

        <button
  onClick={() => updatePosition(position.id, "country", "AT")}
  className={`rounded-xl border py-3 ${
    position.country === "AT"
      ? "border-violet-500 bg-violet-500/15 text-violet-400"
      : "border-zinc-800 bg-zinc-950"
  }`}
>
  🇦🇹 Österreich
</button>

        <button
  onClick={() => updatePosition(position.id, "country", "XK")}
  className={`rounded-xl border py-3 ${
    position.country === "XK"
      ? "border-violet-500 bg-violet-500/15 text-violet-400"
      : "border-zinc-800 bg-zinc-950"
  }`}
>
  🇽🇰 Kosovo
</button>

      </div>

    </div>

    {/* Status */}

    <div>
  <p className="mb-2 text-sm text-zinc-400">
    Status
  </p>

  <div className="grid grid-cols-2 gap-2">
    <button
      onClick={() => updatePosition(position.id, "status", "offen")}
      className={`rounded-xl border py-3 ${
        position.status === "offen"
          ? "border-violet-500 bg-violet-500/15 text-violet-400"
          : "border-zinc-800 bg-zinc-950"
      }`}
    >
      Offen
    </button>

    <button
      onClick={() => updatePosition(position.id, "status", "gekauft")}
      className={`rounded-xl border py-3 ${
        position.status === "gekauft"
          ? "border-violet-500 bg-violet-500/15 text-violet-400"
          : "border-zinc-800 bg-zinc-950"
      }`}
    >
      Gekauft
    </button>
  </div>

  {position.status === "gekauft" && (
    <div className="mt-4">
      <p className="mb-2 text-sm text-zinc-400">
        Tatsächlich bezahlt
      </p>

      <input
        type="number"
        value={position.paid_price ?? ""}
        onChange={(e) =>
  updatePosition(
    position.id,
    "paid_price",
    e.target.value === "" ? null : Number(e.target.value)
  )
}
        placeholder="z.B. 10"
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 outline-none focus:border-violet-500"
      />
    </div>
  )}
</div>

  </div>
))}

  {/* Weitere Position */}

  <button
  onClick={addPosition}
  className="w-full rounded-2xl border border-dashed border-violet-500 py-4 font-medium text-violet-400 transition hover:bg-violet-500/10"
>
  ➕ Weitere Position hinzufügen
</button>

  {/* Gesamt */}

  <div className="flex items-center justify-between rounded-2xl bg-zinc-900 p-4">

    <span className="text-zinc-400">
      Gesamtpreis
    </span>

    <span className="text-2xl font-bold text-violet-400">
  {totalPrice.toFixed(2)} €
</span>

  </div>

</div>

        </div>

        {/* Footer */}

        <div className="border-t border-zinc-800 bg-zinc-950 p-5">

          <button
  onClick={saveProject}
  className="w-full rounded-2xl bg-violet-600 py-4 font-semibold text-white"
>
  {project ? "Projekt aktualisieren" : "Projekt speichern"}
</button>

        </div>

      </div>
    </>



  );
};