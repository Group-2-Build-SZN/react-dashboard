import {
  ArrowLeft,
  Map,
  SlidersHorizontal,
} from "lucide-react";

interface ListingHeaderProps {
  resultCount?: number;
  activeFilterCount?: number;
  onBack?: () => void;
  onOpenMap?: () => void;
  onOpenFilters?: () => void;
}

function ListingHeader({ resultCount, activeFilterCount = 0, onBack, onOpenMap, onOpenFilters }: ListingHeaderProps) {
  return (
    <div style={{ padding: '5px', marginBottom: '4px' }} className="bg-white px-5 pt-5">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <button
            onClick={onBack}
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-light"
          >
            <ArrowLeft size={22} strokeWidth={2} />
          </button>

          <div>

            <h1 className="text-[18px] font-bold text-gray-900">
              Properties
            </h1>

            <p className="mt-1 text-[13px] text-gray-500">
              {resultCount === undefined ? "Loading…" : `${resultCount.toLocaleString()} properties found`}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={onOpenMap}
            aria-label="View on map"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-light bg-white"
          >
            <Map
              size={18}
              strokeWidth={2}
            />
          </button>

          <button style={{ padding: '5px' }}
            onClick={onOpenFilters}
            className="flex  h-9 items-center gap-2 rounded-xl border border-border-light bg-white px-3"
          >

            <SlidersHorizontal
              size={16}
              strokeWidth={2}
            />

            <span style={{ marginTop: '4px' }} className="text-sm font-medium text-gray-900">
              Filter
            </span>

            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-800 text-[11px] font-semibold text-white">
                {activeFilterCount}
              </span>
            )}

          </button>

        </div>

      </div>

    </div>
  );
}

export default ListingHeader;