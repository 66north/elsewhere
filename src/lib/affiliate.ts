/**
 * Affiliate link helpers.
 * Builds vendor URLs with affiliate tracking and proper rel attributes.
 */

// Vendor affiliate config — inject partner IDs here as they become available.
const AFFILIATE_IDS: Record<string, Record<string, string>> = {
  amazon: {
    tag: process.env.AMAZON_AFFILIATE_TAG || '',
  },
  autodoc: {
    affid: process.env.AUTODOC_AFFILIATE_ID || '',
  },
  ebay: {
    campid: process.env.EBAY_AFFILIATE_ID || '',
    toolid: '10001',
  },
  megazip: {},
  repco: {},
};

interface VendorConfig {
  name: string;
  region: string;
  color: string;
  searchUrl: string;
}

/**
 * Load vendors from YAML. This would normally be async, but for static generation
 * we can load it at build time via Astro's data collections.
 * For now, this is a typed placeholder — the actual vendor data is in vendors.yml.
 */
export const vendors: Record<string, VendorConfig> = {};

/**
 * Build an affiliate URL for a vendor + OEM number.
 * @param vendor Vendor key (amazon, autodoc, ebay, etc.)
 * @param oem OEM part number
 * @returns Full URL with affiliate tracking + sponsored rel attribute
 */
export function affiliateUrl(vendor: string, oem: string): string {
  // In a real build, this would look up the vendor config from vendors.yml
  // For now, return a placeholder that the migration script can reference
  return `/go/${vendor}/${encodeURIComponent(oem)}`;
}

/**
 * Check if a URL is an affiliate link (i.e., should have rel="sponsored noopener").
 */
export function isAffiliateUrl(url: string): boolean {
  return url.startsWith('/go/');
}

/**
 * Get the rel attributes for a vendor link.
 */
export function getVendorLinkRel(url: string): string {
  return isAffiliateUrl(url) ? 'sponsored noopener' : 'noopener';
}
