'use server'

import { SplCAGoldReward } from '@/app/ca-gold-rewards/types/cardCollection'
import { fetchJackPotGold } from '@/lib/api/splApi'

export async function getJackpotGoldCards(): Promise<SplCAGoldReward[]> {
  return await fetchJackPotGold()
}
