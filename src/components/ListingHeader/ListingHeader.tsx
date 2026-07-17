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

          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200">
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

          <button className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white">
            <Map
              size={22}
              strokeWidth={2}
            />
          </button>

          <button className="relative flex h-12 items-center gap-2 rounded-full border border-gray-200 bg-white px-4">

            <SlidersHorizontal
              size={20}
              strokeWidth={2}
            />

            <span className="text-sm font-medium">
              Filter
            </span>

            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
              2
            </span>

          </button>

        </div>

      </div>

    </div>
  );
}

export default ListingHeader;