import ClientCardGrid from '@/components/shared/ClientCardGrid';
import { fetchCardDetails, fetchPackJackpotOverview } from '@/lib/api/splApi';
import { Alert, Box } from '@mui/material';

export const revalidate = 300; // Revalidate every 5 minutes

export default async function CAMintHistoryPage() {
  try {
    // Fetch data in parallel on the server
    const [jackpotData, cardDetails] = await Promise.all([
      fetchPackJackpotOverview(14),
      fetchCardDetails()
    ]);

    return (
      <ClientCardGrid
        prizeData={jackpotData}
        cardDetails={cardDetails}
        title="Conclave Arcana Jackpot Prize Overview"
        subtitle="Discover cards available in CA packs"
      />
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return (
      <Box p={3}>
        <Alert severity="error">
          Failed to load card data: {errorMessage}
        </Alert>
      </Box>
    );
  }
}
