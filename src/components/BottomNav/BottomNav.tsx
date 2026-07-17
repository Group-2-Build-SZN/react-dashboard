import {
  House,
  Compass,
  Map,
  Heart,
  User,
} from "lucide-react";

function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">

      <div className="mx-auto flex max-w-md justify-around py-3">

        <button className="flex flex-col items-center text-gray-400">
          <House size={22} />
          <span className="mt-1 text-xs">
            Home
          </span>
        </button>

        <button className="flex flex-col items-center text-blue-600">
          <Compass size={22} />
          <span className="mt-1 text-xs font-medium">
            Explore
          </span>
        </button>

        <button className="flex flex-col items-center text-gray-400">
          <Map size={22} />
          <span className="mt-1 text-xs">
            Map
          </span>
        </button>

        <button className="flex flex-col items-center text-gray-400">
          <Heart size={22} />
          <span className="mt-1 text-xs">
            Saved
          </span>
        </button>

        <button className="flex flex-col items-center text-gray-400">
          <User size={22} />
          <span className="mt-1 text-xs">
            Profile
          </span>
        </button>

      </div>

    </div>
  );
}

export default BottomNav;