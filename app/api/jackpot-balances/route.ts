import { fetchBalances } from '@/lib/api/splApi';
import logger from '@/lib/log/logger.server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    logger.info('Jackpot balances API route called');
    const data = await fetchBalances();
    logger.info(`Jackpot balances API route completed: ${data.length} balances`);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Jackpot balances API error: ${errorMessage}`);
    return NextResponse.json({ error: 'Failed to fetch jackpot balances' }, { status: 500 });
  }
}