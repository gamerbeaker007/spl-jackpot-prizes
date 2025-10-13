import { useCallback, useEffect, useState } from 'react'
import { Balance } from '../types/balances'

interface UseJackpotBalancesReturn {
  jackpotData: Balance[]
  jackpotSkinsData: Balance[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}


interface UseJackpotBalancesOptions {
  autoFetch?: boolean
}


async function fetchBalances(username: string): Promise<Balance[]> {
  const response = await fetch(`/api/jackpot-balances?username=${username}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch jackpot data for ${username}: ${response.status}`)
  }
  const result = await response.json()
  if (result.error) {
    throw new Error(result.error)
  }
  return result
}


export function useJackpotBalances(options: UseJackpotBalancesOptions = {}): UseJackpotBalancesReturn {
  const { autoFetch } = options

  const [jackpotData, setJackpotData] = useState<Balance[]>([])
  const [jackpotSkinsData, setJackpotSkinsData] = useState<Balance[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch jackpot balances
      const jackpotResult = await fetchBalances('$JACKPOT')
      setJackpotData(jackpotResult)
      console.log('Fetched jackpot data:', jackpotResult)
      // Fetch jackpot skins balances
      const jackpotSkinsResult = await fetchBalances('$JACKPOT_SKINS')
      console.log('Fetched jackpot skins data:', jackpotSkinsResult)
      setJackpotSkinsData(jackpotSkinsResult)
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
    jackpotSkinsData,
    loading,
    error,
    refetch: fetchData
  }
}
