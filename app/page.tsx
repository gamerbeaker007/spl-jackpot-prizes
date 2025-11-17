"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleNavigateToMintHistory = () => {
    router.push("/ca-mint-history");
  };

  const handleNavigateToJackpotPrizes = () => {
    router.push("/jackpot-prizes");
  };

  const handleNavigateToCaGoldRewards = () => {
    router.push("/ca-gold-rewards");
  };

  const handleNavigateToRankedRewardDraws = () => {
    router.push("/ranked-reward-draws");
  };

  const handleNavigateToFrontierRewardDraws = () => {
    router.push("/frontier-reward-draws");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        SPL Data Dashboard
      </Typography>

      <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 6 }}>
        Explore Splinterlands jackpot prizes and mint histories
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: 4,
          mt: 4,
        }}
      >
        <Box
          sx={{
            p: 3,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            textAlign: "center",
            backgroundColor: "background.paper",
          }}
        >
          <Typography variant="h5" gutterBottom>
            CA Mint History
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Detailed view of individual card mint histories for the Conclave Arcana Set with foil information and the
            lucky winners.
          </Typography>
          <Button onClick={handleNavigateToMintHistory} variant="contained" size="large" fullWidth>
            View Mint History
          </Button>
        </Box>

        <Box
          sx={{
            p: 3,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            textAlign: "center",
            backgroundColor: "background.paper",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Jackpot Prizes
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Overview of current jackpot prizes including tokens, titles, and other rewards available in the so-called
            &quot;Gator Buckets&quot;.
          </Typography>
          <Button onClick={handleNavigateToJackpotPrizes} variant="contained" size="large" fullWidth>
            View Jackpot Prizes
          </Button>
        </Box>
        <Box
          sx={{
            p: 3,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            textAlign: "center",
            backgroundColor: "background.paper",
          }}
        >
          <Typography variant="h5" gutterBottom>
            CA GOLD Reward Prizes
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Overview of current CA GOLD Reward card prizes, including rarities and quantities within the Conclave Arcana
            reward set.
          </Typography>
          <Button onClick={handleNavigateToCaGoldRewards} variant="contained" size="large" fullWidth>
            View Jackpot Prizes
          </Button>
        </Box>

        <Box
          sx={{
            p: 3,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            textAlign: "center",
            backgroundColor: "background.paper",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Ranked Reward Draws
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Overview of cards available in ranked reward draws with detailed mint information and foil statistics.
          </Typography>
          <Button onClick={handleNavigateToRankedRewardDraws} variant="contained" size="large" fullWidth>
            View Ranked Rewards
          </Button>
        </Box>

        <Box
          sx={{
            p: 3,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            textAlign: "center",
            backgroundColor: "background.paper",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Frontier Reward Draws
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Overview of cards available in frontier reward draws with detailed mint information and foil statistics.
          </Typography>
          <Button onClick={handleNavigateToFrontierRewardDraws} variant="contained" size="large" fullWidth>
            View Frontier Rewards
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
