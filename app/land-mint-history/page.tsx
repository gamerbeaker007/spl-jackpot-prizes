import ClientCardGrid from "@/components/shared/ClientCardGrid";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import { getCardDetails } from "@/lib/actions/cardDetails";
import { getJackpotOverview } from "@/lib/actions/jackpotOverview";
import { Alert, Box } from "@mui/material";
import { Suspense } from "react";

const edition = 19;

async function LandMintHistoryContent() {
  try {
    const [jackpotData, cardDetails] = await Promise.all([getJackpotOverview(edition), getCardDetails()]);

    return (
      <ClientCardGrid
        prizeData={jackpotData}
        cardDetails={cardDetails}
        title="Land Mint Jackpot Prize Overview"
        subtitle="Discover cards available in Land"
      />
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return (
      <Box p={3}>
        <Alert severity="error">Failed to load card data: {errorMessage}</Alert>
      </Box>
    );
  }
}

export default function LandMintHistoryPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <LandMintHistoryContent />
    </Suspense>
  );
}
