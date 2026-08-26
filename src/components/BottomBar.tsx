import { House, Table2, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

type Props = {
  onAdd: () => void;
};

export default function BottomBar({ onAdd }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex h-20 max-w-md items-center justify-around">

        <button
          onClick={() => navigate("/home")}
          className={`flex flex-col items-center gap-1 transition ${
  location.pathname === "/home"
    ? "text-violet-400"
    : "text-zinc-400 hover:text-white"
}`}
        >
          <House size={22} />
          <span className="text-xs">Home</span>
        </button>

        {location.pathname === "/home" ? (
  <button
    onClick={onAdd}
    className="-mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-violet-600 shadow-lg shadow-violet-600/30 transition active:scale-95"
  >
    <Plus size={30} className="text-white" />
  </button>
) : (
  <button
    className="-mt-8 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-violet-600 shadow-lg shadow-violet-600/30"
  >
    <span className="text-[13px] font-extrabold leading-none tracking-wide text-white">
  Move
</span>

<span className="text-[11px] font-semibold leading-none tracking-wide text-white">
  Mate
</span>
  </button>
)}

        <button
          onClick={() => navigate("/pivot")}
          className={`flex flex-col items-center gap-1 transition ${
            location.pathname === "/pivot"
              ? "text-violet-400"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Table2 size={22} />
          <span className="text-xs">Pivot</span>
        </button>

      </div>
    </div>
  );
}