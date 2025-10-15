'use client'

import { Box, Container, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { CardDetail } from '../types/cardDetails'
import { PackJackpotCard } from '../types/packJackpot'
import Card from './Card'
import RarityFilter from './rarityFilter'

interface Props {
  jackpotData: PackJackpotCard[]
  cardDetails: CardDetail[]
}

export default function ClientCardGrid({ jackpotData, cardDetails }: Props) {
  const [selectedRarities, setSelectedRarities] = useState<number[]>([])

  const toggleRarity = (rarity: number) => {
    setSelectedRarities((prev) =>
      prev.includes(rarity) ? prev.filter((r) => r !== rarity) : [...prev, rarity]
    )
  }

  const filteredCards = useMemo(() => {
    if (selectedRarities.length === 0) return jackpotData
    return jackpotData.filter((jackpot) => {
      const card = cardDetails.find((c) => c.id === jackpot.card_detail_id)
      return card && selectedRarities.includes(card.rarity)
    })
  }, [jackpotData, cardDetails, selectedRarities])

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h4" align="center">
          Conclave Arcana Jackpot Prize Overview
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <RarityFilter selected={selectedRarities} onToggle={toggleRarity} />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 3
        }}
      >
        {filteredCards.map((jackpot) => {
          const card = cardDetails.find((c) => c.id === jackpot.card_detail_id)
          return card ? <Card key={card.id} jackpot={jackpot} card={card} /> : null
        })}
      </Box>
    </Container>
  )
}
