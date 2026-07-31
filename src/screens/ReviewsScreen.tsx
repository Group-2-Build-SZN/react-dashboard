import { useState } from 'react';
import {
    ShieldCheck,
    Droplet,
    Zap,
    ShieldHalf,
    Route,
    Star,
    BadgeCheck,
} from 'lucide-react';

import ScreenHeader from '../components/ScreenHeader';
import { WriteReviewForm } from '../components/WriteReviewForm';
import { submitReview, getCurrentPosition } from '../api/reviews';
import type { Property, Review, RatingBreakdown } from '../types/index';
import './ReviewScreen.scss';

interface ReviewsScreenProps {
    property: Property;
    overallRating: number;
    reviewCount: number;
    breakdown: RatingBreakdown;
    reviews: Review[];
    onBack: () => void;
    onWriteReview: () => void;
    onUnlockContact: () => void;
    onReviewSubmitted?: () => void;
}

const BREAKDOWN_ROWS: {
    key: keyof RatingBreakdown;
    label: string;
    Icon: typeof Droplet;
}[] = [
        {
            key: 'water',
            label: 'Water Supply',
            Icon: Droplet,
        },
        {
            key: 'electricity',
            label: 'Power Supply',
            Icon: Zap,
        },
        {
            key: 'amenityAccessibility',
            label: 'Road Accessibility',
            Icon: Route,
        },
        {
            key: 'security',
            label: 'Security',
            Icon: ShieldHalf,
        },
    ];


function Stars({ rating }: { rating: number }) {
    const filledStars = Math.floor(rating);

    return (
        <div className="stars">
            {Array.from({ length: 5 }).map((_, index) => (
                <Star
                    key={index}
                    size={14}
                    className="stars__star"
                    fill={index < filledStars ? 'currentColor' : 'none'}
                />
            ))}
        </div>
    );
}


export function ReviewsScreen({
    property,
    overallRating,
    reviewCount,
    breakdown,
    reviews,
    onBack,
    onUnlockContact,
    onReviewSubmitted,
}: ReviewsScreenProps) {


    const [showReviewForm, setShowReviewForm] = useState(false);



    if (!property) {
        return (
            <div className="reviews-screen">
                <ScreenHeader
                    title="Reviews"
                    onBack={onBack}
                />

                <main className="reviews-screen__body">
                    <p>Property not found.</p>
                </main>
            </div>
        );
    }


    return (
        <div className="reviews-screen">

            <ScreenHeader
                title="Reviews"
                subtitle={property.listingTitle}
                onBack={onBack}
            />


            <main className="reviews-screen__body">


                <section className="rating-summary">

                    <div className="rating-summary__score">

                        <span className="rating-summary__number">
                            {(overallRating ?? 0).toFixed(1)}
                        </span>

                        <Stars rating={overallRating ?? 0} />

                        <span className="rating-summary__count">
                            ({reviewCount} reviews)
                        </span>

                    </div>


                    <div className="rating-summary__badge">
                        <ShieldCheck size={14} />
                        <span>GPS VERIFIED</span>
                    </div>


                    <p className="rating-summary__caption">
                        Reviews are location verified
                    </p>

                </section>




                <section className="breakdown">

                    {BREAKDOWN_ROWS.map(({ key, label, Icon }) => {

                        const value = breakdown[key] ?? 0;

                        return (

                            <div
                                className="breakdown__row"
                                key={key}
                            >

                                <Icon
                                    size={16}
                                    className="breakdown__icon"
                                />

                                <span className="breakdown__label">
                                    {label}
                                </span>


                                <div className="breakdown__bar">

                                    <div
                                        className="breakdown__bar-fill"
                                        style={{
                                            width: `${(value / 5) * 100}%`
                                        }}
                                    />

                                </div>


                                <span className="breakdown__value">
                                    {value.toFixed(1)}
                                </span>

                            </div>

                        );

                    })}

                </section>





                <section className="reviews-list">

                    <div className="reviews-list__header">

                        <h2>
                            About this property
                        </h2>


                        <button
                            className="reviews-list__write-btn"
                            onClick={() => setShowReviewForm(true)}
                        >
                            Write a review
                        </button>

                    </div>




                    {
                        reviews.length === 0 ? (

                            <p className="reviews-list__empty">
                                No reviews yet. Be the first to review this property.
                            </p>

                        ) : (

                            reviews.map((review) => (

                                <article
                                    className="review-item"
                                    key={review.id}
                                >

                                    <div className="review-item__header">
                                        {review.reviewerAvatarUrl ? (<img src={review.reviewerAvatarUrl}
                                            alt={review.reviewerName}
                                            className="review-item__avatar"
                                        />) : (

                                            <div className="review-item__avatar review-item__avatar--placeholder">
                                                {review.reviewerName.charAt(0)}
                                            </div>

                                        )
                                        }



                                        <div className="review-item__meta">

                                            <div className="review-item__name-row">

                                                <span className="review-item__name">
                                                    {review.reviewerName}
                                                </span>


                                                {
                                                    review.reviewType === 'verified_resident' && (

                                                        <span className="review-item__verified">
                                                            <BadgeCheck size={13} />
                                                            Verified
                                                        </span>

                                                    )
                                                }

                                            </div>


                                            <span className="review-item__date">
                                                {review.createdAt}
                                            </span>

                                        </div>


                                        <Stars rating={review.overallRating} />


                                    </div>


                                    <p className="review-item__text">
                                        {review.text}
                                    </p>


                                </article>

                            ))

                        )
                    }


                </section>


            </main>





            <footer className="reviews-screen__footer">

                <button
                    className="reviews-screen__cta"
                    onClick={onUnlockContact}
                >
                    Unlock Contact - ₦7,500
                </button>

            </footer>



            {
                showReviewForm && (

                    <WriteReviewForm
                        propertyId={property.id}

                        onClose={() => setShowReviewForm(false)}

                        onSubmit={async (review) => {

                            // The API scores 5 separate categories (water/
                            // electricity/security/road/cleanliness) plus
                            // requires GPS coordinates — this form only
                            // collects one overall star rating + free-text
                            // tags. Using the overall rating for all 5
                            // categories as a functional starting point;
                            // the real fix is rebuilding this form to
                            // collect each category separately (that's what
                            // the trust-score breakdown on this screen is
                            // actually meant to reflect).
                            const { lat, lng } = await getCurrentPosition();

                            await submitReview(review.propertyId, {
                                waterRating: review.rating,
                                electricityRating: review.rating,
                                securityRating: review.rating,
                                roadAccessibilityRating: review.rating,
                                cleanlinessRating: review.rating,
                                reviewText: [review.text, ...review.tags].filter(Boolean).join(' — '),
                                submittedLat: lat,
                                submittedLng: lng,
                            });

                            onReviewSubmitted?.();
                        }}
                    />

                )
            }



        </div>
    );
}