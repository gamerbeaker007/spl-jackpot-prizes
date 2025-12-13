"use client";

import { SplCardDetail } from "@/app/types/shared";
import RarityFilter from "@/components/shared/RarityFilter";
import { Box, Container, Divider, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { CAGoldRewardCardDetail } from "../component/CAGoldRerwardCardDetail";
import { SplCAGoldReward } from "../types/cardCollection";

interface Props {
  caGoldRewards: SplCAGoldReward[];
  cardDetails: SplCardDetail[];
}

export default function CAGoldRewardsClient({ caGoldRewards, cardDetails }: Props) {
  const [selectedRarities, setSelectedRarities] = useState<number[]>([]);

  const toggleRarity = useCallback((rarity: number) => {
    setSelectedRarities((prev) => (prev.includes(rarity) ? prev.filter((r) => r !== rarity) : [...prev, rarity]));
  }, []);

  const filteredCards = useMemo(() => {
    if (selectedRarities.length === 0) return caGoldRewards;
    return caGoldRewards.filter((rewardCard) => {
      const card = cardDetails.find((c) => c.id === rewardCard.card_detail_id);
      return card && selectedRarities.includes(card.rarity);
    });
  }, [caGoldRewards, cardDetails, selectedRarities]);

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
      {cardDetails && filteredCards && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 6,
          }}
        >
          {filteredCards.map((item) => {
            return (
            <CAGoldRewardCardDetail key={item.card_detail_id} item={item} cardDetails={cardDetails} />
          )})}
        </Box>
      )}
      {filteredCards.length === 0 && (
        <Box textAlign="center" mb={6}>
          <Typography variant="h6" color="text.secondary">
            {selectedRarities.length === 0 ? "No jackpot data available" : "No cards match the selected rarity filters"}
          </Typography>
        </Box>
      )}

      {/* Divider */}
      <Divider sx={{ my: 4 }} />
    </Container>
  );
}
