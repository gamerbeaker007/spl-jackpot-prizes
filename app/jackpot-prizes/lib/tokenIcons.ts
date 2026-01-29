import { WEB_URL } from "@/lib/utils/staticUrls";

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
  BETA: "Beta Pack",
  CHAOS: "Chaos Legion Pack",
  NIGHTMARE: "Nightmare Pack",
  PLOT: "Land Plot Claim",
  RIFT: "Riftwatcher Pack",
  THE_PROVEN_TITLE: "The Proven Title",
  THE_VETERAN_TITLE: "The Veteran Title",
  THE_RENOWNED_TITLE: "The Renowned Title",
};

// Get icon URL for token
export function getTokenIcon(token: string): string {
  return TOKEN_ICON_MAPPING[token] || `${WEB_URL}website/land/deedOverview/hammer.svg`; // Fallback to Hammer icon
}

// Get display name for token
export function getTokenDisplayName(token: string): string {
  return TOKEN_DISPLAY_NAMES[token] || token;
}
