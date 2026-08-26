import { Home, Table2, Settings, Plus } from "lucide-react";

export default function Sidebar() {
  return (
    <>
      <button className="fixed bottom-24 right-5 flex h-16 w-16 items-center justify-center rounded-full bg-violet-600 shadow-xl">

        <Plus size={30} />

      </button>

      <nav className="fixed bottom-0 left-1/2 flex w-full max-w-sm -translate-x-1/2 justify-around border-t border-zinc-800 bg-zinc-950 py-4">

        <Home />

        <Table2 />

        <Settings />

      </nav>
    </>
  );
}