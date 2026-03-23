"use client";

import { getRecentWinnersAction } from "@/lib/actions/mintHistory";
import { useEffect, useState } from "react";
import { RecentWinner } from "../types/shared";

export function useRecentWinners(edition: number) {
  const [winners, setWinners] = useState<RecentWinner[]>([]);
  const [loading, setLoading] = useState(edition !== undefined);

  useEffect(() => {
    if (edition === undefined) {
      setWinners([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getRecentWinnersAction(edition)
      .then(setWinners)
      .catch(() => setWinners([]))
      .finally(() => setLoading(false));
  }, [edition]);

  return { winners, loading };
}
