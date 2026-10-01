# berrytrace

This project was generated with [Analog](https://analogjs.org), the fullstack meta-framework for Angular.

## Setup

Run `npm install` to install the application dependencies.

## Development

Run `npm start` for a dev server. Navigate to `http://localhost:5173/berrytrace/`. The application automatically reloads if you change any of the source files.

## Build

Run `npm run build` to prerender the site. The static output (`/` in English, plus `/en`, `/pl`, `/uk`) is written to `dist/analog/public`; serve it locally with `npm run preview`.

## Deployment (GitHub Pages)

The site is served from `https://devosovich.github.io/berrytrace/`. Every push to `main` builds and publishes it via `.github/workflows/deploy.yml`.

- The subpath is set by `base` in `vite.config.ts`. For a custom domain, change it to `'/'` and add a `public/CNAME` file with the domain.
- Reference public files with relative paths (`images/...`, not `/images/...`) so they resolve against the base.
- The dev server also runs under the base path: `http://localhost:5173/berrytrace/`.

## Configuration

Deployment-specific values are read from `VITE_*` environment variables at build time (`src/app/site-config.ts`). Locally, put them in a `.env` file; on GitHub Pages, add them as repository variables (`SUBSCRIBE_ENDPOINT`, `WHATSAPP_NUMBER`, `PRIVACY_POLICY_URL`), which the deploy workflow passes to the build.

| Variable | Used for | Default |
|---|---|---|
| `VITE_SUBSCRIBE_ENDPOINT` | URL the `/order` form POSTs `{ "email", "locale" }` to (external service — the site is static) | empty: the form shows its error state |
| `VITE_WHATSAPP_NUMBER` | WhatsApp links and number on `/order` | `+380 44 000 00 00` (placeholder) |
| `VITE_SITE_URL` | Public origin used for canonical URLs, `hreflang`, social tags and the sitemap | `https://berrytrace.com` |
| `VITE_BASE` | Vite `base` path | `/berrytrace/` (GitHub Pages project URL); use `/` on the custom domain |
| `VITE_PRIVACY_POLICY_URL` | Link in the cookie banner | empty: the built-in `/privacy` page |

## Cookie consent

The banner (`src/app/cookie-consent/`) stores the choice in `localStorage` under `bt-cookie-consent` as `{ necessary, analytics, marketing, at, v }`. Raise `cookiePolicyVersion` in `site-config.ts` to ask everyone again. Load analytics or marketing code only through the consent service:

```ts
inject(CookieConsent).whenGranted('analytics', () => loadAnalytics());
```

Scripts outside Angular can listen for the `bt:cookie-consent` window event.

## Tests

`npx vitest run` (or `npm test` in watch mode) runs the specs in `src/**/*.spec.ts`.

## Localization

Templates are written in Ukrainian (the source locale) and marked with `i18n` attributes. Translations are loaded at runtime by `provideI18n()` from `src/i18n/<locale>.json`; the locale comes from the URL prefix (`/pl`, `/uk`), and unprefixed URLs (`/`) use English (`defaultLocale: 'en'`). Ukrainian must stay first in the `locales` list in `vite.config.ts`, because Analog treats the first locale as the source.

1. `npm run build`
2. `npm run i18n:extract` — writes the source messages to `src/i18n/messages.json`
3. Copy new message IDs into `src/i18n/en.json` / `src/i18n/pl.json` and translate them. Missing IDs fall back to Ukrainian.

Supported locales are configured in two places: `vite.config.ts` (`i18n` option) and `src/app/i18n.ts`.

## Community

- Visit and Star the [GitHub Repo](https://github.com/analogjs/analog)
- Join the [Discord](https://chat.analogjs.org)
- Follow us on [Twitter](https://twitter.com/analogjs)
- Become a [Sponsor](https://github.com/sponsors/brandonroberts)

## SEO

- Every page calls `Seo.update()` (`src/app/seo.ts`), which writes the canonical URL, `hreflang` alternates (`en`, `pl`, `uk`, `x-default` = English), Open Graph and Twitter tags into the prerendered HTML. The landing page also adds Organization/WebSite JSON-LD. English is canonical at the unprefixed URL (`/about/`), so `/en/about/` points to it.
- The page list lives in `site-pages.json` (used for prerendering and the sitemap). `npm run build` regenerates `public/sitemap.xml` and `public/robots.txt` first (`scripts/generate-sitemap.mjs`). Add a page there and it is picked up everywhere.
- Share image: `public/og-image.jpg` (1200×630).
- Going live on berrytrace.com: set `VITE_BASE=/` for the build, add `public/CNAME` containing `berrytrace.com`, then add the site in Google Search Console and submit `https://berrytrace.com/sitemap.xml`. Canonical URLs already point to berrytrace.com, so they only become valid once the domain serves the site.
