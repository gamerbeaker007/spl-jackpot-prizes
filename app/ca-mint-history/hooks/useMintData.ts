import { useState, useCallback } from 'react'
import { MintHistoryResponse } from '../types/mintHistory'

const FOIL_TYPES = [3, 2, 4]

interface UseMintDataReturn {
  mintData: Record<number, MintHistoryResponse | null>
  loadingStates: Record<number, boolean>
  fetchMintData: (cardId: number, foil?: number) => Promise<void>
}

export function useMintData(): UseMintDataReturn {
  const [mintData, setMintData] = useState<Record<number, MintHistoryResponse | null>>({})
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({})

  const fetchMintData = useCallback(async (cardId: number, specificFoil?: number) => {
    const foilsToFetch = specificFoil ? [specificFoil] : FOIL_TYPES

    // Set loading states
    const loadingUpdates: Record<number, boolean> = {}
    foilsToFetch.forEach(foil => {
      loadingUpdates[foil] = true
    })
    setLoadingStates(prev => ({ ...prev, ...loadingUpdates }))

    try {
      const results: Record<number, MintHistoryResponse | null> = {}

      await Promise.all(
        foilsToFetch.map(async (foil) => {
          try {
            const res = await fetch(`/api/mint_history?foil=${foil}&card_detail_id=${cardId}`)

            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`)
            }

            const data = await res.json()
            results[foil] = data
          } catch (error) {
            console.error(`Failed to fetch mint data for foil ${foil}:`, error)
            results[foil] = null
          }
        })
      )

      // Update mint data
      setMintData(prev => ({ ...prev, ...results }))
    } catch (error) {
      console.error('Failed to fetch mint data:', error)
    } finally {
      // Clear loading states
      const loadingClears: Record<number, boolean> = {}
      foilsToFetch.forEach(foil => {
        loadingClears[foil] = false
      })
      setLoadingStates(prev => ({ ...prev, ...loadingClears }))
    }
  }, [])

  return {
    mintData,
    loadingStates,
    fetchMintData,
  }
}
