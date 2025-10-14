import { useCallback, useEffect, useState } from 'react'
import { Balance } from '../types/balances'

interface UseJackpotPrizesReturn {
  jackpotPrizes: Balance[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

interface UseJackpotPrizesOptions {
  autoFetch?: boolean
}

export function useJackpotPrizes(options: UseJackpotPrizesOptions = {}): UseJackpotPrizesReturn {
  const { autoFetch = true } = options

  const [jackpotPrizes, setJackpotPrizes] = useState<Balance[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/jackpot-balances')
      if (!response.ok) {
        throw new Error(`Failed to fetch jackpot data: ${response.status}`)
      }
      const data: Balance[] = await response.json()
      setJackpotPrizes(data)
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
    jackpotPrizes,
    loading,
    error,
    refetch: fetchData
  }
}
