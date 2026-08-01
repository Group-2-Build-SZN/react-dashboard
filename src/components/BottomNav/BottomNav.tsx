import { useNavigate } from 'react-router-dom';
import { House, Compass, Map, Heart, User } from 'lucide-react';
import './bottomNav.scss'


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
    <nav className="bottom-nav">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            onClick={() => handleClick(id)}
            className={`bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>

  );
}

export default BottomNav;
