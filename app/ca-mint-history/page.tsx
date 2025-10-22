'use client'

import ClientCardGrid from '@/components/shared/ClientCardGrid'
import { Alert, Box, CircularProgress } from '@mui/material'
import { useCardDetails } from '../hooks/useCardDetails'
import { useJackPotOverview } from './hooks/useJackPotOverview'

export default function CAMintHistoryPage() {
  const { jackpotData, loading, error } = useJackPotOverview({ edition: 14 })
  const { cardDetails, loading: loadingCardDetails } = useCardDetails({ autoFetch: true })

  if (loading || loadingCardDetails) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Failed to load card data: {error}
        </Alert>
      </Box>
    )
  }

  return (
    <ClientCardGrid
      prizeData={jackpotData}
      cardDetails={cardDetails}
      title="Conclave Arcana Jackpot Prize Overview"
      subtitle="Discover cards available in CA packs"
    />
  )
}
