import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, Upload, Info } from 'lucide-react';
import type { Property, ReportReason } from '../types';
import './ReportPropertyScreen.scss';

interface ReportPropertyScreenProps {
    property: Property;
    onBack: () => void;
    onSubmit: (reason: ReportReason, description: string, files: File[]) => Promise<void>;
}

const REASONS: { id: ReportReason; label: string }[] = [
    { id: 'fake_listing', label: 'This listing looks fake' },
    { id: 'scam_or_fraud', label: 'I suspect this is a scam or fraud' },
    { id: 'misleading_information', label: 'Listing information is misleading' },
    { id: 'inappropriate_content', label: 'Contains inappropriate content' },
    { id: 'already_rented_or_sold', label: 'Property has already been rented/sold' },
    { id: 'other', label: 'Other' },
];

const MAX_DESCRIPTION_LENGTH = 500;

export function ReportPropertyScreen({ property, onBack, onSubmit }: ReportPropertyScreenProps) {
    const [reason, setReason] = useState<ReportReason | ''>('');
    const [isReasonOpen, setIsReasonOpen] = useState(false);
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    if (!property) {
        return (
            <div className="report-screen">
                <header className="report-screen__header">
                    <button className="report-screen__back" onClick={onBack} aria-label="Go back">
                        <ArrowLeft size={20} />
                    </button>
                </header>
                <div className="report-screen__body">
                    <p>Property not found.</p>
                </div>
            </div>
        );
    }

    const selectedReasonLabel = REASONS.find((r) => r.id === reason)?.label;

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    }

    async function handleSubmit() {
        if (!reason) return;
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            await onSubmit(reason, description, files);
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Failed to submit report. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="report-screen">
            <header className="report-screen__header">
                <button className="report-screen__back" onClick={onBack} aria-label="Go back">
                    <ArrowLeft size={20} />
                </button>
            </header>

            <div className="report-screen__body">
                <div className="report-screen__intro">
                    <h1 className="report-screen__title">Report Property</h1>
                    <p className="report-screen__subtitle">
                        Help us keep My Ulo safe and trustworthy by reporting suspicious listings.
                    </p>
                </div>

                <div className="form-group">
                    <label className="form-group__label">Reason for Reporting</label>
                    <div className="reason-select">
                        <button
                            className="reason-select__trigger"
                            onClick={() => setIsReasonOpen((o) => !o)}
                        >
                            <span className={selectedReasonLabel ? '' : 'reason-select__placeholder'}>
                                {selectedReasonLabel ?? 'Select a reason'}
                            </span>
                            <ChevronDown size={18} />
                        </button>

                        {isReasonOpen && (
                            <div className="reason-select__menu">
                                {REASONS.map((r) => (
                                    <button
                                        key={r.id}
                                        className="reason-select__option"
                                        onClick={() => {
                                            setReason(r.id);
                                            setIsReasonOpen(false);
                                        }}
                                    >
                                        {r.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-group__label">Property</label>
                    <div className="property-preview">
                        <img src={property.coverImageUrl} alt={property.listingTitle} className="property-preview__thumb" />
                        <div className="property-preview__text">
                            <p className="property-preview__title">{property.listingTitle}</p>
                            <p className="property-preview__location">{property.neighborhood}</p>
                        </div>
                        <ChevronRight size={18} className="property-preview__chevron" />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-group__label">Description (Optional)</label>
                    <div className="textarea-wrap">
                        <textarea
                            className="textarea-wrap__field"
                            placeholder="Please provide more details about the issue..."
                            maxLength={MAX_DESCRIPTION_LENGTH}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                        <span className="textarea-wrap__counter">
                            {description.length}/{MAX_DESCRIPTION_LENGTH}
                        </span>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-group__label">Upload Evidence (Optional)</label>
                    <label className="upload-box">
                        <input
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            onChange={handleFileSelect}
                            hidden
                        />
                        <span className="upload-box__icon">
                            <Upload size={18} />
                        </span>
                        <span className="upload-box__text">
                            {files.length > 0 ? `${files.length} file(s) selected` : 'Tap to upload photos or videos'}
                        </span>
                    </label>
                </div>

                <div className="confidential-note">
                    <Info size={16} />
                    <span>All reports are confidential. Our team will review and take action if necessary.</span>
                </div>

                {submitError && (
                    <p className="report-screen__error" role="alert">
                        {submitError}
                    </p>
                )}
            </div>

            <div className="report-screen__footer">
                <button
                    className="report-screen__submit"
                    onClick={handleSubmit}
                    disabled={!reason || isSubmitting}
                >
                    {isSubmitting ? 'Submitting…' : 'Submit Report'}
                </button>
            </div>
        </div>
    );
}