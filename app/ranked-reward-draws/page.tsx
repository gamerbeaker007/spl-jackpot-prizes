import ClientCardGrid from '@/components/shared/ClientCardGrid';
import { fetchCardDetails, fetchRankedDrawsPrizeOverview } from '@/lib/api/splApi';
import { Alert, Box } from '@mui/material';

export const revalidate = 300; // Revalidate every 5 minutes

export default async function RankedRewardDrawsPage() {
  try {
    // Fetch data in parallel on the server
    const [rankedDrawsData, cardDetails] = await Promise.all([
      fetchRankedDrawsPrizeOverview(),
      fetchCardDetails()
    ]);

    return (
      <ClientCardGrid
        prizeData={rankedDrawsData}
        cardDetails={cardDetails}
        title="Ranked Reward Draws Prize Overview"
        subtitle="Discover cards available in ranked reward draws"
      />
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return (
      <Box p={3}>
        <Alert severity="error">
          Failed to load ranked draws data: {errorMessage}
        </Alert>
      </Box>
    );
  }
}
