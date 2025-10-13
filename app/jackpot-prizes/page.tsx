'use client'

import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Typography
} from '@mui/material'
import { useJackpotBalances } from './hooks/useJackpotBalances'
import { getTokenDisplayName, getTokenIcon } from './lib/tokenIcons'
import { Balance } from './types/balances'

// Helper component to render a single balance card
function BalanceCard({ item }: { item: Balance }) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
        <Avatar
          src={getTokenIcon(item.token)}
          alt={item.token}
          sx={{
            width: 64,
            height: 64,
            mb: 2,
            backgroundColor: 'transparent',
            border: '2px solid',
            borderColor: 'divider'
          }}
        />

        <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
          {getTokenDisplayName(item.token)}
        </Typography>

        {/* <Typography variant="body2" color="text.secondary" gutterBottom textAlign="center">
          {item.token}
        </Typography> */}

        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            color={item.balance > 0 ? 'success.main' : 'text.secondary'}
            textAlign="center"
          >
            {item.balance.toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function JackpotPrizesPage() {
  const { jackpotData, jackpotSkinsData, loading, error } = useJackpotBalances({ autoFetch: true })

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load jackpot data: {error}
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      {/* First Part - Jackpot Data */}
      <Typography variant="h4" component="h1" gutterBottom>
        Jackpot Data
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: 3,
          mb: 6
        }}
      >
        {jackpotData.map((item) => (
          <BalanceCard key={`jackpot-${item.token}`} item={item} />
        ))}
      </Box>

      {jackpotData.length === 0 && (
        <Box textAlign="center" mb={6}>
          <Typography variant="h6" color="text.secondary">
            No jackpot data available
          </Typography>
        </Box>
      )}

      {/* Divider */}
      <Divider sx={{ my: 4 }} />

      {/* Second Part - Jackpot Skins Data */}
      <Typography variant="h4" component="h2" gutterBottom>
        Jackpot Skins Data
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: 3
        }}
      >
        {jackpotSkinsData.map((item) => (
          <BalanceCard key={`jackpot-skins-${item.token}`} item={item} />
        ))}
      </Box>

      {jackpotSkinsData.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="text.secondary">
            No jackpot skins data available
          </Typography>
        </Box>
      )}
    </Container>
  )
}
