export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 bg-zinc-950"
      style={{
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <div className="px-5 py-3">
        <h1 className="text-3xl font-bold text-center text-white">
          MoveMate
        </h1>
      </div>

      <div className="h-px w-full bg-violet-600" />
    </header>
  );
}