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

  /**
   * MailerLite only: name of a custom subscriber field (e.g. `language`) that receives the visitor's
   * locale. Empty = the locale is not sent. The field must exist in the MailerLite account and form.
   */
  subscribeLanguageField: import.meta.env.VITE_SUBSCRIBE_LANGUAGE_FIELD ?? '',

  /** Public contact email, shown in the footer and in structured data. */
  contactEmail: 'sales@berrytrace.com',

  /**
   * Company phone number in international format; it is also the WhatsApp number. Spaces and
   * punctuation are stripped for `tel:` and `wa.me` links. Set via VITE_WHATSAPP_NUMBER.
   */
  phoneNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '+380 44 000 00 00',

  /** External privacy policy URL for the cookie banner. Empty = the built-in /privacy page. */
  privacyPolicyUrl: import.meta.env.VITE_PRIVACY_POLICY_URL ?? '',

  /**
   * Version of the cookie policy. Raise it when the policy or the list of cookie categories changes:
   * visitors whose stored consent has a lower version see the banner again.
   */
  cookiePolicyVersion: 1,
} as const;

/** `tel:` link for the configured number. */
export function phoneLink(): string {
  return `tel:+${SITE_CONFIG.phoneNumber.replace(/\D/g, '')}`;
}

/** `https://wa.me/…` link to the configured number, optionally with a pre-filled message. */
export function whatsappLink(text?: string): string {
  const digits = SITE_CONFIG.phoneNumber.replace(/\D/g, '');
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}
