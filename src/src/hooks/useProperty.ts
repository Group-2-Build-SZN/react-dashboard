import { useEffect, useState } from 'react';
import { getProperty } from '../api/properties';
import { apiPropertyToProperty } from '../api/adapters';
import { ApiError } from '../api/client';
import type { Property } from '../types';

/** Fetches a single property by real API id. Replaces the old local-mock lookup used across several routes. */
export function useProperty(id: string | undefined) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('No property specified');
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getProperty(id)
      .then((detail) => {
        if (!cancelled) setProperty(apiPropertyToProperty(detail));
      })
      .catch((err) => {
        if (cancelled) return;
        // Include the real status/code so a 401 (auth issue) isn't
        // indistinguishable from a genuine 404 (property doesn't exist) —
        // these have very different fixes and previously looked identical.
        if (err instanceof ApiError) {
          console.error(`getProperty(${id}) failed: ${err.status} ${err.code ?? ''} — ${err.message}`);
          setError(`${err.message} (HTTP ${err.status}${err.code ? `, ${err.code}` : ''})`);
        } else {
          console.error(`getProperty(${id}) failed:`, err);
          setError(err instanceof Error ? err.message : 'Failed to load property');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { property, isLoading, error };
}
