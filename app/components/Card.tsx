'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { CardDetail } from '../types/cardDetails'
import { MintHistoryResponse } from '../types/mintHistory'
import { PackJackpotCard } from '../types/packJackpot'
import Modal from './Modal'


interface Props {
  jackpot: PackJackpotCard
  card: CardDetail
}

const FOIL_TYPES = [3, 2, 4]

export default function Card({ jackpot, card }: Props) {
  const [mintData, setMintData] = useState<Record<number, MintHistoryResponse | null>>({})
  const [openFoil, setOpenFoil] = useState<number | null>(null)

  useEffect(() => {
    async function fetchFoilMintData() {
      const results: Record<number, MintHistoryResponse | null> = {}

      await Promise.all(
        FOIL_TYPES.map(async (foil) => {
          try {
            const res = await fetch(
              `/api/mint_history?foil=${foil}&card_detail_id=${card.id}`,
              {
                next: { revalidate: 3600 },
              }
            )
            const data = await res.json()
            results[foil] = data
          } catch {
            results[foil] = null
          }
        })
      )

      setMintData(results)
    }

    fetchFoilMintData()
  }, [card.id])

  const imageUrl = `https://d36mxiodymuqjm.cloudfront.net/cards_v2.2/${encodeURIComponent(card.name)}.jpg`

  const foilLabel = (foil: number) =>
    foil === 2 ? 'Gold Foil Arcane' : foil === 3 ? 'Back Foil' : foil === 4 ? 'Black Foil Arcane' : `Foil ${foil}`

  return (
    <>
      <div className="flex w-full rounded border p-2 gap-4 items-center">
        <Image
          src={imageUrl}
          alt={card.name}
          width={100}
          height={150}          
          className="h-full max-h-[200px] w-auto object-contain"
        />
        <div className="flex-1 space-y-1">
          <h2 className="text-base font-bold">{card.name}</h2>
          <div className="mt-2 space-y-1">
            {FOIL_TYPES.map((foil) => {
              const data = mintData[foil]
              return (
                <div key={foil}>
                  <span className="font-medium">{foilLabel(foil)}: </span>
                  {!data
                    ? 'Loading...'
                    : foil === 3
                      ? `${data.total}`
                      : `${data.total_minted}/${data.total}`}

                  {data && data.mints.length > 0 && (
                    <button
                      onClick={() => setOpenFoil(foil)}
                      className="ml-2 text-blue-600 underline cursor-pointer"
                    > ℹ️ </button>
                  )}
                </div>
              )
            })}
          </div>
          <p>Total (GFA/BFA) Minted: {jackpot.total_minted}</p>
          <p>Total (GFA/BFA): {jackpot.total}</p>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={openFoil !== null && !!mintData[openFoil]}
        onClose={() => setOpenFoil(null)}
        title={openFoil !== null ? foilLabel(openFoil) + ' Mints' : undefined}
      >
        <div className="space-y-1 text-xs">
          {openFoil !== null &&
            mintData[openFoil]?.mints.map((mint) => (
              <div key={mint.uid}>
                <span className="font-mono">{mint.mint.split('/')[0]}</span> —{' '}
                <span>{mint.mint_player || '—'}</span>
              </div>
            ))}
        </div>
      </Modal>
    </>
  )
}
