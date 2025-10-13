import { NextRequest, NextResponse } from 'next/server'
import { fetchMintHistory } from '@/lib/api/splApi'
import logger from '@/lib/log/logger.server'

export async function GET(req: NextRequest) {
  const foil = req.nextUrl.searchParams.get('foil')
  const cardId = req.nextUrl.searchParams.get('card_detail_id')

  if (!foil || !cardId) {
    logger.warn('Missing query parameters in mint history request');
    return NextResponse.json({ error: 'Missing query params' }, { status: 400 })
  }

  const foilNum = parseInt(foil, 10);
  const cardIdNum = parseInt(cardId, 10);

  if (isNaN(foilNum) || isNaN(cardIdNum)) {
    logger.warn(`Invalid parameters: foil=${foil}, cardId=${cardId}`);
    return NextResponse.json({ error: 'Invalid query params' }, { status: 400 })
  }

  try {
    const data = await fetchMintHistory(foilNum, cardIdNum);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Mint history API error: ${errorMessage}`);
    return NextResponse.json({ error: 'Failed to fetch mint history' }, { status: 500 });
  }
}
