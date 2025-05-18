'use client'

import { useState, useMemo } from 'react'
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
    <>
      <RarityFilter selected={selectedRarities} onToggle={toggleRarity} />

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredCards.map((jackpot) => {
          const card = cardData.find((c) => c.id === jackpot.card_detail_id)
          return card ? <Card key={card.id} jackpot={jackpot} card={card} /> : null
        })}
      </div>
    </>
  )
}
