import { useEffect, useState } from 'react';
import { RankedDrawsPrizeCard } from '../types/rankedDraws';

interface UseRankedDrawsOverviewParams {
  autoFetch?: boolean;
}

interface UseRankedDrawsOverviewReturn {
  rankedDrawsData: RankedDrawsPrizeCard[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRankedDrawsOverview({ autoFetch = false }: UseRankedDrawsOverviewParams = {}): UseRankedDrawsOverviewReturn {
  const [rankedDrawsData, setRankedDrawsData] = useState<RankedDrawsPrizeCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ranked-draws-overview', {
        cache: 'force-cache',
        next: { revalidate: 300 } // 5 minutes cache
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ranked draws data: ${response.status}`);
      }

      const data: RankedDrawsPrizeCard[] = await response.json();
      setRankedDrawsData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching ranked draws overview:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch]);

  return {
    rankedDrawsData,
    loading,
    error,
    refetch: fetchData
  };
}
