import { fetchRankedDrawsPrizeOverview } from '@/lib/api/splApi';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await fetchRankedDrawsPrizeOverview();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5 minutes cache, 10 minutes stale
      },
    });
  } catch (error) {
    console.error('Error in ranked-draws-overview API:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch ranked draws prize overview',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
