import { SplCardDetail } from "@/app/types/shared";
import { getJackpotCards } from "@/lib/actions/jackpotCards";
import { Alert, Box } from "@mui/material";
import { JackpotCardSectionClient } from "./JackpotCardSectionClient";

interface Props {
  cardDetails: SplCardDetail[];
}

export async function JackpotCardSectionServer({ cardDetails }: Props) {
  try {
    const jackpotCards = await getJackpotCards();

    return <JackpotCardSectionClient jackpotCards={jackpotCards} cardDetails={cardDetails} />;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return (
      <Box p={3}>
        <Alert severity="error">Failed to load jackpot card data: {errorMessage}</Alert>
      </Box>
    );
  }
}
