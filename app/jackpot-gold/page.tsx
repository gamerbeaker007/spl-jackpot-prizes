'use client'

import RarityFilter from '@/components/shared/RarityFilter'
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Divider,
  Typography
} from '@mui/material'
import { useMemo, useState } from 'react'
import { useCardDetails } from '../hooks/useCardDetails'
import { JackpotCardDetail } from './component/JackpotCardDetail'
import { useJackpotGold } from './hooks/useJackpotGold'

export default function JackpotPrizesPage() {
  const { jackpotGold, loading, error } = useJackpotGold({ autoFetch: true })
  const { cardDetails, loading: loadingCardDetails, error: errorCardDetails } = useCardDetails({ autoFetch: true })
  const [selectedRarities, setSelectedRarities] = useState<number[]>([])

  const toggleRarity = (rarity: number) => {
    setSelectedRarities((prev) =>
      prev.includes(rarity) ? prev.filter((r) => r !== rarity) : [...prev, rarity]
    )
  }

  const filteredCards = useMemo(() => {
    if (selectedRarities.length === 0) return jackpotGold
    return jackpotGold.filter((jackpot) => {
      const card = cardDetails.find((c) => c.id === jackpot.id)
      return card && selectedRarities.includes(card.rarity)
    })
  }, [jackpotGold, cardDetails, selectedRarities])

  if (loading || loadingCardDetails) {
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

  if (error || errorCardDetails) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load jackpot data: {error || errorCardDetails}
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      {/* Page Title */}
      <Typography variant="h4" component="h1" gutterBottom>
        Jackpot Gold
      </Typography>

      {/* Rarity Filter */}
      <Box sx={{ mb: 4 }}>
        <RarityFilter selected={selectedRarities} onToggle={toggleRarity} />
      </Box>

      {/* Cards Grid */}
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
        {filteredCards.map((item) => (
          <JackpotCardDetail key={`jackpot-${item.id}-${item.foil}`} item={item} cardDetails={cardDetails} />
        ))}
      </Box>

      {filteredCards.length === 0 && (
        <Box textAlign="center" mb={6}>
          <Typography variant="h6" color="text.secondary">
            {selectedRarities.length === 0 ? 'No jackpot data available' : 'No cards match the selected rarity filters'}
          </Typography>
        </Box>
      )}

      {/* Divider */}
      <Divider sx={{ my: 4 }} />

    </Container>
  )
}
