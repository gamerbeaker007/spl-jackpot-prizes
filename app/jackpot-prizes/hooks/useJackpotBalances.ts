import { useState, useEffect, useCallback } from 'react'
import { Balance } from '../types/balances'

interface UseJackpotBalancesReturn {
  jackpotData: Balance[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}


interface UseJackpotBalancesOptions {
  autoFetch?: boolean
}

export function useJackpotBalances(options: UseJackpotBalancesOptions = {}): UseJackpotBalancesReturn {
  const { autoFetch } = options

  const [jackpotData, setJackpotData] = useState<Balance[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const jackpotResponse = await fetch(`/api/jackpot-balances`, {
        cache: 'force-cache',
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
  }, [])

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