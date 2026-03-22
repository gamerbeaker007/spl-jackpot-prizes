import ClientCardGrid from "@/components/shared/ClientCardGrid";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import { getCardDetails } from "@/lib/actions/cardDetails";
import { getJackpotOverview } from "@/lib/actions/jackpotOverview";
import { Alert, Box } from "@mui/material";
import { Suspense } from "react";

async function CAMintHistoryContent() {
  try {
    const [jackpotData, cardDetails] = await Promise.all([getJackpotOverview(14), getCardDetails()]);

    return (
      <ClientCardGrid
        prizeData={jackpotData}
        cardDetails={cardDetails}
        title="Conclave Arcana Jackpot Prize Overview"
        subtitle="Discover cards available in CA packs"
        showRecentWinnersForEdition={14}
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

export default function CAMintHistoryPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CAMintHistoryContent />
    </Suspense>
  );
}
