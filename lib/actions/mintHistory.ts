'use server'

import { MintHistoryResponse, RecentWinner } from '@/app/types/shared'
import { fetchMintHistory } from '@/lib/api/splApi'


export async function getMintHistoryAction(
  foil: number,
  cardId: number
): Promise<MintHistoryResponse> {
  return await fetchMintHistory(foil, cardId)
}

export async function getRecentWinnersAction(edition: number = 14): Promise<RecentWinner[]> {
  const foilTypes = [2, 3, 4]

  const results = await Promise.allSettled(
    foilTypes.map((foil) => fetchMintHistory(foil, 0, true, edition))
  )

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

  return combined
}
