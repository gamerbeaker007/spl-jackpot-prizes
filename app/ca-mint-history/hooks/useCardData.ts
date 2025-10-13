import { useCallback, useEffect, useState } from 'react'
import { CardDetail } from '../types/cardDetails'
import { PackJackpotCard } from '../types/packJackpot'

interface UseCardDataReturn {
  jackpotData: PackJackpotCard[]
  cardData: CardDetail[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

interface UseCardDataOptions {
  edition?: number
  autoFetch?: boolean
}

export function useCardData(options: UseCardDataOptions = {}): UseCardDataReturn {
  const { edition = 14, autoFetch = true } = options

  const [jackpotData, setJackpotData] = useState<PackJackpotCard[]>([])
  const [cardData, setCardData] = useState<CardDetail[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [jackpotResponse, cardResponse] = await Promise.all([
        fetch(`/api/jackpot-overview?edition=${edition}`, {
          cache: 'force-cache',
        }),
        fetch('/api/card-details', {
          cache: 'force-cache',
        })
      ])

      if (!jackpotResponse.ok) {
        throw new Error(`Failed to fetch jackpot data: ${jackpotResponse.status}`)
      }

      if (!cardResponse.ok) {
        throw new Error(`Failed to fetch card data: ${cardResponse.status}`)
      }

      const [jackpotResult, cardResult] = await Promise.all([
        jackpotResponse.json(),
        cardResponse.json()
      ])

      // Check for API-level errors
      if (jackpotResult.error) {
        throw new Error(jackpotResult.error)
      }

      if (cardResult.error) {
        throw new Error(cardResult.error)
      }

      setJackpotData(jackpotResult)
      setCardData(cardResult)
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
    cardData,
    loading,
    error,
    refetch: fetchData
  }
}
