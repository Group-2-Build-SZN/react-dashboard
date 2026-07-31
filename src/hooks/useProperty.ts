import { useEffect, useState } from 'react';
import { getProperty } from '../api/properties';
import { apiPropertyToProperty } from '../api/adapters';
import { ApiError } from '../api/client';
import type { Property } from '../types';

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
