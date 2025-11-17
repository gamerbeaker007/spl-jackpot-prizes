import ClientCardGrid from "@/components/shared/ClientCardGrid";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import { getCardDetails } from "@/lib/actions/cardDetails";
import { getFrontierDraws } from "@/lib/actions/frontierDraws";
import { Alert, Box } from "@mui/material";
import { Suspense } from "react";

async function FrontierRewardDrawsContent() {
  try {
    const [frontierDrawsData, cardDetails] = await Promise.all([getFrontierDraws(), getCardDetails()]);

    return (
      <ClientCardGrid
        prizeData={frontierDrawsData}
        cardDetails={cardDetails}
        title="Frontier Reward Draws Prize Overview"
        subtitle="Discover cards available in frontier reward draws"
      />
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return (
      <Box p={3}>
        <Alert severity="error">Failed to load frontier draws data: {errorMessage}</Alert>
      </Box>
    );
  }
}

export default function FrontierRewardDrawsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <FrontierRewardDrawsContent />
    </Suspense>
  );
}
