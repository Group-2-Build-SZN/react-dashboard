import { useState } from 'react';
import {
    Settings, Pencil, Heart, Search, MessageSquare, MessageSquarePlus,
    Wallet, ShieldCheck, UserPlus, HelpCircle, LogOut, ChevronRight,
} from 'lucide-react';
import { type NavTab } from '../components/BottomNav';
import BottomNav from '../components/BottomNav';
import type { UserProfile } from '../types';
import './ProfileScreen.scss';

interface ProfileScreenProps {
    user: UserProfile;
    onEditAvatar: () => void;
    onOpenSettings: () => void;
    onNavigate: (destination: string) => void;
    onLogout: () => void;
}

interface MenuItem {
    id: string;
    label: string;
    Icon: typeof MessageSquarePlus;
    danger?: boolean;
    rightSlot?: React.ReactNode;
}

export function ProfileScreen({ user, onEditAvatar, onOpenSettings, onNavigate, onLogout }: ProfileScreenProps) {
    const [activeNav, setActiveNav] = useState<NavTab>('profile');

    const menuItems: MenuItem[] = [
        { id: 'inquiries', label: 'My Inquiries', Icon: MessageSquarePlus },
        { id: 'payment_methods', label: 'Payment Methods', Icon: Wallet },
        {
            id: 'verification',
            label: 'Identification Verification',
            Icon: ShieldCheck,
            rightSlot: user.isVerified ? <span className="profile-menu__badge">Verified</span> : undefined,
        },
        { id: 'refer', label: 'Refer & Earn', Icon: UserPlus },
        { id: 'help', label: 'Help Center', Icon: HelpCircle },
        { id: 'logout', label: 'Log Out', Icon: LogOut, danger: true },
    ];

    function handleMenuClick(id: string) {
        if (id === 'logout') {
            onLogout();
        } else {
            onNavigate(id);
        }
    }

    return (
        <div className="profile-screen">
            <header className="profile-screen__header">
                <span />
                <button className="profile-screen__settings" onClick={onOpenSettings} aria-label="Settings">
                    <Settings size={20} />
                </button>
            </header>

            <div className="profile-screen__body">
                <div className="profile-hero">
                    <div className="profile-hero__avatar-wrap">
                        <img src={user.avatarUrl} alt={user.fullName} className="profile-hero__avatar" />
                        <button className="profile-hero__edit" onClick={onEditAvatar} aria-label="Edit photo">
                            <Pencil size={12} />
                        </button>
                    </div>
                    <h1 className="profile-hero__name">{user.fullName}</h1>
                    <p className="profile-hero__email">{user.email}</p>
                    <p className="profile-hero__phone">{user.phone}</p>
                </div>

                <section className="account-overview">
                    <h2 className="account-overview__title">Account Overview</h2>
                    <div className="account-overview__stats">
                        <button className="stat" onClick={() => onNavigate('saved')}>
                            <span className="stat__icon"><Heart size={18} /></span>
                            <span className="stat__value">{user.savedPropertiesCount}</span>
                            <span className="stat__label">Saved Properties</span>
                        </button>
                        <button className="stat" onClick={() => onNavigate('viewed')}>
                            <span className="stat__icon"><Search size={18} /></span>
                            <span className="stat__value">{user.viewedPropertiesCount}</span>
                            <span className="stat__label">Viewed Properties</span>
                        </button>
                        <button className="stat" onClick={() => onNavigate('inquiries')}>
                            <span className="stat__icon"><MessageSquare size={18} /></span>
                            <span className="stat__value">{user.inquiriesCount}</span>
                            <span className="stat__label">Inquiries Made</span>
                        </button>
                    </div>
                </section>

                <nav className="profile-menu">
                    {menuItems.map(({ id, label, Icon, danger, rightSlot }) => (
                        <button
                            key={id}
                            className={`profile-menu__item ${danger ? 'profile-menu__item--danger' : ''}`}
                            onClick={() => handleMenuClick(id)}
                        >
                            <span className="profile-menu__icon">
                                <Icon size={18} />
                            </span>
                            <span className="profile-menu__label">{label}</span>
                            {rightSlot}
                            <ChevronRight size={18} className="profile-menu__chevron" />
                        </button>
                    ))}
                </nav>
            </div>

            <BottomNav active={activeNav} onChange={(tab) => { setActiveNav(tab); onNavigate(tab); }} />
        </div>
    );
}