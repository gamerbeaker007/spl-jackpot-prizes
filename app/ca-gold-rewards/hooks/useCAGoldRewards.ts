import { useCallback, useEffect, useState } from 'react'
import { SplCAGoldReward } from '../types/cardCollection'

interface UseCAGoldRewardReturn {
  caGoldRewards: SplCAGoldReward[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

interface UseCAGoldRewardsOptions {
  autoFetch?: boolean
}

export function useCAGoldRewards(options: UseCAGoldRewardsOptions = {}): UseCAGoldRewardReturn {
  const { autoFetch = true } = options

  const [caGoldRewards, setCaGoldRewards] = useState<SplCAGoldReward[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ca-gold-rewards', {
        cache: 'force-cache',
        next: { revalidate: 300 } // 5 minutes cache
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch jackpot data: ${response.status}`)
      }
      const data: SplCAGoldReward[] = await response.json()
      setCaGoldRewards(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch jackpot data'
      setError(errorMessage)
      console.error('Jackpot data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (autoFetch) {
      fetchData()
    }
  }, [fetchData, autoFetch])

  return {
    caGoldRewards,
    loading,
    error,
    refetch: fetchData
  }
}
