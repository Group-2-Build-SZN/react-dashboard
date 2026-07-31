import { useState } from 'react';
import { CreditCard, Landmark, Grid2x2, Lock, ChevronRight } from 'lucide-react';
import ScreenHeader from '../components/ScreenHeader';
import type { Property, PaymentMethod } from '../types';
import { UNLOCK_FEE_NGN } from '../types';
import './UnlockContactScreen.scss';

interface UnlockContactScreenProps {
    property: Property;
    onBack: () => void;
    onConfirmPayment: (method: PaymentMethod) => Promise<void>;
}

const METHODS: {
    id: PaymentMethod;
    label: string;
    description: string;
    Icon: typeof CreditCard;
}[] = [
        { id: 'card', label: 'Card', description: 'Pay with Visa, MasterCard, Verve', Icon: CreditCard },
        { id: 'bank_transfer', label: 'Bank Transfer', description: 'Transfer directly to our account', Icon: Landmark },
        { id: 'ussd', label: 'USSD', description: 'Pay securely with USSD', Icon: Grid2x2 },
    ];

function formatNaira(amount: number) {
    return `₦${amount.toLocaleString('en-NG')}`;
}

export function UnlockContactScreen({ property, onBack, onConfirmPayment }: UnlockContactScreenProps) {
    const [selected, setSelected] = useState<PaymentMethod | null>(null);

    return (
        <div className="unlock-screen">
            <ScreenHeader title="Unlock Contact" onBack={onBack} />

            <div className="unlock-screen__body">
                {}
                <section className="unlock-card">
                    <p className="unlock-card__label">Property</p>
                    <div className="unlock-card__property">
                        <img
                            src={property.coverImageUrl}
                            alt={property.listingTitle}
                            className="unlock-card__thumb"
                        />
                        <div>
                            <p className="unlock-card__title">{property.listingTitle}</p>
                            <p className="unlock-card__location">{property.neighborhood}</p>
                            <p className="unlock-card__price">
                                {formatNaira(property.price)} <span>/ {property.pricePeriod}</span>
                            </p>
                        </div>
                    </div>
                </section>

                {}
                <section className="unlock-card">
                    <p className="unlock-card__label">Amount to Pay</p>
                    <p className="unlock-card__amount">{formatNaira(UNLOCK_FEE_NGN)}</p>
                    <p className="unlock-card__hint">
                        This allows you to view the property owner's contact details.
                    </p>
                </section>

                {}
                <h2 className="unlock-screen__section-title">Choose Payment Method</h2>
                <div className="method-list">
                    {METHODS.map(({ id, label, description, Icon }) => {
                        const isActive = id === selected;

                        return (
                            <button
                                key={id}
                                className={`method-option ${isActive ? 'method-option--active' : ''}`}
                                onClick={() => setSelected(id)}
                            >
                                <span className="method-option__icon">
                                    <Icon size={20} />
                                </span>

                                <span className="method-option__text">
                                    <span className="method-option__label">{label}</span>
                                    <span className="method-option__description">{description}</span>
                                </span>

                                <ChevronRight size={18} className="method-option__chevron" />
                            </button>
                        );
                    })}
                </div>

                {}
                <div className="unlock-screen__secure">
                    <Lock size={14} />
                    <span>Secure Payment</span>
                </div>
            </div>

            {}
            <div className="unlock-screen__footer">
                <button
                    className="unlock-screen__cta"
                    disabled={!selected}
                    onClick={() => selected && onConfirmPayment(selected)}
                >
                    Continue Payment
                </button>

                <p className="unlock-screen__powered-by">
                    Powered by <strong>paystack</strong>
                </p>
            </div>
        </div>
    );
}