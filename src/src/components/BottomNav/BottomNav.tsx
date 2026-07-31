import { useNavigate } from 'react-router-dom';
import { House, Compass, Map, Heart, User } from 'lucide-react';

// Merged from two near-identical BottomNav components (one SCSS/BEM, one
// Tailwind). Kept the Tailwind styling since it's a closer match to the
// rest of the auth/browse flow. Supports both call-site conventions that
// existed across the two codebases so neither side had to change its props:
//   - `onChange`   (used by ContactUsScreen / SavedPropertiesScreen / ProfileScreen / InteractiveMap)
//   - `onNavigate` (used by HomeDashboard / PropertyListing)
// If neither is passed, it falls back to `navigate(/${tab})`.

export type NavTab = 'home' | 'explore' | 'map' | 'saved' | 'profile';
export type BottomNavTab = NavTab;

interface BottomNavProps {
  active: NavTab;
  onChange?: (tab: NavTab) => void;
  onNavigate?: (tab: NavTab) => void;
}

const TABS: { id: NavTab; label: string; Icon: typeof House }[] = [
  { id: 'home', label: 'Home', Icon: House },
  { id: 'explore', label: 'Explore', Icon: Compass },
  { id: 'map', label: 'Map', Icon: Map },
  { id: 'saved', label: 'Saved', Icon: Heart },
  { id: 'profile', label: 'Profile', Icon: User },
];

function BottomNav({ active, onChange, onNavigate }: BottomNavProps) {
  const navigate = useNavigate();

  function handleClick(tab: NavTab) {
    if (onChange) onChange(tab);
    else if (onNavigate) onNavigate(tab);
    else navigate(`/${tab}`);
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-border-light bg-white">
      <div className="mx-auto flex max-w-md justify-around py-3">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className={`flex flex-col items-center gap-1 text-xs ${
                isActive ? 'font-semibold text-primary-600' : 'text-muted'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
