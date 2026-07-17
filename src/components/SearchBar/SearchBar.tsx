import { Search } from "lucide-react";

function SearchBar() {
  return (
    <div className="flex h-16 items-center rounded-2xl border border-gray-200 bg-white px-5 shadow-sm">

      <Search
        size={26}
        className="text-gray-400"
      />

      <input
        type="text"
        placeholder="Search by location, estate or landmark"
        className="ml-4 flex-1 bg-transparent text-[16px] text-gray-700 outline-none placeholder:text-gray-400"
      />

    </div>
  );
}

export default SearchBar;