import { LOCALES, absoluteUrl } from './site';

/** Static "page not found" document: noindex, with links back to each language's home page. */
export function buildNotFound(origin: string): string {
  const links = LOCALES.map((l) => `<a href="${absoluteUrl(origin, l)}">${l.toUpperCase()}</a>`).join(' · ');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Page not found — BerryTrace</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:system-ui,sans-serif;color:#2b2b2b;text-align:center;padding:0 16px}h1{color:#A32639;font-size:3rem;margin:0}a{color:#A32639}</style>
</head>
<body>
<main>
<h1>404</h1>
<p>This page does not exist. / Ця сторінка не існує. / Ta strona nie istnieje.</p>
<p>${links}</p>
</main>
</body>
</html>
`;
}
