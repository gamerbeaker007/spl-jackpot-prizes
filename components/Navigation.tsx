'use client'

import { conclave_icon_url, frontier_icon_url, jackpot_icon_url, land_icon_url, ranked_icon_url } from '@/lib/utils/staticUrls'
import { AppBar, Box, Button, Toolbar, Tooltip, Typography } from '@mui/material'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'

const iconMap = {
  conclave: conclave_icon_url,
  jackpot: jackpot_icon_url,
  frontier: frontier_icon_url,
  ranked: ranked_icon_url,
  land: land_icon_url
}

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()

  const handleNavigation = (path: string) => {
    startTransition(() => {
      router.push(path)
    })
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
          SPL Jackpot Prizes
        </Typography>

        <Box display="flex" gap={1} flexWrap="wrap">
          <Tooltip title="CA Mint History" arrow>
            <Button
              color={pathname === '/ca-mint-history' ? 'secondary' : 'inherit'}
              onClick={() => handleNavigation('/ca-mint-history')}
              variant={pathname === '/ca-mint-history' ? 'outlined' : 'text'}
            >
              <Image
                src={iconMap.conclave}
                alt="Conclave Arcana Icon"
                width={24}
                height={24}
              />
            </Button>
          </Tooltip>

          <Tooltip title="Jackpot Prizes" arrow>
            <Button
              color={pathname === '/jackpot-prizes' ? 'secondary' : 'inherit'}
              onClick={() => handleNavigation('/jackpot-prizes')}
              variant={pathname === '/jackpot-prizes' ? 'outlined' : 'text'}
            >
              <Image
                src={iconMap.jackpot}
                alt="Jackpot Prizes Icon"
                width={24}
                height={24}
              />
            </Button>
          </Tooltip>
          <Tooltip title="CA Gold Rewards" arrow>
            <Button
              color={pathname === '/ca-gold-rewards' ? 'secondary' : 'inherit'}
              onClick={() => handleNavigation('/ca-gold-rewards')}
              variant={pathname === '/ca-gold-rewards' ? 'outlined' : 'text'}
            >
              <Box display={"flex"} alignItems="center" gap={1} flexDirection={"column"}>
              <Image
                src={iconMap.conclave}
                alt="Conclave Arcana Icon"
                width={24}
                height={24}
              />
              <Typography variant="caption">
              Gold Rewards
              </Typography>
              </Box>
            </Button>
          </Tooltip>

          <Tooltip title="Ranked Reward Draws" arrow>
            <Button
              color={pathname === '/ranked-reward-draws' ? 'secondary' : 'inherit'}
              onClick={() => handleNavigation('/ranked-reward-draws')}
              variant={pathname === '/ranked-reward-draws' ? 'outlined' : 'text'}
            >
              <Image
                src={iconMap.ranked}
                alt="Ranked Reward Draws Icon"
                width={24}
                height={24}
              />
            </Button>
          </Tooltip>

          <Tooltip title="Frontier Reward Draws" arrow>
            <Button
              color={pathname === '/frontier-reward-draws' ? 'secondary' : 'inherit'}
              onClick={() => handleNavigation('/frontier-reward-draws')}
              variant={pathname === '/frontier-reward-draws' ? 'outlined' : 'text'}
            >
              <Image
                src={iconMap.frontier}
                alt="Frontier Reward Draws Icon"
                width={24}
                height={24}
              />
            </Button>
          </Tooltip>
          <Tooltip title="Land Mint History" arrow>
            <Button
              color={pathname === '/land-mint-history' ? 'secondary' : 'inherit'}
              onClick={() => handleNavigation('/land-mint-history')}
              variant={pathname === '/land-mint-history' ? 'outlined' : 'text'}
            >
              <Image
                src={iconMap.land}
                alt="Land Mint History Icon"
                width={24}
                height={24}
              />
            </Button>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
