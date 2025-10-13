'use client'

import { Container, Typography, Box, Button } from '@mui/material'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  const handleNavigateToMintHistory = () => {
    router.push('/ca-mint-history')
  }

  const handleNavigateToJackpotPrizes = () => {
    router.push('/jackpot-prizes')
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        SPL Data Dashboard
      </Typography>
      
      <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 6 }}>
        Explore Splinterlands card pack jackpot data and mint histories
      </Typography>

      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
          gap: 4,
          mt: 4 
        }}
      >
        <Box 
          sx={{ 
            p: 3, 
            border: 1, 
            borderColor: 'divider', 
            borderRadius: 2,
            textAlign: 'center',
            backgroundColor: 'background.paper'
          }}
        >
          <Typography variant="h5" gutterBottom>
            CA Mint History
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Detailed view of individual card mint histories with foil information and player ownership data.
          </Typography>
          <Button 
            onClick={handleNavigateToMintHistory}
            variant="contained" 
            size="large"
            fullWidth
          >
            View Mint History
          </Button>
        </Box>

        <Box 
          sx={{ 
            p: 3, 
            border: 1, 
            borderColor: 'divider', 
            borderRadius: 2,
            textAlign: 'center',
            backgroundColor: 'background.paper'
          }}
        >
          <Typography variant="h5" gutterBottom>
            Jackpot Prizes
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Overview of current jackpot prizes including tokens, titles, and other rewards available.
          </Typography>
          <Button 
            onClick={handleNavigateToJackpotPrizes}
            variant="contained" 
            size="large"
            fullWidth
          >
            View Jackpot Prizes
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
