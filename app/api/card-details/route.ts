import { fetchCardDetails } from '@/lib/api/splApi';
import logger from '@/lib/log/logger.server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    logger.info('Card details API route called');
    const data = await fetchCardDetails();
    logger.info(`Card details API route completed: ${data.length} cards`);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200', // 1 hour cache, 2 hours stale
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Card details API error: ${errorMessage}`);
    return NextResponse.json({ error: 'Failed to fetch card details' }, { status: 500 });
  }
}
