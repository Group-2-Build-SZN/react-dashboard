import { useState, type FormEvent } from 'react';
import { Star, X } from 'lucide-react';
import './ReviewForm.scss';

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
  const [error, setError] = useState<string | null>(null);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((item) => item !== tag)
        : [...prev, tag]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!rating || !text.trim()) {
      setError('Please add a rating and review.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        propertyId,
        rating,
        text,
        tags: selectedTags,
      });

      onClose();
    } catch (err) {
      console.error('Failed to submit review:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to submit review. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="review-form-overlay">
      <form className="review-form" onSubmit={handleSubmit}>
        <div className="review-form__header">
          <h2>Write a Review</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close review form"
          >
            <X size={20} />
          </button>
        </div>

        <div className="review-form__rating">
          <p>Rate this property</p>

          <div className="stars-input">
            {Array.from({ length: 5 }).map((_, index) => {
              const starValue = index + 1;

              return (
                <button
                  key={starValue}
                  type="button"
                  onClick={() => setRating(starValue)}
                  aria-label={`Rate ${starValue} star${
                    starValue > 1 ? 's' : ''
                  }`}
                >
                  <Star
                    size={32}
                    fill={
                      starValue <= rating
                        ? 'currentColor'
                        : 'none'
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

        {error && (
          <p
            className="review-form__error"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="review-form__tags">
          <p>What did you like?</p>

          <div className="tag-list">
            {REVIEW_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className={
                  selectedTags.includes(tag)
                    ? 'tag active'
                    : 'tag'
                }
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="review-form__submit"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}