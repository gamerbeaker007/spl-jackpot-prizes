'use client'

import { Info } from '@mui/icons-material'
import {
  Box,
  CardContent,
  IconButton,
  Card as MuiCard,
  Typography
} from '@mui/material'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useMintData } from '../hooks/useMintData'
import { CardDetail } from '../types/cardDetails'
import { PackJackpotCard } from '../types/packJackpot'
import Modal from './Modal'

interface Props {
  jackpot: PackJackpotCard
  card: CardDetail
}

const DEFAULT_FOIL_TYPES = [3, 2, 4]
const ALL_FOIL_TYPES = [0, 1, 2, 3, 4]
  const FOIL_LABELS: Record<number, string> = {
    0: 'Regular',
    1: 'Gold',
    2: 'Gold Foil Arcane',
    3: 'Black Foil',
    4: 'Black Foil Arcane'
  }

export default function Card({ jackpot, card }: Props) {
  const [openFoil, setOpenFoil] = useState<number | null>(null)
  const { mintData, fetchMintData } = useMintData()

  const isArchmageYabanius = card.name === "Archmage Yabanius"
  const foilTypes = useMemo(() =>
    isArchmageYabanius ? ALL_FOIL_TYPES : DEFAULT_FOIL_TYPES,
    [isArchmageYabanius]
  )

  useEffect(() => {
    // Fetch mint data for all foil types if not already fetched
    foilTypes.forEach((foil) => {
      if (!mintData[foil]) {
        fetchMintData(card.id, foil)
      }
    }
    )
  }, [card.id, fetchMintData, foilTypes, mintData])


  const imageUrl = `https://d36mxiodymuqjm.cloudfront.net/cards_v2.2/${encodeURIComponent(card.name)}.jpg`

  const foilLabel = (foil: number): string =>
    FOIL_LABELS[foil] ?? `Foil ${foil}`


  return (
    <>
      <MuiCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{ flexShrink: 0 }}>
              <Image
                src={imageUrl}
                alt={card.name}
                width={100}
                height={150}
                className="card-image"
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" component="h2" gutterBottom>
                {card.name}
              </Typography>

                <Box sx={{ mt: 2, mb: 2 }}>
                {foilTypes.map((foil) => {
                  const data = mintData[foil]

                  return (
                  <Box key={foil} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2">
                    <strong>{foilLabel(foil)}:</strong>{' '}
                    {!data
                      ? 'Loading.....'
                      : foil === 3
                      ? isArchmageYabanius
                      ? `${data?.total_minted || 0} / ${data?.total || 0}`
                      : `${data?.total || 0}`
                      : `${data?.total_minted || 0} / ${data?.total || 0}`}
                    </Typography>

                    {data && data.mints.length > 0 && (
                    <IconButton
                      size="small"
                      onClick={() => setOpenFoil(foil)}
                      sx={{p: 0.5 }}
                    >
                      <Info fontSize="small" />
                    </IconButton>
                    )}
                  </Box>
                  )
                })}
                </Box>

              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Total {isArchmageYabanius ? "": "(GFA/BFA)"} Minted: {jackpot.total_minted}
              </Typography>
              <Typography variant="body2">
                Total {isArchmageYabanius ? "": "(GFA/BFA)"}: {jackpot.total}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </MuiCard>

      {/* Modal */}
      <Modal
        isOpen={openFoil !== null && !!mintData[openFoil]}
        onClose={() => setOpenFoil(null)}
        title={openFoil !== null ? `${card.name} - ${foilLabel(openFoil)} Mints` : undefined}
      >
        <Box sx={{ '& > div': { mb: 0.5 } }}>
          {openFoil !== null &&
            mintData[openFoil]?.mints.map((mint, idx) => (
              <Box key={mint.uid}>
                <Typography variant="body2" component="span" sx={{ fontFamily: 'monospace' }}>
                  {mint.mint ? mint.mint.split('/')[0] : idx + 1}
                </Typography>
                <Typography variant="body2" component="span">
                  {' '} — {mint.mint_player || '—'}
                </Typography>
              </Box>
            ))}
        </Box>
      </Modal>
    </>
  )
}
