export const WEB_URL = `https://d36mxiodymuqjm.cloudfront.net/`;
export const SPL_WEB_URL = `https://next.splinterlands.com/`;

// Token to icon URL mapping
export const TOKEN_ICON_MAPPING: Record<string, string> = {
  BETA: `${WEB_URL}website/icons/icon_pack_beta.png`,
  CHAOS: `${WEB_URL}website/icons/img_pack_chaos-legion_200.png`,
  NIGHTMARE: `${WEB_URL}website/icons/img_pack_td_200.png`, // Using chaos icon as fallback
  RIFT: `${WEB_URL}website/ui_elements/open_packs/packsv2/img_pack_riftwatchers_opt.png`, // Using rebellion icon as closest match
  PLOT: `${WEB_URL}website/icons/icon_claim_plot.svg`,
  THE_PROVEN_TITLE: `${WEB_URL}website/icons/icon_title_proven.svg`,
  THE_VETERAN_TITLE: `${WEB_URL}website/icons/icon_title_veteran.svg`,
  THE_RENOWNED_TITLE: `${WEB_URL}website/icons/icon_title_renown.svg`,
};

// Token display names
export const TOKEN_DISPLAY_NAMES: Record<string, string> = {
  BETA: 'Beta Edition',
  CHAOS: 'Chaos Legion',
  NIGHTMARE: 'Nightmare Edition',
  PLOT: 'Land Plot',
  RIFT: 'Rift Edition',
  THE_PROVEN_TITLE: 'The Proven Title',
  THE_VETERAN_TITLE: 'The Veteran Title',
  THE_RENOWNED_TITLE: 'The Renowned Title',
};

// Get icon URL for token
export function getTokenIcon(token: string): string {
  return TOKEN_ICON_MAPPING[token] || `${WEB_URL}website/icon_dec.png`; // Fallback to DEC icon
}

// Get display name for token
export function getTokenDisplayName(token: string): string {
  return TOKEN_DISPLAY_NAMES[token] || token;
}