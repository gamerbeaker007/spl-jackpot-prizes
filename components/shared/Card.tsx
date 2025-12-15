'use client'

import { useCardHistory } from '@/app/hooks/useCardHistory';
import { useMintData } from '@/app/hooks/useMintData';
import { CardPrizeData, MintHistoryItem, SplCardDetail } from '@/app/types/shared';
import { getCardImageUrl, getFoilLabel } from '@/lib/utils/imageUtils';
import { History, Info } from '@mui/icons-material';
import {
  Box,
  CardContent,
  IconButton,
  Card as MuiCard,
  Tooltip,
  Typography
} from '@mui/material';
import Image from 'next/image';
import { memo, useEffect, useMemo, useState } from 'react';
import CardHistoryTooltip from './CardHistoryTooltip';
import Modal from './Modal';

interface Props {
  prizeData: CardPrizeData;
  card: SplCardDetail;
}

const DEFAULT_FOIL_TYPES = [3, 2, 4];
const ALL_FOIL_TYPES = [0, 1, 2, 3, 4];

function Card({ prizeData, card }: Props) {
  const [openFoil, setOpenFoil] = useState<number | null>(null);
  const { mintData, fetchMintData } = useMintData();
  const { cardHistory, loading: historyLoading, error: historyError, fetchCardHistory } = useCardHistory();

  const editions = card.editions.split(',').map(e => e.trim());
  const isArchmageYabanius = card.name === "Archmage Yabanius";
  const isConclaveArcanaRewardEdition = editions.includes("18");
  const isFrontierDraws = editions.includes("15") || editions.includes("16");
  const isLandCard = editions.includes("19");

  const foilTypes = useMemo(() =>
    isArchmageYabanius ? ALL_FOIL_TYPES : DEFAULT_FOIL_TYPES,
    [isArchmageYabanius]
  );



  useEffect(() => {
    foilTypes.forEach(foil => {
      const data = prizeData.foils.find(f => foil == f.foil)
      // if default does not have the data do the call to load the data
      if (!data){
        fetchMintData(card.id, foil)
      }
    })


    // Fetch mint data when dialog is opened
    if (openFoil !== null && !mintData[openFoil]) {
      fetchMintData(card.id, openFoil);
    }

  }, [openFoil, card.id, fetchMintData, mintData, prizeData, foilTypes]);

  const imageUrl = getCardImageUrl(card.name || 'Unknown', 0, isLandCard);

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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {card.name}
                </Typography>
              </Box>

              <Box sx={{ mt: 2, mb: 2 }}>
                {foilTypes.map((foil) => {
                  const prizeDataFoil = prizeData.foils.find(f => foil === f.foil);
                  const mintDataFoil = mintData[foil];
                  const minted = prizeDataFoil?.minted ?? mintDataFoil?.total_minted ?? 0;
                  const total = prizeDataFoil?.total ?? mintDataFoil?.total ?? 0;
                  const hasData = prizeDataFoil || mintDataFoil;

                  const showFullStats = foil !== 3 || isArchmageYabanius || isConclaveArcanaRewardEdition || isFrontierDraws || isLandCard;
                  const displayText = hasData
                    ? (showFullStats ? `${minted} / ${total}` : `${total}`)
                    : '...Loading';

                  return (
                    <Box key={foil} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2">
                        <strong>{getFoilLabel(foil)}:</strong> {displayText}
                      </Typography>
                        <IconButton
                          size="small"
                          onClick={() => setOpenFoil(foil)}
                          sx={{ p: 0.5 }}
                        >
                          <Info fontSize="small" />
                        </IconButton>
                    </Box>
                  );
                })}
              </Box>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Total {isArchmageYabanius ? "" : "(GFA/BFA)"} Minted: {prizeData.total_minted}
              </Typography>
              <Typography variant="body2">
                Total {isArchmageYabanius ? "" : "(GFA/BFA)"}: {prizeData.total}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </MuiCard>

      {/* Modal */}
      <Modal
        isOpen={openFoil !== null && !!mintData[openFoil]}
        onClose={() => setOpenFoil(null)}
        title={openFoil !== null ? `${card.name} - ${getFoilLabel(openFoil)} Mints` : undefined}
      >
        <Box sx={{ '& > div': { mb: 0.5 } }}>
          {openFoil !== null &&
            mintData[openFoil]?.mints.map((mint: MintHistoryItem, idx: number) => {
              return (
                <Box key={mint.uid}>
                  <Typography variant="body2" component="span" sx={{ fontFamily: 'monospace' }}>
                    {mint.mint ? mint.mint.split('/')[0] : idx + 1}
                  </Typography>
                  <Typography variant="body2" component="span">
                    {' '} — {mint.mint_player || '—'}
                  </Typography>
                  {/* Card History Button */}
                  {mint.mint_player && (
                    <Tooltip
                      title={
                        <CardHistoryTooltip
                          cardHistory={cardHistory || []}
                          loading={historyLoading}
                          error={historyError}
                        />
                      }
                      placement="top"
                      onOpen={() => {
                        // Fetch card history when tooltip opens, using the first available mint UID
                        if (mint.uid) {
                          fetchCardHistory(mint.uid);
                        }
                      }}
                      PopperProps={{
                        sx: {
                          '& .MuiTooltip-tooltip': {
                            bgcolor: 'background.paper',
                            color: 'text.primary',
                            border: 1,
                            borderColor: 'divider',
                            maxWidth: 'none'
                          }
                        }
                      }}
                    >
                      <IconButton size="small" sx={{ p: 0.5 }}>
                        <History fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              );
            })}
        </Box>
      </Modal>
    </>
  );
}

export default memo(Card);
