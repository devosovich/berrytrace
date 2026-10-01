type TranslationFile = { translations: Record<string, string> };

const files = import.meta.glob<TranslationFile>('./*.json', { eager: true, import: 'default' });
const keys = (name: string) => Object.keys(files[`./${name}.json`].translations).sort();

describe('translation files', () => {
  it.each(['en', 'pl'])('%s has exactly the keys of messages.json', (locale) => {
    expect(keys(locale)).toEqual(keys('messages'));
  });

  it('uses readable keys, not generated numeric ids', () => {
    expect(keys('messages').filter((key) => /^\d+$/.test(key))).toEqual([]);
  });

  it.each(['en', 'pl'])('%s has no empty translations', (locale) => {
    const empty = Object.entries(files[`./${locale}.json`].translations).filter(([, value]) => !value.trim());
    expect(empty).toEqual([]);
  });
});
