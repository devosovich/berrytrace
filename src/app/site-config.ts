/**
 * Site-wide settings that differ per deployment. Values come from `VITE_*` environment variables
 * at build time (a local `.env` file, or repository variables in .github/workflows/deploy.yml);
 * the fallbacks are the placeholders from the design.
 */
export const SITE_CONFIG = {
  /** Public origin of the production site, used for canonical URLs, hreflang and social tags. */
  siteUrl: (import.meta.env.VITE_SITE_URL || 'https://berrytrace.com').replace(/\/$/, ''),

  /**
   * URL the "notify me" form POSTs `{ email, locale }` to as JSON. The site is static (GitHub Pages),
   * so this must be an external mailing-list service or form backend. Empty = not configured yet:
   * the form then shows its server-error state.
   */
  subscribeEndpoint: import.meta.env.VITE_SUBSCRIBE_ENDPOINT ?? '',

  /** WhatsApp number in international format; any spaces or punctuation are stripped for links. */
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '+380 44 000 00 00',

  /** External privacy policy URL for the cookie banner. Empty = the built-in /privacy page. */
  privacyPolicyUrl: import.meta.env.VITE_PRIVACY_POLICY_URL ?? '',

  /**
   * Version of the cookie policy. Raise it when the policy or the list of cookie categories changes:
   * visitors whose stored consent has a lower version see the banner again.
   */
  cookiePolicyVersion: 1,
} as const;

/** `https://wa.me/…` link to the configured number, optionally with a pre-filled message. */
export function whatsappLink(text?: string): string {
  const digits = SITE_CONFIG.whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}
