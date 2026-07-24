import {
  House,
  Compass,
  Map,
  Heart,
  User,
} from "lucide-react";

export type BottomNavTab = "home" | "explore" | "map" | "saved" | "profile";

type BottomNavProps = {
  active?: BottomNavTab;
  onNavigate?: (tab: BottomNavTab) => void;
};

const tabs: { id: BottomNavTab; label: string; icon: typeof House }[] = [
  { id: "home", label: "Home", icon: House },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "map", label: "Map", icon: Map },
  { id: "saved", label: "Saved", icon: Heart },
  { id: "profile", label: "Profile", icon: User },
];

function BottomNav({ active = "home", onNavigate }: BottomNavProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 mx-auto max-w-md border-t border-border-light bg-white">

      <div className="mx-auto flex max-w-md justify-around py-3">

        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate?.(id)}
            className={`flex flex-col items-center ${
              active === id ? "text-primary-800" : "text-gray-400"
            }`}
          >
            <Icon size={22} />
            <span className={`mt-1 text-xs ${active === id ? "font-medium" : ""}`}>
              {label}
            </span>
          </button>
        ))}

      </div>

    </div>
  );
}

export default BottomNav;
