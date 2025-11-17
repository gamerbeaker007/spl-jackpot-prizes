'use server'

import { fetchJackPotPrizes } from '@/lib/api/splApi'
import { Balance } from '@/app/jackpot-prizes/types/balances'
import { cacheLife } from "next/cache";


export async function getJackpotBalances(): Promise<Balance[]> {
  'use cache'
  cacheLife('minutes')

  return await fetchJackPotPrizes()
}
