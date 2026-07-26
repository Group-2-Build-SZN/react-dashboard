import { useState } from 'react';
import { Star, X } from 'lucide-react';
import './ReviewForm.scss'

interface WriteReviewFormProps {
    propertyId: string;
    onClose: () => void;
    onSubmit: (review: {
        propertyId: string;
        rating: number;
        text: string;
        tags: string[];
    }) => Promise<void>;
}

const REVIEW_TAGS = [
    'Good Water Supply',
    'Stable Electricity',
    'Secure Area',
    'Good Road',
    'Clean Environment',
    'Quiet Neighborhood',
];

export function WriteReviewForm({
    propertyId,
    onClose,
    onSubmit,
}: WriteReviewFormProps) {

    const [rating, setRating] = useState(0);
    const [text, setText] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);


    function toggleTag(tag: string) {
        setSelectedTags((prev) =>
            prev.includes(tag)
                ? prev.filter((item) => item !== tag)
                : [...prev, tag]
        );
    }


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!rating || !text.trim()) {
            alert('Please add a rating and review');
            return;
        }

        setLoading(true);

        try {
            await onSubmit({
                propertyId,
                rating,
                text,
                tags: selectedTags,
            });

            onClose();

        } catch (error) {
            console.error('Failed to submit review:', error);

        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="review-form-overlay">

            <form
                className="review-form"
                onSubmit={handleSubmit}
            >

                <div className="review-form__header">

                    <h2>
                        Write a Review
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>

                </div>



                <div className="review-form__rating">

                    <p>
                        Rate this property
                    </p>


                    <div className="stars-input">

                        {Array.from({ length: 5 }).map((_, index) => {

                            const starValue = index + 1;

                            return (
                                <button
                                    key={starValue}
                                    type="button"
                                    onClick={() => setRating(starValue)}
                                >

                                    <Star
                                        size={32}
                                        fill={
                                            starValue <= rating
                                                ? "currentColor"
                                                : "none"
                                        }
                                    />

                                </button>
                            );

                        })}

                    </div>

                </div>



                <textarea
                    className="review-form__textarea"
                    placeholder="Share your experience about this property..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={5}
                />



                <div className="review-form__tags">

                    <p>
                        What did you like?
                    </p>


                    <div className="tag-list">

                        {REVIEW_TAGS.map((tag) => (

                            <button
                                key={tag}
                                type="button"
                                className={
                                    selectedTags.includes(tag)
                                        ? "tag active"
                                        : "tag"
                                }
                                onClick={() => toggleTag(tag)}
                            >
                                {tag}
                            </button>

                        ))}

                    </div>

                </div>



                <button
                    className="review-form__submit"
                    disabled={loading}
                >
                    {
                        loading
                            ? "Submitting..."
                            : "Submit Review"
                    }
                </button>


            </form>

        </div>
    );
}