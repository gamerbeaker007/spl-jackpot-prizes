'use client'

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { useRouter, usePathname } from 'next/navigation'

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
        </Box>
      </Toolbar>
    </AppBar>
  )
}