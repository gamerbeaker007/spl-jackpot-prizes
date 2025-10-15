import { useCallback, useState } from 'react'

interface MintHistoryItem {
  uid: string
  mint: string
  mint_player: string
}

interface MintHistoryResponse {
  total: number
  total_minted: number
  mints: MintHistoryItem[]
}

interface MintDataState {
  [foil: number]: MintHistoryResponse | null
}

interface LoadingState {
  [foil: number]: boolean
}

export function useMintData() {
  const [mintData, setMintData] = useState<MintDataState>({})
  const [loading, setLoading] = useState<LoadingState>({})
  const [errors, setErrors] = useState<{ [foil: number]: string }>({})

  const fetchMintData = useCallback(async (cardId: number, foil: number) => {
    // Don't fetch if already loading or already have data
    if (loading[foil] || mintData[foil]) {
      return
    }

    setLoading(prev => ({ ...prev, [foil]: true }))
    setErrors(prev => ({ ...prev, [foil]: '' }))

    try {
      const response = await fetch(
        `/api/mint_history?foil=${foil}&card_detail_id=${cardId}`,
        {
          cache: 'force-cache',
          next: { revalidate: 1800 } // 30 minutes
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch mint data: ${response.status}`)
      }

      const data: MintHistoryResponse = await response.json()

      setMintData(prev => ({ ...prev, [foil]: data }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error(`Error fetching mint data for foil ${foil}:`, errorMessage)
      setErrors(prev => ({ ...prev, [foil]: errorMessage }))
    } finally {
      setLoading(prev => ({ ...prev, [foil]: false }))
    }
  }, [loading, mintData]) // Dependencies that should prevent unnecessary re-renders

  const hasFoilData = useCallback((foil: number) => {
    return !!mintData[foil]
  }, [mintData])

  const isLoading = useCallback((foil: number) => {
    return !!loading[foil]
  }, [loading])

  const getError = useCallback((foil: number) => {
    return errors[foil] || null
  }, [errors])

  return {
    mintData,
    fetchMintData,
    hasFoilData,
    isLoading,
    getError
  }
}
