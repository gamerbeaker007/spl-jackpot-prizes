import { NextRequest, NextResponse } from 'next/server'
import { fetchPackJackpotOverview } from '@/lib/api/splApi'
import logger from '@/lib/log/logger.server'

export async function GET(req: NextRequest) {
  try {
    const edition = req.nextUrl.searchParams.get('edition') || '14'
    const editionNum = parseInt(edition, 10)
    
    if (isNaN(editionNum)) {
      logger.warn(`Invalid edition parameter: ${edition}`);
      return NextResponse.json({ error: 'Invalid edition parameter' }, { status: 400 })
    }

    logger.info(`Jackpot overview API route called for edition ${editionNum}`);
    const data = await fetchPackJackpotOverview(editionNum);
    logger.info(`Jackpot overview API route completed: ${data.length} jackpot cards for edition ${editionNum}`);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Jackpot overview API error: ${errorMessage}`);
    return NextResponse.json({ error: 'Failed to fetch jackpot overview' }, { status: 500 });
  }
}