import { PAGES, absoluteUrl, buildRobots, buildSitemap, localePath } from './site';

describe('localePath', () => {
  it('has no prefix for the default locale', () => {
    expect(localePath('en')).toBe('');
    expect(localePath('en', 'about')).toBe('about/');
  });

  it('prefixes other locales', () => {
    expect(localePath('pl')).toBe('pl/');
    expect(localePath('uk', 'customs')).toBe('uk/customs/');
  });

  it('accepts pages with a trailing slash', () => {
    expect(localePath('pl', 'order/')).toBe('pl/order/');
  });
});

describe('absoluteUrl', () => {
  it('joins origin and path, ignoring a trailing slash on the origin', () => {
    expect(absoluteUrl('https://berrytrace.com/', 'pl', 'audit')).toBe('https://berrytrace.com/pl/audit/');
    expect(absoluteUrl('https://berrytrace.com', 'en')).toBe('https://berrytrace.com/');
  });
});

describe('buildSitemap', () => {
  const xml = buildSitemap('https://berrytrace.com');

  it('lists every page once per locale', () => {
    expect(xml.match(/<url>/g)).toHaveLength(PAGES.length * 3);
    expect(xml).toContain('<loc>https://berrytrace.com/</loc>');
    expect(xml).toContain('<loc>https://berrytrace.com/pl/about/</loc>');
    expect(xml).toContain('<loc>https://berrytrace.com/uk/terms/</loc>');
  });

  it('does not list the duplicate /en/ URLs', () => {
    expect(xml).not.toContain('/en/');
  });

  it('adds hreflang alternates including x-default', () => {
    expect(xml).toContain('hreflang="x-default" href="https://berrytrace.com/about/"');
    expect(xml).toContain('hreflang="uk" href="https://berrytrace.com/uk/about/"');
  });
});

describe('buildRobots', () => {
  it('allows crawling and points to the sitemap', () => {
    expect(buildRobots('https://berrytrace.com/')).toBe(
      'User-agent: *\nAllow: /\n\nSitemap: https://berrytrace.com/sitemap.xml\n',
    );
  });
});
