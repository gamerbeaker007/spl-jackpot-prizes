import { useCallback, useEffect, useState } from 'react'
import { PackJackpotCard } from '../types/packJackpot'

interface UseCardDataReturn {
  jackpotData: PackJackpotCard[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

interface UseCardDataOptions {
  edition?: number
  autoFetch?: boolean
}

export function useJackPotOverview(options: UseCardDataOptions = {}): UseCardDataReturn {
  const { edition = 14, autoFetch = true } = options
  const [jackpotData, setJackpotData] = useState<PackJackpotCard[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const jackpotResponse = await fetch(`/api/jackpot-overview?edition=${edition}`, {
        cache: 'force-cache',
        next: { revalidate: 300 } // 5 minutes cache
      })

      if (!jackpotResponse.ok) {
        throw new Error(`Failed to fetch jackpot data: ${jackpotResponse.status}`)
      }

      const jackpotResult = await jackpotResponse.json()


      // Check for API-level errors
      if (jackpotResult.error) {
        throw new Error(jackpotResult.error)
      }

      setJackpotData(jackpotResult)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data'
      setError(errorMessage)
      console.error('Card data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [edition])

  useEffect(() => {
    if (autoFetch) {
      fetchData()
    }
  }, [fetchData, autoFetch])

  return {
    jackpotData,
    loading,
    error,
    refetch: fetchData
  }
}
