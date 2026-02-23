'use server'

import { Skins } from '@/app/jackpot-prizes/types/skins';
import { fetchJackPotSkins } from '@/lib/api/splApi';


export async function getJackpotSkins(): Promise<Skins[]> {
  return await fetchJackPotSkins();
}
