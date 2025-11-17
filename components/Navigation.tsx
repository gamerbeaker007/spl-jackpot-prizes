'use client'

import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => handleNavigation('/')}
        >
          SPL Data
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color={pathname === '/ca-mint-history' ? 'secondary' : 'inherit'}
            onClick={() => handleNavigation('/ca-mint-history')}
            variant={pathname === '/ca-mint-history' ? 'outlined' : 'text'}
          >
            CA Mint History
          </Button>

          <Button
            color={pathname === '/jackpot-prizes' ? 'secondary' : 'inherit'}
            onClick={() => handleNavigation('/jackpot-prizes')}
            variant={pathname === '/jackpot-prizes' ? 'outlined' : 'text'}
          >
            Jackpot Prizes
          </Button>
          <Button
            color={pathname === '/ca-gold-rewards' ? 'secondary' : 'inherit'}
            onClick={() => handleNavigation('/ca-gold-rewards')}
            variant={pathname === '/ca-gold-rewards' ? 'outlined' : 'text'}
          >
            CA GOLD Reward Prizes
          </Button>

          <Button
            color={pathname === '/ranked-reward-draws' ? 'secondary' : 'inherit'}
            onClick={() => handleNavigation('/ranked-reward-draws')}
            variant={pathname === '/ranked-reward-draws' ? 'outlined' : 'text'}
          >
            Ranked Reward Draws
          </Button>

          <Button
            color={pathname === '/frontier-reward-draws' ? 'secondary' : 'inherit'}
            onClick={() => handleNavigation('/frontier-reward-draws')}
            variant={pathname === '/frontier-reward-draws' ? 'outlined' : 'text'}
          >
            Frontier Reward Draws
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
