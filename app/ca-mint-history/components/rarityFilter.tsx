'use client'
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import Image from 'next/image'

interface Props {
  selected: number[]
  onToggle: (rarity: number) => void
}

const rarityIcons: Record<number, string> = {
  1: 'https://d36mxiodymuqjm.cloudfront.net/website/create_team/icon_rarity_common_new.svg',
  2: 'https://d36mxiodymuqjm.cloudfront.net/website/create_team/icon_rarity_rare_new.svg',
  3: 'https://d36mxiodymuqjm.cloudfront.net/website/create_team/icon_rarity_epic_new.svg',
  4: 'https://d36mxiodymuqjm.cloudfront.net/website/create_team/icon_rarity_legendary_new.svg',
}

const rarityNames: Record<number, string> = {
  1: 'Common',
  2: 'Rare',
  3: 'Epic',
  4: 'Legendary',
}

export default function RarityFilter({ selected, onToggle }: Props) {
  const handleToggle = (event: React.MouseEvent<HTMLElement>, newSelected: number[]) => {
    // Find what changed and toggle it
    const allRarities = [1, 2, 3, 4]
    const changedRarity = allRarities.find(rarity =>
      selected.includes(rarity) !== newSelected.includes(rarity)
    )
    if (changedRarity) {
      onToggle(changedRarity)
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center'}}>
      <ToggleButtonGroup
        value={selected}
        onChange={handleToggle}
        aria-label="rarity filter"
        sx={{
          '& .MuiToggleButton-root': {
            border: 'none',
            borderRadius: 2,
            mx: 1,
            px: 2,
            py: 1,
            flexDirection: 'column',
            gap: 1,
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'primary.dark',
              }
            }
          }
        }}
      >
        {([1, 2, 3, 4] as const).map((rarity) => (
          <ToggleButton
            key={rarity}
            value={rarity}
            aria-label={rarityNames[rarity]}
          >
            <Image
              src={rarityIcons[rarity]}
              alt={rarityNames[rarity]}
              width={40}
              height={40}
            />
            <Typography variant="caption">
              {rarityNames[rarity]}
            </Typography>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  )
}
