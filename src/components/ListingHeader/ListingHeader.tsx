import {
  ArrowLeft,
  Map,
  SlidersHorizontal,
} from "lucide-react";

function ListingHeader() {
  return (
    <div className="bg-white px-5 pt-5">

      <div className="flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-4">

          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border-light">
            <ArrowLeft size={22} strokeWidth={2} />
          </button>

          <div>

            <h1 className="text-[18px] font-bold text-gray-900">
              Properties
            </h1>

            <p className="mt-1 text-[13px] text-gray-500">
              1,248 properties found
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-3">

          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-light bg-white">
            <Map
              size={18}
              strokeWidth={2}
            />
          </button>

          <button className="flex h-9 items-center gap-2 rounded-xl border border-border-light bg-white px-3">

            <SlidersHorizontal
              size={16}
              strokeWidth={2}
            />

            <span className="text-sm font-medium text-gray-900">
              Filter
            </span>

            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-800 text-[11px] font-semibold text-white">
              2
            </span>

          </button>

        </div>

      </div>

    </div>
  );
}

export default ListingHeader;