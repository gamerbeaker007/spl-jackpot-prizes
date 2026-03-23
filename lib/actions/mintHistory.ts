'use server'

import { MintHistoryResponse, RecentWinner } from '@/app/types/shared'
import { fetchFrontierDrawsRecentPrizes, fetchMintHistory, fetchRankedDrawsRecentPrizes } from '@/lib/api/splApi'

export async function getMintHistoryAction(
  foil: number,
  cardId: number
): Promise<MintHistoryResponse> {
  return await fetchMintHistory(foil, cardId)
}

export async function getRecentWinnersAction(edition: number = 14): Promise<RecentWinner[]> {
  const foilTypes = [2, 3, 4]

  const fetchForFoil = (foil: number) => {
    if (edition === 18) return fetchRankedDrawsRecentPrizes(foil)
    if (edition === 15) return fetchFrontierDrawsRecentPrizes(foil)
    return fetchMintHistory(foil, 0, true, edition)
  }

  const results = await Promise.allSettled(foilTypes.map(fetchForFoil))

  const combined: RecentWinner[] = []

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const foil = foilTypes[index]
      result.value.forEach((item) => {
        combined.push({ ...item, foil })
      })
    }
  })

  combined.sort(
    (a, b) => new Date(b.mint_date ?? 0).getTime() - new Date(a.mint_date ?? 0).getTime()
  )

  // Filter to last 8 days
  const cutoff = Date.now() - 8 * 24 * 60 * 60 * 1000
  const filtered = combined.filter((item) => item.mint_date && new Date(item.mint_date).getTime() >= cutoff)

  return filtered
}
