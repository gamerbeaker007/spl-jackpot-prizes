"use client";

import { JackpotCard } from "@/app/jackpot-prizes/component/JackpotCard";
import { useJackpotCards } from "@/app/jackpot-prizes/hooks/useJackpotCards";
import { JackpotCardDetail } from "@/app/jackpot-prizes/types/card";
import { SplCardDetail } from "@/app/types/shared";
import RarityFilter from "@/components/shared/RarityFilter";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Alert, Box, CircularProgress, Divider, Tooltip, Typography } from "@mui/material";
import { useCallback, useState } from "react";

interface Props {
  cardDetails: SplCardDetail[];
}

function findRarity(card: JackpotCardDetail, cardDetails: SplCardDetail[]) {
  return cardDetails.find((detail) => detail.id === card.id)?.rarity || 0;
}

export function JackpotCardSection({ cardDetails }: Props) {
  const { jackpotCards, error, loading } = useJackpotCards();
  const [selectedRarities, setSelectedRarities] = useState<number[]>([]);

  const toggleRarity = useCallback((rarity: number) => {
    setSelectedRarities((prev) => (prev.includes(rarity) ? prev.filter((r) => r !== rarity) : [...prev, rarity]));
  }, []);

  const filteredCards =
    selectedRarities.length === 0
      ? jackpotCards
      : jackpotCards.filter((card) => selectedRarities.includes(findRarity(card, cardDetails)));

  const sortedCards = filteredCards.toSorted((a, b) => {
    // First sort by id
    if (a.id !== b.id) {
      return a.id - b.id;
    }
    // Then sort by foil
    return a.foil - b.foil;
  });

  if (loading)
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2}>
        <Typography variant="h4" gutterBottom>
          Loading....
        </Typography>
        <CircularProgress size={20} />
      </Box>
    );

  if (error)
    return (
      <Box p={3}>
        <Alert severity="error">Failed to load jackpot card data: {error}</Alert>
      </Box>
    );

  return (
    <Box>
      <Box display="flex" flexDirection="column">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography variant="h4" component="h1">
            Jackpot Card Data
          </Typography>
          <Tooltip title="Note: this information is based on daily cache so actual number can be off by a day">
            <WarningAmberIcon sx={{ color: "warning.main", fontSize: 28 }} />
          </Tooltip>
        </Box>
      </Box>
      <RarityFilter selected={selectedRarities} onToggle={toggleRarity} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
            md: "repeat(5, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          gap: 3,
          mb: 6,
        }}
      >
        {sortedCards.map((item) => (
          <JackpotCard key={`jackpot-${item.id}-${item.foil}`} item={item} cardDetails={cardDetails} />
        ))}
      </Box>

      {filteredCards.length === 0 && (
        <Box textAlign="center" mb={6}>
          <Typography variant="h6" color="text.secondary">
            {selectedRarities.length > 0 ? "No cards match the selected rarities" : "No jackpot data available"}
          </Typography>
        </Box>
      )}

      {/* Divider */}
      <Divider sx={{ my: 4 }} />
    </Box>
  );
}
