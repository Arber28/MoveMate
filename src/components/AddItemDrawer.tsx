import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "../lib/supabase";

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

type Props = {
  open: boolean;
  onClose: () => void;
  item: Item | null;
};

export default function AddItemDrawer({
  open,
  onClose,
  item,
}: Props) {
  const [title, setTitle] = useState("");
const [link, setLink] = useState("");
const [price, setPrice] = useState(0);
const [paidPrice, setPaidPrice] = useState<number | null>(null);
const [country, setCountry] = useState<"AT" | "XK">("AT");
const [status, setStatus] = useState<"offen" | "gekauft">("offen");
const [imageUrl, setImageUrl] = useState("");

const [room, setRoom] = useState("🛋 Wohnzimmer");
const [priority, setPriority] = useState("P0");

  useEffect(() => {
  if (item) {
    setTitle(item.title);
    setLink(item.link);
    setPrice(item.price);
    setPaidPrice(item.paid_price);
    setCountry(item.country);
    setStatus(item.status);
    setImageUrl(item.image_url);
    setRoom(item.room);
    setPriority(item.priority);
  } else {
    setTitle("");
    setLink("");
    setPrice(0);
    setPaidPrice(null);
    setCountry("AT");
    setStatus("offen");
    setImageUrl("");
    setRoom("🛋 Wohnzimmer");
    setPriority("P0");
  }
}, [item, open]);

  const uploadImage = async (file: File) => {
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

  setImageUrl(publicUrl);
};

  const saveItem = async () => {
  let error;

  if (item) {
    ({ error } = await supabase
      .from("items")
      .update({
        title,
        link,
        price,
        paid_price: paidPrice,
        country,
        status,
        image_url: imageUrl,
        room,
        priority,
      })
      .eq("id", item.id));
  } else {
    ({ error } = await supabase
      .from("items")
      .insert({
        title,
        link,
        price,
        paid_price: paidPrice,
        country,
        status,
        image_url: imageUrl,
        room,
        priority,
      }));
  }

  if (error) {
    alert(error.message);
    return;
  }

  alert(item ? "Produkt aktualisiert!" : "Produkt gespeichert!");

  setTitle("");
  setLink("");
  setPrice(0);
  setPaidPrice(null);
  setCountry("AT");
  setStatus("offen");
  setImageUrl("");
  setRoom("🛋 Wohnzimmer");
  setPriority("P0");

  onClose();
};


 if (!open) return null;

return (
  <>
    <div
      className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    />

    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-[92vh] flex-col rounded-t-3xl border-t border-zinc-800 bg-zinc-950">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-zinc-800 p-5">
        <h2 className="text-xl font-bold">
          {item ? "Produkt bearbeiten" : "Neues Produkt"}
        </h2>

        <button
          onClick={onClose}
          className="rounded-full p-2 hover:bg-zinc-800"
        >
          <X />
        </button>
      </div>

      {/* Inhalt */}

      <div className="flex-1 overflow-y-auto space-y-5 p-5 pb-40">

        {/* Bild */}

        <label className="flex h-36 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-zinc-700 hover:border-violet-500">

          {imageUrl ? (
            <img
              src={imageUrl}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-zinc-500">
              📷 Bild hinzufügen
            </span>
          )}

          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                uploadImage(e.target.files[0]);
              }
            }}
          />
        </label>

        {/* Titel */}

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Produktname"
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 outline-none focus:border-violet-500"
        />

        {/* Link */}

        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://..."
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 outline-none focus:border-violet-500"
        />

        {/* Preis */}

        <input
          type="number"
          value={price === 0 ? "" : price}
          onChange={(e) =>
            setPrice(e.target.value === "" ? 0 : Number(e.target.value))
          }
          placeholder="Preis"
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 outline-none focus:border-violet-500"
        />

        {/* Raum */}

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
          ].map((r) => (
            <button
              key={r}
              onClick={() => setRoom(r)}
              className={`rounded-xl border py-3 ${
                room === r
                  ? "border-violet-500 bg-violet-500/15 text-violet-400"
                  : "border-zinc-800 bg-zinc-900"
              }`}
            >
              {r}
            </button>
          ))}

        </div>

        {/* Priorität */}

        <div className="grid grid-cols-4 gap-2">

          {["P0", "P1", "P2", "P3"].map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={`rounded-xl border py-3 ${
                priority === p
                  ? "border-violet-500 bg-violet-500/15 text-violet-400"
                  : "border-zinc-800 bg-zinc-900"
              }`}
            >
              {p}
            </button>
          ))}

        </div>

                {/* Kaufort */}

        <div className="space-y-2">
          <p className="text-sm text-zinc-400">
            Kaufort
          </p>

          <div className="grid grid-cols-2 gap-2">

            <button
              onClick={() => setCountry("AT")}
              className={`rounded-xl border py-3 ${
                country === "AT"
                  ? "border-violet-500 bg-violet-500/15 text-violet-400"
                  : "border-zinc-800 bg-zinc-900"
              }`}
            >
              🇦🇹 Österreich
            </button>

            <button
              onClick={() => setCountry("XK")}
              className={`rounded-xl border py-3 ${
                country === "XK"
                  ? "border-violet-500 bg-violet-500/15 text-violet-400"
                  : "border-zinc-800 bg-zinc-900"
              }`}
            >
              🇽🇰 Kosovo
            </button>

          </div>
        </div>

        {/* Status */}

        <div className="space-y-2">
          <p className="text-sm text-zinc-400">
            Status
          </p>

          <div className="grid grid-cols-2 gap-2">

            <button
              onClick={() => setStatus("offen")}
              className={`rounded-xl border py-3 ${
                status === "offen"
                  ? "border-violet-500 bg-violet-500/15 text-violet-400"
                  : "border-zinc-800 bg-zinc-900"
              }`}
            >
              Offen
            </button>

            <button
              onClick={() => setStatus("gekauft")}
              className={`rounded-xl border py-3 ${
                status === "gekauft"
                  ? "border-violet-500 bg-violet-500/15 text-violet-400"
                  : "border-zinc-800 bg-zinc-900"
              }`}
            >
              Gekauft
            </button>

          </div>
        </div>

        {status === "gekauft" && (
          <input
            type="number"
            value={paidPrice ?? ""}
            onChange={(e) =>
              setPaidPrice(
                e.target.value === ""
                  ? null
                  : Number(e.target.value)
              )
            }
            placeholder="Tatsächlich bezahlt"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 outline-none focus:border-violet-500"
          />
        )}

      </div>

      {/* Footer */}

      <div className="border-t border-zinc-800 p-5">

        <button
          onClick={saveItem}
          className="w-full rounded-2xl bg-violet-600 py-4 font-semibold"
        >
          {item
            ? "Produkt aktualisieren"
            : "Produkt speichern"}
        </button>

      </div>

    </div>
  </>
);
}