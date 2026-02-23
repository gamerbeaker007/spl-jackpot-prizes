'use server'

import { MintHistoryResponse } from '@/app/types/shared'
import { fetchMintHistory } from '@/lib/api/splApi'


export async function getMintHistoryAction(
  foil: number,
  cardId: number
): Promise<MintHistoryResponse> {
  return await fetchMintHistory(foil, cardId)
}
