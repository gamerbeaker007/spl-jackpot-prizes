'use client'

import { useState, useMemo } from 'react'
import { Container, Box } from '@mui/material'
import RarityFilter from './rarityFilter'
import Card from './Card'
import { PackJackpotCard } from '../types/packJackpot'
import { CardDetail } from '../types/cardDetails'

interface Props {
  jackpotData: PackJackpotCard[]
  cardData: CardDetail[]
}

export default function ClientCardGrid({ jackpotData, cardData }: Props) {
  const [selectedRarities, setSelectedRarities] = useState<number[]>([])

  const toggleRarity = (rarity: number) => {
    setSelectedRarities((prev) =>
      prev.includes(rarity) ? prev.filter((r) => r !== rarity) : [...prev, rarity]
    )
  }

  const filteredCards = useMemo(() => {
    if (selectedRarities.length === 0) return jackpotData
    return jackpotData.filter((jackpot) => {
      const card = cardData.find((c) => c.id === jackpot.card_detail_id)
      return card && selectedRarities.includes(card.rarity)
    })
  }, [jackpotData, cardData, selectedRarities])

  return (
    <Container maxWidth="xl">
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
          const card = cardData.find((c) => c.id === jackpot.card_detail_id)
          return card ? <Card key={card.id} jackpot={jackpot} card={card} /> : null
        })}
      </Box>
    </Container>
  )
}
