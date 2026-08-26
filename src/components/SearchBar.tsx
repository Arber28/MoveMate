type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({
  value,
  onChange,
}: Props) {
  return (
    <div className="mt-4 px-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Suche..."
        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-white"
      />
    </div>
  );
}