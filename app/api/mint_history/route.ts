import { MintHistoryResponse } from '@/app/types/mintHistory'
import { NextRequest, NextResponse } from 'next/server'

type CacheEntry = {
  data: MintHistoryResponse
  timestamp: number
}

const cache = new Map<string, CacheEntry>()
const CACHE_DURATION_MS = 30 * 60 * 1000 // 30 minutes

export async function GET(req: NextRequest) {
  const foil = req.nextUrl.searchParams.get('foil')
  const cardId = req.nextUrl.searchParams.get('card_detail_id')

  if (!foil || !cardId) {
    return NextResponse.json({ error: 'Missing query params' }, { status: 400 })
  }

  const cacheKey = `${foil}:${cardId}`
  const now = Date.now()

  // check cache
  const entry = cache.get(cacheKey)
  if (entry && now - entry.timestamp < CACHE_DURATION_MS) {
    return NextResponse.json(entry.data)
  }

  // fetch from Splinterlands
  try {
    const res = await fetch(
      `https://api.splinterlands.com/cards/mint_history?foil=${foil}&card_detail_id=${cardId}`,
      { cache: 'no-store' }
    )
    const data = await res.json()

    // save to cache
    cache.set(cacheKey, { data, timestamp: now })

    return NextResponse.json(data)
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch error:', error.message)
    } else {
      console.error('Unknown error during fetch.')
  }

    return NextResponse.json({ error: 'Failed to fetch mint history' }, { status: 500 })
  }
}
