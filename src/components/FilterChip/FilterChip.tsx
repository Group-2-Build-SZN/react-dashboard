import { Check, ChevronDown } from "lucide-react";

type FilterChipProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  shape?: "pill" | "circle";
};

function FilterChip({
  label,
  active = false,
  onClick,
  shape = "pill",
}: FilterChipProps) {
  const verified = label === "Verified only";
  const dropdown =
    label === "1 Bedroom" ||
    label === "2 Bedroom";

  if (shape === "circle") {
    return (
      <button
        onClick={onClick}
        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-all ${active
          ? "border-primary-800 bg-primary-800 text-white"
          : "border-border-light bg-white text-gray-800"
          }`}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      style={{ padding: '8px', marginBottom: '5px' }}
      onClick={onClick}
      className={`flex h-11 items-center gap-2 rounded-lg border px-4 text-sm font-medium whitespace-nowrap transition-all ${active
        ? "border-primary-800 bg-primary-800 text-white"
        : "border-border-light bg-white text-gray-800"
        }`}
    >
      <span>{label}</span>

      {verified && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary-600">
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