import { useCallback, useEffect, useState } from 'react'
import { JackpotGoldCardDetails } from '../types/cardCollection'

interface UseJackpotGoldReturn {
  jackpotGold: JackpotGoldCardDetails[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

interface UseJackpotGoldOptions {
  autoFetch?: boolean
}

export function useJackpotGold(options: UseJackpotGoldOptions = {}): UseJackpotGoldReturn {
  const { autoFetch = true } = options

  const [jackpotGold, setJackpotGold] = useState<JackpotGoldCardDetails[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/jackpot-gold')
      if (!response.ok) {
        throw new Error(`Failed to fetch jackpot data: ${response.status}`)
      }
      const data: JackpotGoldCardDetails[] = await response.json()
      setJackpotGold(data)
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
    jackpotGold,
    loading,
    error,
    refetch: fetchData
  }
}
