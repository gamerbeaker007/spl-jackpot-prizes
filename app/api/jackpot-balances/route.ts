import { fetchJackPotPrizes } from '@/lib/api/splApi';
import logger from '@/lib/log/logger.server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    logger.info('Jackpot prizes API route called');
    const data = await fetchJackPotPrizes();
    logger.info(`Jackpot prizes API route completed: ${data.length} prizes`);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5 minutes cache, 10 minutes stale
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Jackpot prizes API error: ${errorMessage}`);
    return NextResponse.json({ error: 'Failed to fetch jackpot prizes' }, { status: 500 });
  }
}
