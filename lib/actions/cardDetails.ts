'use server'

import { SplCardDetail } from '@/app/types/shared';
import { fetchCardDetails } from '@/lib/api/splApi'
import { cacheLife } from "next/cache";


export async function getCardDetails(): Promise<SplCardDetail[]> {
  'use cache'
  cacheLife('hours')

  return await fetchCardDetails()
}
