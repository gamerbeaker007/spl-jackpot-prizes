'use client'

import ClientCardGrid from '@/components/shared/ClientCardGrid';
import { Alert, Box, CircularProgress } from '@mui/material';
import { useCardDetails } from '../hooks/useCardDetails';
import { useRankedDrawsOverview } from './hooks/useRankedDrawsData';

export default function RankedRewardDrawsPage() {
  const { rankedDrawsData, loading, error } = useRankedDrawsOverview({ autoFetch: true });
  const { cardDetails, loading: loadingCardDetails } = useCardDetails({ autoFetch: true });

  if (loading || loadingCardDetails) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Failed to load ranked draws data: {error}
        </Alert>
      </Box>
    );
  }

  return (
    <ClientCardGrid
      prizeData={rankedDrawsData}
      cardDetails={cardDetails}
      title="Ranked Reward Draws Prize Overview"
      subtitle="Discover cards available in ranked reward draws"
    />
  );
}
