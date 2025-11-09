'use client'

import { CardPrizeData, SplCardDetail } from '@/app/types/shared';
import { Box, Container, Stack, Typography } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import Card from './Card';
import RarityFilter from './RarityFilter';

interface Props {
  prizeData: CardPrizeData[];
  cardDetails: SplCardDetail[];
  title: string;
  subtitle?: string;
}

export default function ClientCardGrid({ prizeData, cardDetails, title, subtitle }: Props) {
  const [selectedRarities, setSelectedRarities] = useState<number[]>([]);

  const toggleRarity = useCallback((rarity: number) => {
    setSelectedRarities((prev) =>
      prev.includes(rarity) ? prev.filter((r) => r !== rarity) : [...prev, rarity]
    );
  }, []);

  const filteredCards = useMemo(() => {
    if (selectedRarities.length === 0) return prizeData;
    return prizeData.filter((prize) => {
      const card = cardDetails.find((c) => c.id === prize.card_detail_id);
      return card && selectedRarities.includes(card.rarity);
    });
  }, [prizeData, cardDetails, selectedRarities]);

  const totals = useMemo(() =>
    prizeData.reduce(
      (acc, card) => {
        acc.total += card.total;
        acc.total_minted += card.total_minted;
        return acc;
      },
      { total: 0, total_minted: 0 }
    ),
    [prizeData]
  );

  const totalsFiltered = useMemo(() =>
    filteredCards.reduce(
      (acc, card) => {
        acc.total += card.total;
        acc.total_minted += card.total_minted;
        return acc;
      },
      { total: 0, total_minted: 0 }
    ),
    [filteredCards]
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Stack>
          <Typography variant="h4" align="center">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" align="center">
              {subtitle}
            </Typography>
          )}
          <Typography variant="body1" align="center">
            Totals: {totals.total_minted} minted / {totals.total} cards
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Stack>
          <RarityFilter selected={selectedRarities} onToggle={toggleRarity} />
          <Typography variant="caption" align="center">
            Filtered: {totalsFiltered.total_minted} minted / {totalsFiltered.total} cards
          </Typography>
        </Stack>
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
        {filteredCards.map((prize) => {
          const card = cardDetails.find((c) => c.id === prize.card_detail_id);
          return card ? <Card key={card.id} prizeData={prize} card={card} /> : null;
        })}
      </Box>
    </Container>
  );
}
