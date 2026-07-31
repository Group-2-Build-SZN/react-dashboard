import { useState } from 'react';
import {
    ArrowLeft, Bell, Lock, Globe, Coins, Search, Map, Filter,
    HelpCircle, FileText, Info, ChevronRight, LogOut, Trash2,
} from 'lucide-react';
import type { SettingsSection } from '../types';
import './SettingsScreen.scss';

interface SettingsScreenProps {
    sections: SettingsSection[];
    onBack: () => void;
    onSelectItem: (itemId: string) => void;
    onLogout: () => void;
    onDeleteAccount: () => void;
}

const ITEM_ICONS: Record<string, typeof Bell> = {
    notifications: Bell,
    privacy_security: Lock,
    language: Globe,
    currency: Coins,
    search_preferences: Search,
    map_preferences: Map,
    saved_filters: Filter,
    help_center: HelpCircle,
    terms: FileText,
    about: Info,
};

export function SettingsScreen({ sections, onBack, onSelectItem, onLogout, onDeleteAccount }: SettingsScreenProps) {
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    return (
        <div className="settings-screen">
            <header className="settings-screen__header">
                <button className="settings-screen__back" onClick={onBack} aria-label="Go back">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="settings-screen__title">Settings</h1>
                <span className="settings-screen__spacer" />
            </header>

            <div className="settings-screen__body">
                {sections.map((section) => (
                    <section className="settings-section" key={section.id}>
                        <h2 className="settings-section__title">{section.title}</h2>
                        <div className="settings-section__items">
                            {section.items.map((item) => {
                                const Icon = ITEM_ICONS[item.id] ?? Info;
                                return (
                                    <button
                                        key={item.id}
                                        className="settings-item"
                                        onClick={() => onSelectItem(item.id)}
                                    >
                                        <span className="settings-item__icon">
                                            <Icon size={18} />
                                        </span>
                                        <span className="settings-item__label">{item.label}</span>
                                        {item.value && <span className="settings-item__value">{item.value}</span>}
                                        <ChevronRight size={18} className="settings-item__chevron" />
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                ))}

                <button className="settings-danger-btn" onClick={onLogout}>
                    <LogOut size={18} />
                    <span>Log Out</span>
                </button>

                <button
                    className="settings-danger-btn settings-danger-btn--delete"
                    onClick={() => setConfirmingDelete(true)}
                >
                    <Trash2 size={18} />
                    <span className="settings-danger-btn__text">
                        <span className="settings-danger-btn__title">Delete Account</span>
                        <span className="settings-danger-btn__subtitle">Permanently remove your data</span>
                    </span>
                </button>

                {confirmingDelete && (
                    <div className="delete-confirm-overlay" onClick={() => setConfirmingDelete(false)}>
                        <div className="delete-confirm" onClick={(e) => e.stopPropagation()}>
                            <h3>Delete your account?</h3>
                            <p>This permanently removes your data and can't be undone.</p>
                            <div className="delete-confirm__actions">
                                <button className="delete-confirm__cancel" onClick={() => setConfirmingDelete(false)}>
                                    Cancel
                                </button>
                                <button
                                    className="delete-confirm__confirm"
                                    onClick={() => {
                                        setConfirmingDelete(false);
                                        onDeleteAccount();
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}