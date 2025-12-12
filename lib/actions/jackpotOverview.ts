'use server'

import { PackJackpotCard } from '@/app/types/packJackpot';
import { fetchPackJackpotOverview } from '@/lib/api/splApi';
import { cacheLife } from "next/cache";


export async function getJackpotOverview(edition: number = 14): Promise<PackJackpotCard[]> {
  'use cache'
  cacheLife('seconds')

  return await fetchPackJackpotOverview(edition)
}
