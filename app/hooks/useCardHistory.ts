import { useCallback, useState } from 'react'
import { CardHistoryResponse } from '../types/cardHistory'

interface UseCardHistoryReturn {
  cardHistory: CardHistoryResponse | null
  loading: boolean
  error: string | null
  fetchCardHistory: (cardId: string) => Promise<void>
}

export function useCardHistory(): UseCardHistoryReturn {
  const [cardHistory, setCardHistory] = useState<CardHistoryResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCardHistory = useCallback(async (cardId: string) => {
    if (!cardId || !cardId.trim()) {
      setError('Invalid card ID provided')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/card-history?uid=${encodeURIComponent(cardId)}`,
        {
          cache: 'force-cache',
          next: { revalidate: 3600 } // 1 hour cache
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch card history: ${response.status}`)
      }

      const data: CardHistoryResponse = await response.json()

      // Check for API-level errors
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format')
      }

      setCardHistory(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch card history'
      setError(errorMessage)
      console.error('Card history fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    cardHistory,
    loading,
    error,
    fetchCardHistory
  }
}
