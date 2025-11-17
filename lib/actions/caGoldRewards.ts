'use server'

import { fetchJackPotGold } from '@/lib/api/splApi'
import { SplCAGoldReward } from '@/app/ca-gold-rewards/types/cardCollection'
import { cacheLife } from "next/cache";

export async function getJackpotGoldCards(): Promise<SplCAGoldReward[]> {
  'use cache'
  cacheLife('seconds')

  return await fetchJackPotGold()
}
