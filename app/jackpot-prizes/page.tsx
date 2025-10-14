'use client'

import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Divider,
  Typography
} from '@mui/material'
import { useCardDetails } from '../hooks/useCardDetails'
import { BalanceCard } from './component/BalanceCard'
import { SkinsCard } from './component/SkinsCard'
import { useJackpotPrizes } from './hooks/useJackpotPrizes'
import { useJackpotSkins } from './hooks/useJackpotSkins'

// Helper component to render a single balance card

export default function JackpotPrizesPage() {
  const { jackpotPrizes, loading, error } = useJackpotPrizes({ autoFetch: true })
  const { jackpotSkins, loading: loadingSkins, error: errorSkins } = useJackpotSkins({ autoFetch: true })
  const { cardDetails, loading: loadingCardDetails, error: errorCardDetails } = useCardDetails({ autoFetch: true })

  if (loading || loadingSkins || loadingCardDetails) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error || errorSkins || errorCardDetails) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load jackpot data: {error || errorSkins || errorCardDetails}
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      {/* First Part - Jackpot Data */}
      <Typography variant="h4" component="h1" gutterBottom>
        Jackpot Data
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: 3,
          mb: 6
        }}
      >
        {jackpotPrizes.map((item) => (
          <BalanceCard key={`jackpot-${item.token}`} item={item} />
        ))}
      </Box>

      {jackpotPrizes.length === 0 && (
        <Box textAlign="center" mb={6}>
          <Typography variant="h6" color="text.secondary">
            No jackpot data available
          </Typography>
        </Box>
      )}

      {/* Divider */}
      <Divider sx={{ my: 4 }} />

      {/* Second Part - Jackpot Skins Data */}
      <Typography variant="h4" component="h2" gutterBottom>
        Jackpot Skins Data
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: 3
        }}
      >
        {jackpotSkins.map((item) => (
          <SkinsCard key={`jackpot-skins-${item.skin_detail_id}`} item={item} cardDetails={cardDetails} />
        ))}
      </Box>

      {jackpotSkins.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="text.secondary">
            No jackpot skins data available
          </Typography>
        </Box>
      )}
    </Container>
  )
}
