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
import { useEffect, useState } from 'react'
import { useMintData } from '../hooks/useMintData'
import { CardDetail } from '../types/cardDetails'
import { PackJackpotCard } from '../types/packJackpot'
import Modal from './Modal'

interface Props {
  jackpot: PackJackpotCard
  card: CardDetail
}

const FOIL_TYPES = [3, 2, 4]

export default function Card({ jackpot, card }: Props) {
  const [openFoil, setOpenFoil] = useState<number | null>(null)
  const { mintData, fetchMintData } = useMintData()

  useEffect(() => {
    // Fetch mint data for all foil types if not already fetched
    FOIL_TYPES.forEach((foil) => {
      if (!mintData[foil]) {
        fetchMintData(card.id, foil)
      }
    }
    )
  }, [card.id, fetchMintData, mintData])


  const imageUrl = `https://d36mxiodymuqjm.cloudfront.net/cards_v2.2/${encodeURIComponent(card.name)}.jpg`

  const foilLabel = (foil: number) =>
    foil === 2 ? 'Gold Foil Arcane' : foil === 3 ? 'Back Foil' : foil === 4 ? 'Black Foil Arcane' : `Foil ${foil}`

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
                {FOIL_TYPES.map((foil) => {
                  const data = mintData[foil]

                  return (
                    <Box key={foil} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2">
                        <strong>{foilLabel(foil)}:</strong>{' '}
                        {!data
                          ? 'Loading.....'
                          : foil === 3
                          ? card.name === "Archmage Yabanius"
                            ? `${data?.total_minted || 0} / ${data?.total || 0}`
                            : `${data?.total || 0}`
                          : `${data?.total_minted || 0} / ${data?.total || 0}`}
                      </Typography>

                      {data && data.mints.length > 0 && (
                        <IconButton
                          size="small"
                          onClick={() => setOpenFoil(foil)}
                          sx={{ ml: 1, p: 0.5 }}
                        >
                          <Info fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  )
                })}
              </Box>

              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Total (GFA/BFA) Minted: {jackpot.total_minted}
              </Typography>
              <Typography variant="body2">
                Total (GFA/BFA): {jackpot.total}
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
            mintData[openFoil]?.mints.map((mint) => (
              <Box key={mint.uid}>
                <Typography variant="body2" component="span" sx={{ fontFamily: 'monospace' }}>
                  {mint.mint.split('/')[0]}
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
