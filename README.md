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
