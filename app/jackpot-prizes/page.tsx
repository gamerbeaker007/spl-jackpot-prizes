'use client'

import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Avatar, 
  Typography, 
  CircularProgress, 
  Alert,
  Container
} from '@mui/material'
import { useJackpotBalances } from './hooks/useJackpotBalances'
import { getTokenDisplayName, getTokenIcon } from './lib/tokenIcons'

export default function JackpotPrizesPage() {
  const { jackpotData, loading, error } = useJackpotBalances({ autoFetch: true })

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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Jackpot Prizes
      </Typography>
      
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6">Prize</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Icon</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h6">Balance</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jackpotData.map((item) => (
              <TableRow 
                key={item.token}
                sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <TableCell>
                  <Typography variant="body1" fontWeight="medium">
                    {getTokenDisplayName(item.token)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.token}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Avatar
                    src={getTokenIcon(item.token)}
                    alt={item.token}
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      mx: 'auto',
                      backgroundColor: 'transparent'
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography 
                    variant="h6" 
                    fontWeight="bold"
                    color={item.balance > 0 ? 'success.main' : 'text.secondary'}
                  >
                    {item.balance.toLocaleString()}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {jackpotData.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="text.secondary">
            No jackpot data available
          </Typography>
        </Box>
      )}
    </Container>
  )
}