'use client'

import { Alert, Box, CircularProgress } from '@mui/material'
import ClientCardGrid from './components/ClientCardGrid'
import { useCardData } from './hooks/useCardData'

export default function CAMintHistoryPage() {
  const { jackpotData, cardData, loading, error } = useCardData({ edition: 14 })

  if (loading) {
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

  return <ClientCardGrid jackpotData={jackpotData} cardData={cardData} />
}
