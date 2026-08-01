import { Search, SlidersHorizontal } from "lucide-react";

type SearchBarProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFilterClick?: () => void;
  onFocus?: () => void;
};

function SearchBar({
  placeholder = "Search by location, estate or landmark",
  value,
  onChange,
  onFilterClick,
  onFocus,
}: SearchBarProps) {
  return (
    <div style={{ marginBottom: '3px' }} className="flex items-center gap-2 ">

      <div style={{ padding: '10px' }} className="flex h-[50px] flex-1 items-center gap-2 rounded-full border border-border-light bg-white px-4">
        <Search size={18} className="flex-shrink-0 text-muted" />

        <input
          type="text"
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          className="h-full w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-muted"
        />
      </div>

      {onFilterClick && (
        <button
          onClick={onFilterClick}
          aria-label="Filters"
          className="flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-full border border-border-light"
        >
          <SlidersHorizontal size={18} className="text-gray-700" />
        </button>
      )}

    </div>
  );
}

export default SearchBar;