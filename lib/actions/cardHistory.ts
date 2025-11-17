'use server'

import { CardHistoryResponse } from '@/app/types/cardHistory';
import { fetchCardHistory } from '@/lib/api/splApi'
import { cacheLife } from "next/cache";


export async function getCardHistory(uid: string): Promise<CardHistoryResponse> {
  'use cache'
  cacheLife('minutes')

  return await fetchCardHistory(uid)
}
