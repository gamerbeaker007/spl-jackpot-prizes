'use server'

import { PKBidsResponse, PKPricesResponse } from '@/app/types/pkPrices'
import { fetchPeakMonsterPrices, fetchPeakMonsterTopBids } from '@/lib/api/peakMonstersApi'

export async function getPeakMonsterPricesAction(): Promise<PKPricesResponse> {
  return await fetchPeakMonsterPrices()
}

export async function getPeakMonsterTopBidsAction(): Promise<PKBidsResponse> {
  return await fetchPeakMonsterTopBids()
}
