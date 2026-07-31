import { CreditCard, Lock, Loader2, Landmark, CheckCircle2, Check } from 'lucide-react';
import ScreenHeader from '../components/ScreenHeader';
import type { Property, PaymentStep } from '../types';
import { UNLOCK_FEE_NGN } from '../types';
import './ProcessingPaymentScreen.scss';

interface ProcessingPaymentScreenProps {
    property: Property;
    steps: PaymentStep[];
    onBack: () => void;
}

const STEP_ICONS: Record<string, typeof CreditCard> = {
    payment_initiated: CreditCard,
    verifying_card: Lock,
    processing: Loader2,
    authorizing: Landmark,
    finalizing: CheckCircle2,
};

function formatNaira(amount: number) {
    return `₦${amount.toLocaleString('en-NG')}`;
}

export function ProcessingPaymentScreen({ property, steps, onBack }: ProcessingPaymentScreenProps) {
    if (!property) {
        return (
            <div className="processing-screen">
                <ScreenHeader title="Processing Payment" onBack={onBack} />
                <div className="processing-screen__body">
                    <p>Property not found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="processing-screen">
            <ScreenHeader title="Processing Payment" onBack={onBack} />

            <div className="processing-screen__body">
                <section className="processing-card">
                    <img src={property.coverImageUrl} alt={property.listingTitle} className="processing-card__thumb" />
                    <div>
                        <p className="processing-card__title">{property.listingTitle}</p>
                        <p className="processing-card__location">{property.neighborhood}</p>
                        <p className="processing-card__price">{formatNaira(UNLOCK_FEE_NGN)}</p>
                    </div>
                </section>

                <h2 className="processing-screen__section-title">Payment Progress</h2>

                <ol className="step-tracker">
                    {steps.map((step, index) => {
                        const Icon = STEP_ICONS[step.id] ?? CreditCard;
                        const isLast = index === steps.length - 1;

                        return (
                            <li className={`step-tracker__item step-tracker__item--${step.status}`} key={step.id}>
                                <div className="step-tracker__marker-col">
                                    <span className="step-tracker__icon">
                                        <Icon size={18} className={step.status === 'active' ? 'spin' : undefined} />
                                    </span>
                                    {!isLast && <span className="step-tracker__line" />}
                                </div>

                                <div className="step-tracker__text">
                                    <p className="step-tracker__title">{step.title}</p>
                                    <p className="step-tracker__subtitle">{step.subtitle}</p>
                                </div>

                                <div className="step-tracker__status">
                                    {step.status === 'complete' && (
                                        <span className="step-tracker__check">
                                            <Check size={14} />
                                        </span>
                                    )}
                                    {step.status === 'active' && <span className="step-tracker__spinner" />}
                                </div>
                            </li>
                        );
                    })}
                </ol>

                <div className="secure-banner">
                    <span className="secure-banner__icon">
                        <Lock size={16} />
                    </span>
                    <div className="secure-banner__text">
                        <p className="secure-banner__title">Your payment is 100% secure</p>
                        <p className="secure-banner__subtitle">
                            Your card details are encrypted and protected by Paystack
                        </p>
                    </div>
                    <span className="secure-banner__brand">paystack</span>
                </div>

                <div className="processing-banner">
                    <span className="processing-banner__icon">
                        <Lock size={16} />
                    </span>
                    <p className="processing-banner__title">Processing your payment…</p>
                    <p className="processing-banner__subtitle">
                        This usually takes a few seconds.
                        <br />
                        Thank you for your patience.
                    </p>
                </div>
            </div>
        </div>
    );
}