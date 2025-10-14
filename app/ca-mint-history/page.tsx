'use client'

import { Alert, Box, CircularProgress } from '@mui/material'
import { useCardDetails } from '../hooks/useCardDetails'
import ClientCardGrid from './components/ClientCardGrid'
import { useJackPotOverview } from './hooks/useCardData'

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

  return <ClientCardGrid jackpotData={jackpotData} cardDetails={cardDetails} />
}
