
import { SplCardDetail } from "@/app/types/shared";
import { getCardImageUrl, getFallbackImageUrl } from "@/lib/utils/imageUtils";
import { Box, Card, CardContent, Typography } from "@mui/material";
import Image from "next/image";
import { JackpotGoldCardDetails } from "../types/cardCollection";

export function JackpotCardDetail({ item, cardDetails }: { item: JackpotGoldCardDetails, cardDetails: SplCardDetail[] }) {
  const cardDetailId = item.id;

  console.log("Looking for card detail with ID:", cardDetailId);
  console.log("Card details available:", cardDetails);
  const cardDetail = cardDetails.find(detail => detail.id === cardDetailId);
  console.log("Found card detail:", cardDetail);
  const cardName = cardDetail?.name || '';

  // Early return if card detail is not found
  if (!cardDetail || !cardName.trim()) {
    console.warn(`Card detail not found for ID: ${cardDetailId}`);
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
          <Typography variant="h6" color="error" textAlign="center">
            Card data not found (ID: {cardDetailId})
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Use the utility function for safe image URL generation
  const imageUrl = getCardImageUrl(cardDetail.name, item.foil);
  const fallbackUrl = getFallbackImageUrl(cardDetail.name);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
        <Box sx={{ p: 1 }}>
          <Image
            src={imageUrl}
            alt={`${cardDetail.name} - Foil ${item.foil}`}
            width={260}
            height={360}
            onError={(e) => {
              console.warn(`Image failed to load: ${imageUrl}`);
              // Fallback to regular card image if foil image fails
              (e.target as HTMLImageElement).src = fallbackUrl;
            }}
            unoptimized // Disable Next.js optimization for external images
          />
        <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
          {cardDetail.name}
        </Typography>
        </Box>

        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Typography
        variant="h5"
        fontWeight="bold"
        color={item.qty > 0 ? 'success.main' : 'text.secondary'}
        textAlign="center"
          >
        {item.qty.toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
