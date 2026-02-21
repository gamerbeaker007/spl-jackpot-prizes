'use client';

import { useCardHistory } from '@/app/hooks/useCardHistory';
import { useMintData } from '@/app/hooks/useMintData';
import { CardHistoryItem } from '@/app/types/cardHistory';
import { CardPrizeData, MintHistoryItem, SplCardDetail } from '@/app/types/shared';
import { getFoilLabel } from '@/lib/utils/imageUtils';
import { ArrowBack, Close, Info } from '@mui/icons-material';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  SwipeableDrawer,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';

export interface PaneSelection {
  card: SplCardDetail;
  prizeData: CardPrizeData;
  foil: number;
}

interface Props {
  selection: PaneSelection | null;
  onClose: () => void;
}

type PaneView = 'mints' | 'history';

export default function DetailPane({ selection, onClose }: Props) {
  const { card, foil } = selection ?? {};
  const { mintData, fetchMintData } = useMintData();
  const { cardHistory, loading: historyLoading, error: historyError, fetchCardHistory } = useCardHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [view, setView] = useState<PaneView>('mints');
  const [historyPlayer, setHistoryPlayer] = useState<string | null>(null);

  // Reset to mints view when selection changes
  useEffect(() => {
    setView('mints');
    setHistoryPlayer(null);
  }, [card?.id, foil]);

  // Always fetch full mint list when selection changes (prizeData only has counts, not mints array)
  useEffect(() => {
    if (card && foil !== undefined && !mintData[foil]) {
      fetchMintData(card.id, foil);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.id, foil]);

  const handleHistoryClick = (mint: MintHistoryItem) => {
    if (!mint.uid || !mint.mint_player) return;
    setHistoryPlayer(mint.mint_player);
    setView('history');
    fetchCardHistory(mint.uid);
  };

  const mintInfo = foil !== undefined ? mintData[foil] : null;
  const isLoadingMints = !mintInfo;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getTransferTypeColor = (type: string): 'success' | 'warning' | 'info' | 'default' => {
    switch (type.toLowerCase()) {
      case 'market_purchase': return 'success';
      case 'market_sale': return 'warning';
      case 'transfer': return 'info';
      default: return 'default';
    }
  };

  const header = !selection ? null : (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      px: 2,
      py: 1.5,
      borderBottom: 1,
      borderColor: 'divider',
      gap: 1,
      flexShrink: 0,
    }}>
      {view === 'history' && (
        <IconButton size="small" onClick={() => setView('mints')}>
          <ArrowBack fontSize="small" />
        </IconButton>
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle1" fontWeight="bold" noWrap>
          {card!.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {view === 'mints'
            ? `${getFoilLabel(foil!)} — Mint List`
            : `Card History — ${historyPlayer}`}
        </Typography>
      </Box>
      {isMobile && (
        <IconButton size="small" onClick={onClose}>
          <Close fontSize="small" />
        </IconButton>
      )}
    </Box>
  );

  if (isMobile) {
    return (
      <SwipeableDrawer
        anchor="bottom"
        open={!!selection}
        onOpen={() => {}}
        onClose={onClose}
        disableSwipeToOpen
        PaperProps={{
          sx: {
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Drag handle */}
        <Box sx={{ pt: 1, pb: 0.5, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'divider' }} />
        </Box>
        {header}

      {/* Content */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {view === 'mints' && (
          <>
            {isLoadingMints ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                {mintInfo?.mints.map((mint: MintHistoryItem, idx: number) => (
                  <Box
                    key={mint.uid}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 0.75,
                      px: 1,
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <Box>
                      <Typography variant="body2" component="span" sx={{ fontFamily: 'monospace', color: 'text.secondary', mr: 1 }}>
                        #{mint.mint ? mint.mint.split('/')[0] : idx + 1}
                      </Typography>
                      <Typography variant="body2" component="span">
                        {mint.mint_player || '—'}
                      </Typography>
                    </Box>
                    {mint.mint_player && (
                      <Chip
                        label="History"
                        size="small"
                        variant="outlined"
                        onClick={() => handleHistoryClick(mint)}
                        sx={{ fontSize: '0.65rem', height: 20, cursor: 'pointer' }}
                      />
                    )}
                  </Box>
                ))}
                {mintInfo && mintInfo.mints.length === 0 && (
                  <Typography variant="body2" color="text.secondary" textAlign="center" mt={4}>
                    No mints found
                  </Typography>
                )}
              </Box>
            )}
          </>
        )}

        {view === 'history' && (
          <>
            {historyLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
              </Box>
            ) : historyError ? (
              <Alert severity="error">{historyError}</Alert>
            ) : !cardHistory || cardHistory.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" mt={4}>
                No card history available
              </Typography>
            ) : (
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  {cardHistory.length} transaction{cardHistory.length !== 1 ? 's' : ''}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 'bold', px: 0.5 }}>Date</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 'bold', px: 0.5 }}>Type</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 'bold', px: 0.5 }}>From</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 'bold', px: 0.5 }}>To</TableCell>
                        <TableCell sx={{ fontSize: '0.7rem', fontWeight: 'bold', px: 0.5 }}>Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(cardHistory as CardHistoryItem[]).map((item, index) => (
                        <TableRow key={`${item.card_id}-${index}`} hover>
                          <TableCell sx={{ fontSize: '0.7rem', px: 0.5 }}>
                            {formatDate(item.transfer_date)}
                          </TableCell>
                          <TableCell sx={{ px: 0.5 }}>
                            <Chip
                              label={item.transfer_type.replace('_', ' ')}
                              size="small"
                              color={getTransferTypeColor(item.transfer_type)}
                              sx={{ fontSize: '0.6rem', height: 18 }}
                            />
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', px: 0.5 }}>
                            {item.from_player || '—'}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', px: 0.5 }}>
                            {item.to_player || '—'}
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.7rem', px: 0.5 }}>
                            {item.payment_amount && parseFloat(item.payment_amount) > 0 ? (
                              <Typography variant="body2" fontSize="0.7rem" color="success.main">
                                ${item.payment_amount} {item.payment_currency}
                              </Typography>
                            ) : '—'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </>
        )}
      </Box>
      </SwipeableDrawer>
    );
  }

  // Desktop: sticky side panel
  return (
    <Paper
      elevation={4}
      sx={{
        position: 'sticky',
        top: 80,
        height: 'calc(100vh - 100px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 2,
      }}
    >
      {!selection ? (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%" px={3} gap={1}>
          <Info sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Select a card foil to view mint details
          </Typography>
        </Box>
      ) : (
        <>
          {header}
          {/* Content (reused) */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
            {view === 'mints' && (
              <>
                {isLoadingMints ? (
                  <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box>
                    {mintInfo?.mints.map((mint: MintHistoryItem, idx: number) => (
                      <Box
                        key={mint.uid}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          py: 0.75,
                          px: 1,
                          borderRadius: 1,
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <Box>
                          <Typography variant="body2" component="span" sx={{ fontFamily: 'monospace', color: 'text.secondary', mr: 1 }}>
                            #{mint.mint ? mint.mint.split('/')[0] : idx + 1}
                          </Typography>
                          <Typography variant="body2" component="span">
                            {mint.mint_player || '—'}
                          </Typography>
                        </Box>
                        {mint.mint_player && (
                          <Chip
                            label="History"
                            size="small"
                            variant="outlined"
                            onClick={() => handleHistoryClick(mint)}
                            sx={{ fontSize: '0.65rem', height: 20, cursor: 'pointer' }}
                          />
                        )}
                      </Box>
                    ))}
                    {mintInfo && mintInfo.mints.length === 0 && (
                      <Typography variant="body2" color="text.secondary" textAlign="center" mt={4}>
                        No mints found
                      </Typography>
                    )}
                  </Box>
                )}
              </>
            )}
            {view === 'history' && (
              <>
                {historyLoading ? (
                  <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                  </Box>
                ) : historyError ? (
                  <Alert severity="error">{historyError}</Alert>
                ) : !cardHistory || cardHistory.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" textAlign="center" mt={4}>
                    No card history available
                  </Typography>
                ) : (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      {cardHistory.length} transaction{cardHistory.length !== 1 ? 's' : ''}
                    </Typography>
                    <Divider sx={{ mb: 1 }} />
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 'bold', px: 0.5 }}>Date</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 'bold', px: 0.5 }}>Type</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 'bold', px: 0.5 }}>From</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 'bold', px: 0.5 }}>To</TableCell>
                            <TableCell sx={{ fontSize: '0.7rem', fontWeight: 'bold', px: 0.5 }}>Amount</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(cardHistory as CardHistoryItem[]).map((item, index) => (
                            <TableRow key={`${item.card_id}-${index}`} hover>
                              <TableCell sx={{ fontSize: '0.7rem', px: 0.5 }}>{formatDate(item.transfer_date)}</TableCell>
                              <TableCell sx={{ px: 0.5 }}>
                                <Chip
                                  label={item.transfer_type.replace('_', ' ')}
                                  size="small"
                                  color={getTransferTypeColor(item.transfer_type)}
                                  sx={{ fontSize: '0.6rem', height: 18 }}
                                />
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.7rem', px: 0.5 }}>{item.from_player || '—'}</TableCell>
                              <TableCell sx={{ fontSize: '0.7rem', px: 0.5 }}>{item.to_player || '—'}</TableCell>
                              <TableCell sx={{ fontSize: '0.7rem', px: 0.5 }}>
                                {item.payment_amount && parseFloat(item.payment_amount) > 0 ? (
                                  <Typography variant="body2" fontSize="0.7rem" color="success.main">
                                    ${item.payment_amount} {item.payment_currency}
                                  </Typography>
                                ) : '—'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </>
            )}
          </Box>
        </>
      )}
    </Paper>
  );
}
