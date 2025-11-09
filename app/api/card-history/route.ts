import { fetchCardHistory } from '@/lib/api/splApi'
import logger from '@/lib/log/logger.server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cardId = searchParams.get('uid')

    if (!cardId) {
      logger.warn('Card history API called without uid parameter')
      return NextResponse.json(
        { error: 'Missing required parameter: uid' },
        { status: 400 }
      )
    }

    logger.info(`Card history API called for card ID: ${cardId}`)

    const cardHistory = await fetchCardHistory(cardId)

    return NextResponse.json(cardHistory, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200', // 10 minutes cache, 20 minutes stale
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error(`Card history API error: ${errorMessage}`)

    return NextResponse.json(
      { error: 'Failed to fetch card history' },
      { status: 500 }
    )
  }
}
