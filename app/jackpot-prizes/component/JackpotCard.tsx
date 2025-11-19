import { SplCardDetail } from "@/app/types/shared";
import { Box, Card, CardContent, Typography } from "@mui/material";
import Image from "next/image";

import { JackpotCardDetail } from "@/app/jackpot-prizes/types/card";
import { getCardImageUrl, getFallbackImageUrl } from "@/lib/utils/imageUtils";

interface Props {
  item: JackpotCardDetail;
  cardDetails: SplCardDetail[];
}

const foilMap: Record<number, string> = {
  0: "Regular Foil",
  1: "Gold Foil",
  2: "Gold Arcane Foil",
  3: "Black Foil",
  4: "Black Arcane Foil",
};

export function JackpotCard({ item, cardDetails }: Props) {
  const cardDetailId = item.id;

  const cardDetail = cardDetails.find((detail) => detail.id === cardDetailId);
  const cardName = cardDetail?.name || "";

  // Early return if card detail is not found
  if (!cardDetail || !cardName.trim()) {
    console.warn(`Card detail not found for ID: ${cardDetailId}`);
    return (
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", p: 3 }}>
          <Typography variant="h6" color="error" textAlign="center">
            Card data not found (ID: {cardDetailId})
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const cleanCardName = cardName.trim();

  // Use the utility function for safe image URL generation
  const imageUrl = getCardImageUrl(cleanCardName, item.foil);
  const fallbackUrl = getFallbackImageUrl(cleanCardName);

  return (
    <Card sx={{ width: 200 }}>
      <CardContent>
        <Box display="flex" flexDirection="row" gap={1} alignItems="center">
          <Box display="flex" flexDirection="column" gap={1} flex={1}>
            <Box sx={{ position: "relative", width: "100%", aspectRatio: "260/360" }}>
              <Image
                src={imageUrl}
                alt={cardDetail.name}
                fill
                style={{ objectFit: "contain" }}
                onError={(e) => {
                  console.warn(`Image failed to load: ${imageUrl}`);
                  // Fallback to regular card image if foil image fails
                  (e.target as HTMLImageElement).src = fallbackUrl;
                }}
                unoptimized // Disable Next.js optimization for external images
              />
            </Box>
            <Typography variant="body1" fontSize={15} fontWeight="bold" gutterBottom textAlign="center">
              {cardDetail.name}
            </Typography>
            <Typography variant="caption" fontSize={10} fontWeight="bold" gutterBottom textAlign="center">
              {foilMap[item.foil] || "Unknown"}
            </Typography>
            <Typography
              variant="h5"
              fontWeight="bold"
              color={Number(item.qty) > 0 ? "success.main" : "text.secondary"}
              textAlign="center"
            >
              {item.qty.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
