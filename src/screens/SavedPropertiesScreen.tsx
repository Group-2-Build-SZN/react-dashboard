import { useMemo, useState } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { type NavTab } from '../components/BottomNav';
import BottomNav from '../components/BottomNav';
import type { Property, ListingCategory } from '../types';
import './SavedPropertiesScreen.scss';

interface SavedPropertiesScreenProps {
    properties: Property[];
    onBack: () => void;
    onToggleFavorite: (propertyId: string) => void;
    onSelectProperty: (propertyId: string) => void;
}

type TabId = 'all' | ListingCategory;

function formatNaira(amount: number) {
    return `₦${amount.toLocaleString('en-NG')}`;
}

export function SavedPropertiesScreen({
    properties,
    onBack,
    onToggleFavorite,
    onSelectProperty,
}: SavedPropertiesScreenProps) {
    const [activeTab, setActiveTab] = useState<TabId>('all');
    const [activeNav, setActiveNav] = useState<NavTab>('saved');

    const counts = useMemo(
        () => ({
            all: properties.length,
            for_rent: properties.filter((p) => p.listingCategory === 'for_rent').length,
            for_sale: properties.filter((p) => p.listingCategory === 'for_sale').length,
        }),
        [properties],
    );

    const filtered = useMemo(
        () => (activeTab === 'all' ? properties : properties.filter((p) => p.listingCategory === activeTab)),
        [activeTab, properties],
    );

    const TABS: { id: TabId; label: string; count: number }[] = [
        { id: 'all', label: 'All', count: counts.all },
        { id: 'for_rent', label: 'For Rent', count: counts.for_rent },
        { id: 'for_sale', label: 'For Sale', count: counts.for_sale },
    ];

    return (
        <div className="saved-screen">
            <header className="saved-screen__header">
                <button className="saved-screen__back" onClick={onBack} aria-label="Go back">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="saved-screen__title">Saved Properties</h1>
                <span className="saved-screen__spacer" />
            </header>

            <div className="saved-screen__tabs">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        className={`saved-tab ${activeTab === tab.id ? 'saved-tab--active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            <div className="saved-screen__list">
                {filtered.length === 0 ? (
                    <p className="saved-screen__empty">No saved properties in this category yet.</p>
                ) : (
                    filtered.map((property) => (
                        <article
                            className="saved-card"
                            key={property.id}
                            onClick={() => onSelectProperty(property.id)}
                        >
                            <div className="saved-card__image-wrap">
                                <img src={property.coverImageUrl} alt={property.listingTitle} className="saved-card__image" />

                                <span className={`saved-card__badge saved-card__badge--${property.listingCategory}`}>
                                    {property.listingCategory === 'for_rent' ? 'For Rent' : 'For Sale'}
                                </span>

                                <button
                                    className={`saved-card__heart ${property.isFavorited ? 'saved-card__heart--active' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleFavorite(property.id);
                                    }}
                                    aria-label={property.isFavorited ? 'Remove from saved' : 'Save property'}
                                >
                                    <Heart size={18} fill={property.isFavorited ? 'currentColor' : 'none'} />
                                </button>
                            </div>

                            <div className="saved-card__body">
                                <p className="saved-card__title">{property.listingTitle}</p>
                                <div className="saved-card__meta-row">
                                    <span className="saved-card__location">{property.neighborhood}</span>
                                    <span className="saved-card__price">
                                        {formatNaira(property.price)} <span>/ {property.pricePeriod}</span>
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))
                )}
            </div>

            <BottomNav active={activeNav} onChange={setActiveNav} />
        </div>
    );
}