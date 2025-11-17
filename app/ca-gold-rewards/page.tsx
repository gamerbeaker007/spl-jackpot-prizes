import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import { Alert, Box } from "@mui/material";
import { Suspense } from "react";
import { getCardDetails } from "@/lib/actions/cardDetails";
import CAGoldRewardsClient from "./components/CAGoldRewardsClient";
import { getJackpotGoldCards } from "@/lib/actions/caGoldRewards";

async function CAGoldRewardsContent() {
  try {
    const [caGoldRewards, cardDetails] = await Promise.all([getJackpotGoldCards(), getCardDetails()]);

    return <CAGoldRewardsClient caGoldRewards={caGoldRewards} cardDetails={cardDetails} />;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return (
      <Box p={3}>
        <Alert severity="error">Failed to load CA Gold rewards data: {errorMessage}</Alert>
      </Box>
    );
  }
}

export default function CAGoldRewardsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CAGoldRewardsContent />
    </Suspense>
  );
}
