import { CardDetail } from "@/app/ca-mint-history/types/cardDetails";
import { WEB_URL } from "@/app/jackpot-prizes/lib/tokenIcons";
import { Box, Card, CardContent, Typography } from "@mui/material";
import Image from "next/image";
import { JackpotGoldCardDetails } from "../types/cardCollection";

export function JackpotCardDetail({ item, cardDetails }: { item: JackpotGoldCardDetails, cardDetails: CardDetail[] }) {
  const cardDetailId = item.id;

  const cardDetail = cardDetails.find(detail => detail.id === cardDetailId);
  const cardName = cardDetail?.name || '';


  const FOIL_SUFFIX_MAP: Record<number, string> = {
    0: "",
    1: "_gold",
    2: "_gold", // gold arcane uses same image as gold
    3: "_blk",
    4: "_blk",  // black arcane uses same image as black
  };
  const suffix = FOIL_SUFFIX_MAP[item.foil] ?? "";
  const imageUrl = `${WEB_URL}cards_v2.2/${encodeURIComponent(cardName)}${suffix}.jpg`;

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
            alt={cardName}
            width={260}
            height={360}
          />
        <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
          {`${cardName}`}
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
