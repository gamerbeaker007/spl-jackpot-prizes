import { useCallback, useEffect, useState } from 'react'
import { Skins } from '../types/skins'

interface UseJackpotSkinsReturn {
  jackpotSkins: Skins[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

interface UseJackpotSkinsOptions {
  autoFetch?: boolean
}

export function useJackpotSkins(options: UseJackpotSkinsOptions = {}): UseJackpotSkinsReturn {
  const { autoFetch = true } = options

  const [jackpotSkins, setJackpotSkins] = useState<Skins[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/jackpot-skins', {
        cache: 'force-cache',
        next: { revalidate: 300 } // 5 minutes cache
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch jackpot data: ${response.status}`)
      }
      const data: Skins[] = await response.json()
      setJackpotSkins(data)
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
    jackpotSkins,
    loading,
    error,
    refetch: fetchData
  }
}
