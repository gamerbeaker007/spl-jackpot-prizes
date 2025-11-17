'use server'

import { fetchJackPotSkins } from '@/lib/api/splApi'
import { Skins } from '@/app/jackpot-prizes/types/skins'
import { cacheLife } from "next/cache";


export async function getJackpotSkins(): Promise<Skins[]> {
  'use cache'
  cacheLife('minutes')

  return await fetchJackPotSkins()
}
