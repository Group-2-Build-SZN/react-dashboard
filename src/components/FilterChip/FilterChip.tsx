import { Check, ChevronDown } from "lucide-react";

type FilterChipProps = {
  label: string;
  active?: boolean;
};

function FilterChip({
  label,
  active = false,
}: FilterChipProps) {
  const verified = label === "Verified only";
  const dropdown =
    label === "1 Bedroom" ||
    label === "2 Bedroom";

  return (
    <button
      className={`flex h-12 items-center gap-2 rounded-2xl border px-5 text-sm font-medium whitespace-nowrap transition-all ${
        active
          ? "border-blue-700 bg-blue-700 text-white"
          : "border-gray-200 bg-white text-gray-800"
      }`}
    >
      <span>{label}</span>

      {verified && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
          <Check
            size={12}
            className="text-white"
          />
        </span>
      )}

      {dropdown && (
        <ChevronDown size={16} />
      )}
    </button>
  );
}

export default FilterChip;