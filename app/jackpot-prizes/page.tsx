import { JackpotCardSectionServer } from "@/app/jackpot-prizes/component/JackpotCardSectionServer";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import { getCardDetails } from "@/lib/actions/cardDetails";
import { getJackpotBalances } from "@/lib/actions/jackpotBalances";
import { getJackpotMusic } from "@/lib/actions/jackpotMusic";
import { getJackpotSkins } from "@/lib/actions/jackpotSkins";
import { Alert, Box, CircularProgress, Container, Divider, Typography } from "@mui/material";
import { Suspense } from "react";
import { BalanceCard } from "./component/BalanceCard";
import { MusicCard } from "./component/MusicCard";
import { SkinsCard } from "./component/SkinsCard";

async function JackpotPrizesContent() {
  try {
    const [jackpotPrizes, jackpotSkins, jackpotMusicData, cardDetails] = await Promise.all([
      getJackpotBalances(),
      getJackpotSkins(),
      getJackpotMusic(),
      getCardDetails(),
    ]);

    const { chestMusic, frontierMusic } = jackpotMusicData;

    return (
      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        {/* First Part - Jackpot Data */}
        <Typography variant="h4" component="h1" gutterBottom>
          Jackpot Item Data
        </Typography>

        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2" component="div">
            <strong>Found as part of jackpot in reward chest</strong>
            <br />
            • Minor: 0.08%
            <br />
            • Major: 0.8%
            <br />• Ultimate: 8%
          </Typography>
        </Alert>

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

        <Alert severity="info" sx={{ mt: 3, mb: 4 }}>
          <Typography variant="body2" component="div">
            <strong>Found in the ultimate chests as jackpot prizes</strong>
            <br />
            • Ultimate: 8%
            <br />
            <em>Note: 8% then is determined which jackpot item / skin / card</em>
          </Typography>
        </Alert>
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

        <Divider sx={{ my: 4 }} />

        {/* Third Part - Chest Jackpot Music Data */}
        <Typography variant="h4" component="h2" gutterBottom>
          Jackpot Music (Chest)
        </Typography>

        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2" component="div">
            <strong>Found in the minor chest as jackpot prizes</strong>
            <br />• Minor: 0.05%
          </Typography>
        </Alert>
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
            mb: 3,
          }}
        >
          {chestMusic.map((item) => (
            <MusicCard key={`chest-music-${item.item_detail_id}`} item={item} />
          ))}
        </Box>

        {chestMusic.length === 0 && (
          <Box textAlign="center" mb={3}>
            <Typography variant="h6" color="text.secondary">
              No chest jackpot music data available
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 4 }} />

        {/* Fourth Part - Frontier Jackpot Music Data */}
        <Typography variant="h4" component="h2" gutterBottom>
          Jackpot Music (Frontier)
        </Typography>

        <Alert severity="info" sx={{ mt: 3, mb: 4 }}>
          <Typography variant="body2" component="div">
            <strong>Every claim (5 wins) 0.05% odds</strong>
            <br />• Maximum 3 per day
          </Typography>
        </Alert>

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
          {frontierMusic.map((item) => (
            <MusicCard key={`frontier-music-${item.item_detail_id}`} item={item} />
          ))}
        </Box>

        {frontierMusic.length === 0 && (
          <Box textAlign="center" mt={4}>
            <Typography variant="h6" color="text.secondary">
              No frontier jackpot music data available
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 4 }} />

        {/* Slow loading section with its own Suspense boundary */}
        <Suspense
          fallback={
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2} py={8}>
              <Typography variant="h6" color="text.secondary">
                Loading Jackpot Cards...
              </Typography>
              <CircularProgress />
            </Box>
          }
        >
          <JackpotCardSectionServer cardDetails={cardDetails} />
        </Suspense>
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
