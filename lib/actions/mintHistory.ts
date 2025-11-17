'use server'

import { fetchMintHistory } from '@/lib/api/splApi'
import { MintHistoryResponse } from '@/app/types/shared'
import { cacheLife } from "next/cache";


export async function getMintHistoryAction(
  foil: number,
  cardId: number
): Promise<MintHistoryResponse> {
  'use cache'
  cacheLife('minutes')

  return await fetchMintHistory(foil, cardId)
}
