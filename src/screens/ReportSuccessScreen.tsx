import { ShieldCheck, ClipboardList, Clock, Bell, Heart } from 'lucide-react';
import type { ReportConfirmation } from '../types';
import './ReportSuccessScreen.scss';

interface ReportSuccessScreenProps {
    confirmation: ReportConfirmation;
    onBackToHome: () => void;
}

export function ReportSuccessScreen({ confirmation, onBackToHome }: ReportSuccessScreenProps) {
    return (
        <div className="report-success-screen">
            <div className="report-success-screen__body">
                <div className="success-badge">
                    <ShieldCheck size={40} />
                </div>

                <h1 className="report-success-screen__title">Report Submitted Successfully</h1>
                <p className="report-success-screen__subtitle">
                    Thank you for helping keep My Ulo safe and trustworthy for everyone
                </p>

                <div className="success-details">
                    <div className="success-details__row">
                        <span className="success-details__icon">
                            <ClipboardList size={16} />
                        </span>
                        <div>
                            <p className="success-details__label">Report ID</p>
                            <p className="success-details__value">{confirmation.reportId}</p>
                        </div>
                    </div>

                    <div className="success-details__divider" />

                    <div className="success-details__row">
                        <span className="success-details__icon">
                            <Clock size={16} />
                        </span>
                        <div>
                            <p className="success-details__label">What happens next?</p>
                            <p className="success-details__text">
                                Our team will review your report and take appropriate action if our guidelines were violated.
                            </p>
                        </div>
                    </div>

                    <div className="success-details__divider" />

                    <div className="success-details__row">
                        <span className="success-details__icon">
                            <Bell size={16} />
                        </span>
                        <div>
                            <p className="success-details__label">You'll be notified</p>
                            <p className="success-details__text">
                                We'll notify you if we need more information or when action has been taken
                            </p>
                        </div>
                    </div>
                </div>

                <div className="thank-you-banner">
                    <span className="thank-you-banner__text">
                        You're making My Ulo better! Your report helps keep our community safe.
                    </span>
                    <Heart size={18} className="thank-you-banner__heart" />
                </div>
            </div>

            <div className="report-success-screen__footer">
                <button className="report-success-screen__cta" onClick={onBackToHome}>
                    Back to Home
                </button>
            </div>
        </div>
    );
}