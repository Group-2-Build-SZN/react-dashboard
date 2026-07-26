import { useNavigate } from 'react-router-dom';
import { Home, Search, Map, Heart, User } from 'lucide-react';
import './BottomNav.scss';

export type NavTab = 'home' | 'explore' | 'map' | 'saved' | 'profile';

interface BottomNavProps {
    active: NavTab;
    onChange: (tab: NavTab) => void;
}

const TABS: { id: NavTab; label: string; Icon: typeof Home }[] = [
    { id: 'home', label: 'Home', Icon: Home },
    { id: 'explore', label: 'Explore', Icon: Search },
    { id: 'map', label: 'Map', Icon: Map },
    { id: 'saved', label: 'Saved', Icon: Heart },
    { id: 'profile', label: 'Profile', Icon: User },
];

const BottomNav = ({ active }: BottomNavProps) => {

    const navigate = useNavigate();
    return (
        <nav className="bottom-nav">
            {TABS.map(({ Icon, id, label }) => {
                const isActive = id === active;

                return (
                    <button
                        key={id}
                        onClick={() => navigate(`/${id}`)}
                        className={`bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`}
                    >
                        <Icon strokeWidth={isActive ? 2.4 : 2} />
                        <span>{label}</span>
                    </button>
                );
            })}
        </nav>
    );
};

export default BottomNav;