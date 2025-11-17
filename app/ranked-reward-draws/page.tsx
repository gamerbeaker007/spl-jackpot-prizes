import ClientCardGrid from "@/components/shared/ClientCardGrid";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import { Alert, Box } from "@mui/material";
import { Suspense } from "react";
import { getRankedDraws } from "@/lib/actions/rankedDraws";
import { getCardDetails } from "@/lib/actions/cardDetails";

async function RankedRewardDrawsContent() {
  try {
    const [rankedDrawsData, cardDetails] = await Promise.all([getRankedDraws(), getCardDetails()]);

    return (
      <ClientCardGrid
        prizeData={rankedDrawsData}
        cardDetails={cardDetails}
        title="Ranked Reward Draws Prize Overview"
        subtitle="Discover cards available in ranked reward draws"
      />
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return (
      <Box p={3}>
        <Alert severity="error">Failed to load ranked draws data: {errorMessage}</Alert>
      </Box>
    );
  }
}

export default function RankedRewardDrawsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <RankedRewardDrawsContent />
    </Suspense>
  );
}
