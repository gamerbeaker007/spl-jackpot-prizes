'use server'

import { PackJackpotCard } from '@/app/types/packJackpot';
import { fetchPackJackpotOverview } from '@/lib/api/splApi';


export async function getJackpotOverview(edition: number = 14): Promise<PackJackpotCard[]> {
  return await fetchPackJackpotOverview(edition)
}
