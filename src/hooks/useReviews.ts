import { useCallback, useEffect, useState } from 'react';
import { getReviews } from '../api/reviews';
import { apiReviewToReview, reviewsToBreakdown } from '../api/adapters';
import type { Review, RatingBreakdown } from '../types';

export function useReviews(propertyId: string | undefined) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [breakdown, setBreakdown] = useState<RatingBreakdown>({
    water: 0,
    electricity: 0,
    security: 0,
    amenityAccessibility: 0,
  });
  const [reviewCount, setReviewCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(() => {
    if (!propertyId) {
      setError('No property specified');
      setIsLoading(false);
      return () => {};
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getReviews(propertyId)
      .then((res) => {
        if (cancelled) return;
        const apiReviews = [...res.verifiedResident, ...res.communityTip].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setReviews(apiReviews.map(apiReviewToReview));
        setBreakdown(reviewsToBreakdown(apiReviews));
        setReviewCount(res.pagination?.total ?? apiReviews.length);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(`getReviews(${propertyId}) failed:`, err);
        setError(err instanceof Error ? err.message : 'Failed to load reviews');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [propertyId]);

  useEffect(() => fetchReviews(), [fetchReviews]);

  const overallRating =
    reviews.length === 0 ? 0 : reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length;

  return { reviews, breakdown, overallRating, reviewCount, isLoading, error, refetch: fetchReviews };
}
