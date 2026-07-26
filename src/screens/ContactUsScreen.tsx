import { useState } from 'react';
import { ArrowLeft, Phone, Mail, MessageSquare, MapPin, MessageCircle, ChevronRight } from 'lucide-react';
import { type NavTab } from '../components/BottomNav';
import BottomNav from '../components/BottomNav';
import type { ContactMethod, ContactMethodType } from '../types';
import './ContactScreen.scss';

interface ContactUsScreenProps {
    heroImageUrl: string;
    methods: ContactMethod[];
    onBack: () => void;
    onSelectMethod: (method: ContactMethod) => void;
}

const METHOD_ICONS: Record<ContactMethodType, typeof Phone> = {
    call: Phone,
    email: Mail,
    chat: MessageSquare,
    office: MapPin,
};

export function ContactUsScreen({ heroImageUrl, methods, onBack, onSelectMethod }: ContactUsScreenProps) {
    const [activeNav, setActiveNav] = useState<NavTab>('profile');

    return (
        <div className="contact-screen">
            <header className="contact-screen__header">
                <button className="contact-screen__back" onClick={onBack} aria-label="Go back">
                    <ArrowLeft size={20} />
                </button>
            </header>

            <div className="contact-screen__body">
                <div className="contact-screen__intro">
                    <h1 className="contact-screen__title">Contact Us</h1>
                    <p className="contact-screen__subtitle">
                        We're here to help. Reach out to us anytime.
                    </p>
                </div>

                <div className="contact-hero">
                    <div className="contact-hero__ring">
                        <img src={heroImageUrl} alt="" className="contact-hero__image" />
                    </div>
                    <span className="contact-hero__bubble contact-hero__bubble--call">
                        <Phone size={18} />
                    </span>
                    <span className="contact-hero__bubble contact-hero__bubble--chat">
                        <MessageCircle size={18} />
                    </span>
                    <span className="contact-hero__bubble contact-hero__bubble--pin">
                        <MapPin size={18} />
                    </span>
                </div>

                <div className="method-cards">
                    {methods.map((method) => {
                        const Icon = METHOD_ICONS[method.type];
                        return (
                            <button
                                key={method.id}
                                className="method-card"
                                onClick={() => onSelectMethod(method)}
                            >
                                <span className="method-card__icon">
                                    <Icon size={18} />
                                </span>
                                <span className="method-card__text">
                                    <span className="method-card__title">{method.title}</span>
                                    <span className="method-card__detail">{method.detail}</span>
                                </span>
                                {method.isOnline && <span className="method-card__badge">Online</span>}
                                <ChevronRight size={18} className="method-card__chevron" />
                            </button>
                        );
                    })}
                </div>
            </div>

            <BottomNav active={activeNav} onChange={setActiveNav} />
        </div>
    );
}