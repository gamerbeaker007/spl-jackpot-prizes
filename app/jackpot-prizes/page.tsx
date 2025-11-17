import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import { Alert, Box, Container, Divider, Typography } from "@mui/material";
import { Suspense } from "react";
import { BalanceCard } from "./component/BalanceCard";
import { SkinsCard } from "./component/SkinsCard";
import { getJackpotBalances } from "@/lib/actions/jackpotBalances";
import { getJackpotSkins } from "@/lib/actions/jackpotSkins";
import { getCardDetails } from "@/lib/actions/cardDetails";

async function JackpotPrizesContent() {
  try {
    const [jackpotPrizes, jackpotSkins, cardDetails] = await Promise.all([
      getJackpotBalances(),
      getJackpotSkins(),
      getCardDetails(),
    ]);

    return (
      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        {/* First Part - Jackpot Data */}
        <Typography variant="h4" component="h1" gutterBottom>
          Jackpot Data
        </Typography>

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
          {jackpotPrizes.map((item) => (
            <BalanceCard key={`jackpot-${item.token}`} item={item} />
          ))}
        </Box>

        {jackpotPrizes.length === 0 && (
          <Box textAlign="center" mb={6}>
            <Typography variant="h6" color="text.secondary">
              No jackpot data available
            </Typography>
          </Box>
        )}

        {/* Divider */}
        <Divider sx={{ my: 4 }} />

        {/* Second Part - Jackpot Skins Data */}
        <Typography variant="h4" component="h2" gutterBottom>
          Jackpot Skins Data
        </Typography>

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
          }}
        >
          {jackpotSkins.map((item) => (
            <SkinsCard key={`jackpot-skins-${item.skin_detail_id}`} item={item} cardDetails={cardDetails} />
          ))}
        </Box>

        {jackpotSkins.length === 0 && (
          <Box textAlign="center" mt={4}>
            <Typography variant="h6" color="text.secondary">
              No jackpot skins data available
            </Typography>
          </Box>
        )}
      </Container>
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load jackpot data: {errorMessage}</Alert>
      </Container>
    );
  }
}

export default function JackpotPrizesPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <JackpotPrizesContent />
    </Suspense>
  );
}
