import { fetchJackPotSkins } from '@/lib/api/splApi';
import logger from '@/lib/log/logger.server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    logger.info('Jackpot skins API route called');
    const data = await fetchJackPotSkins();
    logger.info(`Jackpot skins API route completed: ${data.length} skins`);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Jackpot prizes API error: ${errorMessage}`);
    return NextResponse.json({ error: 'Failed to fetch jackpot prizes' }, { status: 500 });
  }
}
