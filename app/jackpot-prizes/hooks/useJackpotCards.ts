"use client";
import { JackpotCardDetail } from "@/app/jackpot-prizes/types/card";
import { getJackpotCards } from "@/lib/actions/jackpotCards";
import { useCallback, useEffect, useState } from "react";

interface UseJackpotCardsReturn {
  jackpotCards: JackpotCardDetail[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface Props {
  autoFetch?: boolean;
}

export function useJackpotCards(options: Props = {}): UseJackpotCardsReturn {
  const { autoFetch = true } = options;

  const [jackpotCards, setJackpotCards] = useState<JackpotCardDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const cards = await getJackpotCards();
      setJackpotCards(cards);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch jackpot data";
      setError(errorMessage);
      console.error("Jackpot data fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return {
    jackpotCards,
    loading,
    error,
    refetch: fetchData,
  };
}
