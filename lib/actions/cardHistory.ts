'use server'

import { CardHistoryResponse } from '@/app/types/cardHistory';
import { fetchCardHistory } from '@/lib/api/splApi'


export async function getCardHistory(uid: string): Promise<CardHistoryResponse> {
  return await fetchCardHistory(uid)
}
