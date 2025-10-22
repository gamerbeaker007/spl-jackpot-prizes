import { Avatar, Box, Card, CardContent, Tooltip, Typography } from "@mui/material";
import Image from "next/image";
import { WEB_URL } from "../lib/tokenIcons";
import { Skins } from "../types/skins";
import { CardDetail } from "@/app/types/shared";

export function SkinsCard({ item, cardDetails }: { item: Skins, cardDetails: CardDetail[] }) {
  const cardDetailId = item.card_detail_id;

const cardDetail = cardDetails.find(detail => detail.id === cardDetailId);
const cardName = cardDetail?.name || '';

// Use custom image URLs for specific card names
let imageUrl = `${WEB_URL}cards_v2.2/${item.skin}/${encodeURIComponent(cardName)}.jpg`;
if (cardName === "Venari Marksrat") {
  imageUrl = `${WEB_URL}cards_soulbound/Spooky/Venari%20Marksrat.jpg`;
} else if (cardName === "Kelya Frendul") {
  imageUrl = `${WEB_URL}cards_chaos/Spooky/Kelya%20Frendul.jpg`;
} else if (cardName === "Uraeus") {
  imageUrl = `${WEB_URL}cards_chaos/Spooky/Uraeus.jpg`;
}

return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
        <Tooltip
          title={
        <Box sx={{ p: 1 }}>
          <Image
            src={imageUrl}
            alt={item.skin}
            width={260}
            height={360}
          />
        </Box>
          }
          placement="top"
        >
          <Avatar
        src={imageUrl}
        alt={item.skin}
        sx={{
          width: 64,
          height: 64,
          mb: 2,
          backgroundColor: 'transparent',
          border: '2px solid',
          borderColor: 'divider',
          cursor: 'pointer'
        }}
          />
        </Tooltip>

        <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
          {`${item.skin} - ${cardName}`}
        </Typography>

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
