﻿/**
 * Utility functions for generating Splinterlands card image URLs
 */

const WEB_URL = 'https://d36mxiodymuqjm.cloudfront.net/';

/**
 * Generates a safe card image URL with proper validation
 */
export function getCardImageUrl(cardName: string, foil: number = 0): string {
  if (!cardName || !cardName.trim()) {
    console.warn('Invalid card name provided for image URL generation:', cardName);
    return `${WEB_URL}cards_v2.2/placeholder.jpg`;
  }

  const cleanCardName = cardName.trim();
  const encodedName = encodeURIComponent(cleanCardName);

  const foilSuffix = getFoilSuffix(foil);
  return `${WEB_URL}cards_v2.2/${encodedName}${foilSuffix}.jpg`;
}

/**
 * Gets the appropriate file suffix for a foil type
 */
function getFoilSuffix(foil: number): string {
  const FOIL_SUFFIX_MAP: Record<number, string> = {
    0: '',
    1: '_gold',
    2: '_gold',
    3: '_blk',
    4: '_blk',
  };
  return FOIL_SUFFIX_MAP[foil] || '';
}

/**
 * Generates a fallback image URL
 */
export function getFallbackImageUrl(cardName: string): string {
  if (!cardName || !cardName.trim()) {
    return `${WEB_URL}cards_v2.2/placeholder.jpg`;
  }
  const cleanCardName = cardName.trim();
  const encodedName = encodeURIComponent(cleanCardName);
  return `${WEB_URL}cards_v2.2/${encodedName}.jpg`;
}

/**
 * Generates a card image URL with skin support
 * @param cardName - The name of the card
 * @param skin - The skin type (e.g., "Spooky")
 * @returns A complete skin image URL
 */
export function getSkinImageUrl(cardName: string, skin: string): string {
  if (!cardName || !cardName.trim()) {
    console.warn('Invalid card name provided for skin image URL generation:', cardName);
    return `${WEB_URL}cards_v2.2/placeholder.jpg`;
  }

  const cleanCardName = cardName.trim();

  // Special cases for specific card/skin combinations
  if (cleanCardName === "Venari Marksrat") {
    return `${WEB_URL}cards_soulbound/Spooky/Venari%20Marksrat.jpg`;
  } else if (cleanCardName === "Kelya Frendul") {
    return `${WEB_URL}cards_chaos/Spooky/Kelya%20Frendul.jpg`;
  } else if (cleanCardName === "Uraeus") {
    return `${WEB_URL}cards_chaos/Spooky/Uraeus.jpg`;
  }

  // Default skin image path
  const encodedName = encodeURIComponent(cleanCardName);
  return `${WEB_URL}cards_v2.2/${skin}/${encodedName}.jpg`;
}

/**
 * Gets the display label for a foil type
 */
export function getFoilLabel(foil: number): string {
  const FOIL_LABELS: Record<number, string> = {
    0: 'Regular',
    1: 'Gold Foil',
    2: 'Gold Foil Arcane',
    3: 'Black Foil',
    4: 'Black Foil Arcane',
  };
  return FOIL_LABELS[foil] || `Foil ${foil}`;
}
